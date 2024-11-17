<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentHandlingRequest;
use App\Interfaces\PaymentRepositoryInterface;
use Midtrans\Notification;

class PaymentController extends Controller
{
    private PaymentRepositoryInterface $paymentRepository;

    public function __construct(PaymentRepositoryInterface $paymentRepository)
    {
        $this->paymentRepository = $paymentRepository;
    }

    public function webhook(PaymentHandlingRequest $request)
    {
        //Initialize midtrans notification to get callback data
        $notification = new Notification();

        DB::beginTransaction();
        try {
            $orderId = $notification->order_id;
            
            $payment_message = $this->paymentRepository->store($orderId, $notification);
            
            DB::commit();
            return ApiResponseClass::sendResponse([], $payment_message, 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'Payment creation failed');
        }
    }
}
