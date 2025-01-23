<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\Refund;
use Midtrans\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Interfaces\PaymentRepositoryInterface;
use Exception;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function store($order_id, $notification)
    {
        $message = 'Payment has already been processed';
        $order = Order::where('id', $order_id)->firstOrFail();

        if($order->status === 'pending') {
            $trans_status = $notification->transaction_status;

            if(in_array($trans_status, ['capture', 'settlement'])) {
                //check if payment is not already created
                if(!isset($order->payment)) {
                    $this->createPayment($order, 'paid', $notification);
                }

                //validate stock
                if($this->isStockSufficient($order)) {
                    $order->status = 'processed';
                    $order->save();

                    //decrement product variant stock
                    $this->deductStock($order);

                    $message = 'Payment success';
                } else {
                    $order->status = 'failed';
                    $order->save();

                    $order->payment()->update([
                        'status' => 'refund'
                    ]);

                    //initiate refund process
                    $this->initiateRefund($order_id, $order->total_amount);
                    $message = 'Order failed and payment refunded';
                }

            } else if ($trans_status === 'pending') {
                $this->createPayment($order, 'pending', $notification);
                if(!$this->isStockSufficient($order)) {
                    $response = Transaction::cancel($order_id);
                    Log::info($response . " for order ID {$order_id}");
                    $message = 'Payment is canceled automatically by system';
                }else{
                    $message = 'Payment is still pending';
                }
            } else {
                //check if payment is not already created
                if(!isset($order->payment)) {
                    $this->createPayment($order, 'failed', $notification);
                } else {
                    $order->payment()->update([
                        'status' => 'failed'
                    ]);
                }

                $order->status = 'failed';
                $order->save();

                $message = 'Payment failed';
            }
        }

        return $message;
    }

    /**
     * Check if the stock is sufficient to fulfill the order.
     *
     * @param  \App\Models\Order  $order
     * @return bool
     */
    protected function isStockSufficient($order)
    {
        foreach($order->orderItems as $item) {
            $product_variant = DB::table('product_variant')
                ->where('product_id', $item->product_id)
                ->where('variant_id', $item->variant_id)
                ->first();

            if($product_variant->stock < $item->quantity) {
                return false;
            }
        }

        return true;
    }

    /**
     * Deduct product stock based on the quantity ordered.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    protected function deductStock($order)
    {
        foreach($order->orderItems as $item) {
            DB::table('product_variant')
                ->where('product_id', $item->product_id)
                ->where('variant_id', $item->variant_id)
                ->decrement('stock', $item->quantity);
        }
    }

    /**
     * Initiate the refund process for a failed order.
     *
     * @param  string  $orderId
     * @param  integer  $amount
     * @return void
     */
    protected function initiateRefund($orderId, $amount)
    {
        try {
            //make refund request to midtrans
            $params = [
                'refund_key' => 'refund-' . uniqid(),
                'amount' => $amount,
                'reason' => 'Insufficient stock product'
            ];

            $response = Transaction::refund($orderId, $params);

            if($response['status_code'] == 200){
                //Log refund result
                Log::info("Refund successful for Order ID {$orderId}", ['response' => $response]);

                //Create refund history with status completed
                $this->createRefundHistory($orderId, $response['refund_amount'], $response['status']);
            } else {
                //Log refund on failed
                Log::info("Refund process failed for Order ID {$orderId}: ". $response['transaction_status']);

                throw new Exception("Error on refunding");
            }

        } catch (\Exception $e) {
            if (in_array($e->getCode(), [412, 414, 418])) {
                //Create refund history with status pending
                $this->createRefundHistory($orderId, $amount, 'pending');
                return;
            }
            //Log error
            Log::error("Error Refund: " . $e->getMessage());

            throw new Exception("Error on refunding");
        }
    }

    private function createRefundHistory($orderId, $amount, $status)
    {
        Refund::create([
            'order_id' => $orderId,
            'amount' => $amount,
            'status' => $status,
            'reason' => 'Sorry, your order has been canceled due to insufficient stock'
        ]);
    }

    private function createPayment($order, $status, $notification)
    {
        $order->payment()->create([
            'payment_method' => $notification->payment_type,
            'amount' => (int) $notification->gross_amount,
            'status' => $status,
            'expired_date' => $notification->expiry_time,
            'payment_date' => $notification->transaction_time,
        ]);
    }
}
