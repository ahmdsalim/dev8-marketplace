<?php

namespace App\Http\Controllers\API;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use App\Exports\OrdersExport;
use App\Classes\ApiResponseClass;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderCollection;
use App\Http\Requests\CheckOutOrderRequest;
use App\Http\Requests\UpdateResiNumberRequest;
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

    public function export(Request $request)
    {
        try {
            $option = 'all';
            $options_arr = ['all', 'last_week', 'last_month', 'last_year', 'last_3_month', 'last_6_month', 'last_year'];
            $ordersQuery = Order::query();
            $orderItemsQuery = OrderItem::query();

            if($request->has('option') && in_array($request->query('option'), $options_arr)) {
                $option = $request->query('option');
                
                if($option == 'last_week') {
                    $ordersQuery->whereBetween('order_date', [now()->subWeek(), now()]);
                    $orderItemsQuery->whereBetween('created_at', [now()->subWeek(), now()]);
                } else if($option == 'last_month') {
                    $ordersQuery->whereBetween('order_date', [now()->subMonth(), now()]);
                    $orderItemsQuery->whereBetween('created_at', [now()->subMonth(), now()]);
                } else if($option == 'last_year') {
                    $ordersQuery->whereBetween('order_date', [now()->subYear(), now()]);
                    $orderItemsQuery->whereBetween('created_at', [now()->subYear(), now()]);
                } else if($option == 'last_3_month') {
                    $ordersQuery->whereBetween('order_date', [now()->subMonths(3), now()]);
                    $orderItemsQuery->whereBetween('created_at', [now()->subMonths(3), now()]);
                } else if($option == 'last_6_month') {
                    $ordersQuery->whereBetween('order_date', [now()->subMonths(6), now()]);
                    $orderItemsQuery->whereBetween('created_at', [now()->subMonths(6), now()]);
                } else if($option == 'last_year') {
                    $ordersQuery->whereBetween('order_date', [now()->subYear(), now()]);
                    $orderItemsQuery->whereBetween('created_at', [now()->subYear(), now()]);
                }
            }

            $orders = $ordersQuery->get();
            $orderItems = $orderItemsQuery->orderBy('order_id')->get();

            return Excel::download(new OrdersExport($orders, $orderItems, $option), "orders-". date('d-m-Y') .".xlsx");
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Order export failed');
        }
    }

    public function updateResiNumber(UpdateResiNumberRequest $request, $id)
    {
        try {
            $order = Order::where('id', $id)->where('status', 'processed')->firstOrFail();
            $order->resi_number = $request->resi_number;
            $order->save();
    
            return ApiResponseClass::sendResponse(['resi_number' => $request->resi_number], 'Resi number updated successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'Failed to update resi number', 500);
        }
    }

}
