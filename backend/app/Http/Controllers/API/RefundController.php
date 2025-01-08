<?php

namespace App\Http\Controllers\API;

use App\Classes\ApiResponseClass;
use App\Models\Refund;
use Midtrans\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class RefundController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            $refund = Refund::where('order_id', $request->order_id)->where('status', 'pending')->firstOrFail();
            
            $params = [
                'refund_key' => 'refund-' . uniqid(),
                'amount' => $refund->amount,
                'reason' => $refund->reason,
            ];

            $response = Transaction::refund($request->order_id, $params);
    
            if($response['status_code'] == 200){
                //Log refund result
                Log::info("Refund successful for Order ID {$orderId}", ['response' => $response]);
                
                //Update refund history with status completed
                $refund->update(['status' => 'completed']);
            } else {
                //Log refund on failed
                Log::info("Refund process failed for Order ID {$orderId}: ". $response['transaction_status']);

                throw new \Exception("Error on refunding");
            }
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, "Failed to refund", 500);
        }
    }
}
