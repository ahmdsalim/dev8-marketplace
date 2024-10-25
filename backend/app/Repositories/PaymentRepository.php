<?php

namespace App\Repositories;

use App\Models\Order;
use App\Interfaces\PaymentRepositoryInterface;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function store($order_id, $midtrans_response)
    {
        $message = 'Payment has already been processed';
        $order = Order::where('id', $order_id)->firstOrFail();

        if($order->status === 'pending') {
            $trans_status = $midtrans_response->transaction_status;
    
            if(in_array($trans_status, ['capture', 'settlement'])) {
                $order->status = 'processed';
                
                $order->payment()->update([
                    'status' => 'paid'
                ]);

                $message = 'Payment success';
            } else if ($trans_status === 'pending') {
                $payment = $order->payment;
                //check if payment is not already created
                if(!isset($payment)) {
                    $order->payment()->create([
                        'payment_method' => $midtrans_response->payment_type,
                        'amount' => (int) $midtrans_response->gross_amount,
                        'status' => 'pending',
                        'expired_date' => $midtrans_response->expiry_time,
                        'payment_date' => $midtrans_response->transaction_time,
                    ]);
                }

                $message = 'Payment is still pending';
            } else {
                $order->status = 'failed';

                $order->payment()->update([
                    'status' => 'failed'
                ]);

                $orderitems = $order->orderitems;
                foreach($orderitems as $orderitem) {
                    $product = $orderitem->product;
                    $product->stock += $orderitem->quantity;
                    $product->save();
                }

                $message = 'Payment failed';
            }
    
            $order->save();
        }

        return $message;
    }
}
