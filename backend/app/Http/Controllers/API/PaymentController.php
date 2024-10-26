<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentHandlingRequest;
use Illuminate\Support\Facades\Http;
use App\Interfaces\PaymentRepositoryInterface;

class PaymentController extends Controller
{
    private PaymentRepositoryInterface $paymentRepository;

    public function __construct(PaymentRepositoryInterface $paymentRepository)
    {
        $this->paymentRepository = $paymentRepository;
    }

    public function webhook(PaymentHandlingRequest $request)
    {
        DB::beginTransaction();
        try {
            $midtrans_server_key = env('APP_ENV') == 'production' ? env('MIDTRANS_SERVER_KEY_PROD') : env('MIDTRANS_SERVER_KEY_SANDBOX');
            
            //verify request using signature key
            $signature_key = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . $midtrans_server_key);

            if ($request->signature_key != $signature_key) {
                return response()->json(['success' => false, 'message' => 'Invalid signature key'], 400);
            }

            $message = $this->paymentRepository->store($request->order_id, $request);
            
            DB::commit();
            return ApiResponseClass::sendResponse([], $message, 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'Payment creation failed');
        }
    }
}
