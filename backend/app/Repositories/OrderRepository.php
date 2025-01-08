<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\CartItem;
use Illuminate\Support\Facades\Http;
use App\Interfaces\OrderRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Midtrans\Snap;

class OrderRepository implements OrderRepositoryInterface
{

    public function index($request, $limit = 10)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        if($request->has('limit') && $request->query('limit') <= 50){
			$limit = (integer) $request->query('limit');
		}
        
        $query = Order::query()->with([
            'orderitems.product:id,name',
            'orderitems.variant:id,name',
            'payment']);
        
        if($search) {
            $query->where('invoice_number', 'like', '%'.$search.'%')
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');
                  });
        }

        if($status) {
            $query->where('status', $status);
        }

        $sortOptions = [
            'latest' => ['id', 'desc'],
            'oldest' => ['id', 'asc'],
            'lowest-amount' => ['total_amount', 'asc'],
            'highest-amount' => ['total_amount', 'desc']
        ];

        $sortby = $request->query('sortby');

        if ($sortby && array_key_exists($sortby, $sortOptions)) {
            $query->orderBy($sortOptions[$sortby][0], $sortOptions[$sortby][1]);
        }

		return $query->paginate($limit);
    }

    public function getUserOrders($request, $limit = 10)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');

        if($request->has('limit') && $request->query('limit') <= 50){
			$limit = (integer) $request->query('limit');
		}
        
        $query = Order::query()->with([
            'orderitems.product:id,category_id,name,images,slug',
            'orderitems.product.category:id,name',
            'orderitems.variant:id,name',
            'payment'])->where('user_id', auth()->id());
        
        if($search) {
            $query->where('invoice_number', 'like', '%'.$search.'%');;
        }

        if($status) {
            $query->where('status', $status);
        }

        $sortOptions = [
            'latest' => ['id', 'desc'],
            'oldest' => ['id', 'asc'],
            'lowest-amount' => ['total_amount', 'asc'],
            'highest-amount' => ['total_amount', 'desc']
        ];

        $sortby = $request->query('sortby');

        if ($sortby && array_key_exists($sortby, $sortOptions)) {
            $query->orderBy($sortOptions[$sortby][0], $sortOptions[$sortby][1]);
        }

        if($start_date && $end_date) {
            $query->whereBetween('order_date', [$start_date, $end_date]);
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
            'courier' => $request->courier,
            'courier_service' => $request->service,
        ];

        $order = Order::create($details);
        $subtotal = 0;
        $total_weight = 0;
        $itemDetails = [];
        //make order items
        foreach($request->cart_item_ids as $cartItemId) {
            $cartItem = CartItem::join('products', 'cart_items.product_id', '=', 'products.id')
                                ->join('variants', 'cart_items.variant_id', '=', 'variants.id')
                                ->join('product_variant', function ($join) {
                                    $join->on('cart_items.product_id', '=', 'product_variant.product_id')
                                         ->on('cart_items.variant_id', '=', 'product_variant.variant_id');
                                })
                                ->join('carts', 'cart_items.cart_id', '=', 'carts.id')
                                ->where('cart_items.id', $cartItemId)
                                ->where('carts.user_id', auth()->id())
                                ->select('cart_items.id', 'cart_items.product_id', 'cart_items.variant_id', 'products.name', 'cart_items.quantity', 'cart_items.price', 'products.weight', 'product_variant.stock', 'product_variant.additional_price')
                                ->first();

            //throw exception if cart item not found
            if(!$cartItem) {
                throw new \Exception('Cart item not found', 404);
            }

            //create order item
            $order->orderItems()->create([
                'product_id' => $cartItem->product_id,
                'variant_id' => $cartItem->variant_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->price + $cartItem->additional_price,
            ]);

            $itemDetails[] = [
                'id' => $cartItem->product_id,
                'name' => $cartItem->name,
                'price' => $cartItem->price,
                'quantity' => $cartItem->quantity
            ];

            //count total amount
            $subtotal += ($cartItem->price + $cartItem->additional_price) * $cartItem->quantity;
            //count total weight
            $total_weight += $cartItem->weight * $cartItem->quantity;

            //validate stock product
            if($cartItem->stock < $cartItem->quantity) {
                throw new \Exception('Insufficient product stock', 400);
            }

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
                    
        //add subtotal + delivery cost to total amount
        $total_amount = $subtotal + $delivery_cost;

        //update total amount and delivery cost
        $order->update(['total_amount' => $total_amount, 'subtotal' => $subtotal, 'delivery_cost' => $delivery_cost]);

        //add shipping cost to item details
        $itemDetails[] = [
            'id' => 'shipping-cost',
            'name' => 'Shipping Cost',
            'price' => $delivery_cost,
            'quantity' => 1
        ];

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
            'item_details' => $itemDetails
        ];

        try {
            //make midtrans transaction
            $transaction = Snap::createTransaction($params);

            //update transaction token and place payment url for backend development test
            $order->update(['snap_token' => $transaction->token, 'payment_url' => $transaction->redirect_url]);
            return $order;
        } catch (\Exception $e) {
            Log::error('Midtrans Error: ' . $e->getMessage());
            throw new \Exception('Failed to create transaction', 500);
        }
    }

    public function getById($id)
    {
        //only user logged in can access their order
        return Order::with([
            'orderitems.product:id,category_id,name,images,slug',
            'orderitems.product.category:id,name',
            'orderitems.variant:id,name',
            'payment'])->where('id', $id)->where('user_id', auth()->id())->firstOrFail();
    }
}
