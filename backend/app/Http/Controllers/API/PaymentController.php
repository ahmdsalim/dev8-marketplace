<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use App\Interfaces\PaymentRepositoryInterface;

class PaymentController extends Controller
{
    private PaymentRepositoryInterface $paymentRepository;

    public function __construct(PaymentRepositoryInterface $paymentRepository)
    {
        $this->paymentRepository = $paymentRepository;
    }

    public function webhook(Request $request)
    {
        DB::beginTransaction();
        try {
            $request->order_id ?? throw new \Exception();
            
            $midtrans_server_key = env('APP_ENV') == 'production' ? env('MIDTRANS_SERVER_KEY_PROD') : env('MIDTRANS_SERVER_KEY_SANDBOX');
            $midtrans_base_api = env('APP_ENV') == 'production' ? env('MIDTRANS_BASE_API_PROD') : env('MIDTRANS_BASE_API_SANDBOX');
            $auth = base64_encode($midtrans_server_key. ':');

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "Basic $auth"
            ])->get($midtrans_base_api . '/v2/' . $request->order_id . '/status');
            
            $response = json_decode($response->body());

            $message = $this->paymentRepository->store($request->order_id, $response);
            
            DB::commit();
            return ApiResponseClass::sendResponse([], $message, 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'Payment creation failed');
        }
    }
}
