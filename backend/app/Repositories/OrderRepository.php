<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\CartItem;
use Illuminate\Support\Facades\Http;
use App\Interfaces\OrderRepositoryInterface;
use Illuminate\Support\Facades\Log;

class OrderRepository implements OrderRepositoryInterface
{

    public function index($request, $limit = 10)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        
        $query = Order::query();
        
        if($search) {
            $query->where('name', 'like', '%'.$search.'%');
        }

        if($status) {
            $query->where('status', $status);
        }

		return $query->paginate($limit);
    }

    public function getUserOrders($request, $limit = 10)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        
        $query = Order::query()->where('user_id', auth()->id());
        
        if($search) {
            $query->where('name', 'like', '%'.$search.'%');
        }

        if($status) {
            $query->where('status', $status);
        }

		return $query->paginate($limit);
    }

    public function checkOut($request)
    {
        $year = (int) date('y');
        $month = (int) date('m');
        $details = [
            'invoice_number' => generateInvoiceNumber('INV', $year, $month),
            'user_id' => auth()->id(),
            'status' => 'pending',
            'delivery_address' => $request->delivery_address,
            'courier' => $request->courier
        ];

        $order = Order::create($details);
        $total_amount = 0;
        $total_weight = 0;
        //make order items
        foreach($request->cart_item_ids as $cartItemId) {
            $cartItem = CartItem::with('product')->find($cartItemId);
            $order->orderItems()->create([
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->product->price,
            ]);

            //count total amount
            $total_amount += $cartItem->product->price * $cartItem->quantity;
            //count total weight
            $total_weight += $cartItem->product->weight * $cartItem->quantity;

            //decrease stock product
            if($cartItem->product->stock < $cartItem->quantity) {
                throw new \Exception('Insufficient product stock');
            }
            $cartItem->product->stock -= $cartItem->quantity;
            $cartItem->product->save();

            //delete item from cart
            $cartItem->delete();
        }

        //check delivery cost
        $response = Http::withHeaders([
            'key' => env('API_KEY_RAJAONGKIR'),
        ])->post('https://api.rajaongkir.com/starter/cost', [
            'origin'            => env('ORIGIN_CITY'),
            'destination'       => $request->destination,
            'weight'            => $total_weight,
            'courier'           => $request->courier
        ]);
        
        //get delivery cost by service choiced
        $delivery_cost = collect($response['rajaongkir']['results'][0]['costs'])
                    ->firstWhere('service', $request->service)['cost'][0]['value'];
        
        $order->update(['total_amount' => $total_amount, 'delivery_cost' => $delivery_cost]);

        //prepare transaction details
        $params = [
            'transaction_details' => array(
                'order_id' => $order->id,
                'gross_amount' => $total_amount,
            ),
            'customer_details' => array(
                'first_name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'phone' => auth()->user()->phone
            ),
            'item_details' => $order->orderItems->map(function($item) {
                return [
                    'id' => $item->product_id,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'name' => $item->product->name,
                ];
            })->toArray()
        ];

        $midtrans_server_key = env('APP_ENV') == 'production' ? env('MIDTRANS_SERVER_KEY_PROD') : env('MIDTRANS_SERVER_KEY_SANDBOX');
        $midtrans_api_url = env('APP_ENV') == 'production' ? env('MIDTRANS_API_PROD').'/snap/v1/transactions' : env('MIDTRANS_API_SANDBOX').'/snap/v1/transactions';

        $auth = base64_encode($midtrans_server_key);

        //create transaction to midtrans
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => "Basic $auth"
        ])->post($midtrans_api_url, $params);

        $response->onError(function($response) {
            throw new \Exception('Failed to create transaction', $response->status());
        });

        //update transaction token
        if($response->successful()){
            //development using payment url for backend test
            $order->update(['snap_token' => $response['token'], 'payment_url' => $response['redirect_url']]);
        }

        return $order;
    }

    public function getById($id)
    {
        //only user logged in can access their order
        return Order::with(['orderitems', 'payment'])->where('id', $id)->where('user_id', auth()->id())->firstOrFail();
    }
}
