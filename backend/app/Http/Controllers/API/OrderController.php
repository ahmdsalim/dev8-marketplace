<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderCollection;
use App\Http\Requests\CheckOutOrderRequest;
use App\Interfaces\OrderRepositoryInterface;

class OrderController extends Controller
{
    private OrderRepositoryInterface $orderRepository;
    public function __construct(OrderRepositoryInterface $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    public function index(Request $request)
    {
        $data = $this->orderRepository->index($request);
        return ApiResponseClass::sendResponse(new OrderCollection($data), '', 200);
    }

    public function getUserOrders(Request $request)
    {
        $data = $this->orderRepository->getUserOrders($request);
        return ApiResponseClass::sendResponse(new OrderCollection($data), '', 200);
    }

    public function checkOut(CheckOutOrderRequest $request)
    {
        DB::beginTransaction();
        try {
            $order = $this->orderRepository->checkOut($request);
            DB::commit();
            return ApiResponseClass::sendResponse(new OrderResource($order), 'Order placed successfully', 201);
        } catch (\Exception $e) {
            $errCodeList = [400, 404, 500];
            $errMsg = in_array($e->getCode(), $errCodeList) ? $e->getMessage() : 'Order placement failed';
            $errCode = in_array($e->getCode(), $errCodeList) ? $e->getCode() : 500;
            return ApiResponseClass::rollback($e, $errMsg, $errCode);
        }
    }

    public function show($id)
    {
        $order = $this->orderRepository->getById($id);

        return ApiResponseClass::sendResponse(new OrderResource($order), '', 200);
    }

}
