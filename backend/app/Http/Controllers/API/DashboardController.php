<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Order;
use App\Classes\ApiResponseClass;
use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $currentMonth = date('m');
        $currentYear = date('Y');
        $lastMonth = date('m', strtotime('-1 month'));
        $lastMonthYear = ($currentMonth === "01") ? date('Y', strtotime('-1 month')) : $currentYear;

        try {
            //User Metrics
            $currentMonthUser = User::ofRole('user')->whereYear('created_at', $currentYear)->whereMonth('created_at', $currentMonth)->count();
            $lastMonthUser = User::ofRole('user')->whereYear('created_at', $lastMonthYear)->whereMonth('created_at', $lastMonth)->count();

            //Order Metrics
            $currentMonthOrder = Order::whereYear('order_date', $currentYear)->whereMonth('order_date', $currentMonth)->count();
            $lastMonthOrder = Order::whereYear('order_date', $lastMonthYear)->whereMonth('order_date', $lastMonth)->count();

            //Revenue Metrics
            $currentMonthRevenue = Order::whereYear('order_date', $currentYear)->whereMonth('order_date', $currentMonth)->where('status', 'processed')->sum('total_amount');
            $lastMonthRevenue = Order::whereYear('order_date', $lastMonthYear)->whereMonth('order_date', $lastMonth)->where('status', 'processed')->sum('total_amount');

            $metrics = [
                'totalUsers' => User::ofRole('user')->count(),
                'totalOrders' => Order::where('status', 'processed')->count(),
                'totalRevenue' => Order::where('status', 'processed')->sum('total_amount'),
                'totalPendingRevenue' => Order::where('status', 'pending')->sum('total_amount'),
                'totalOrdersThisMonth' => $currentMonthOrder,
            ];

            $percentages = [
                'user' => $this->calculatePercentageChange($lastMonthUser, $currentMonthUser),
                'order' => $this->calculatePercentageChange($lastMonthOrder, $currentMonthOrder),
                'revenue' => $this->calculatePercentageChange($lastMonthRevenue, $currentMonthRevenue),
            ];

            $recentOrders = Order::select('id', 'user_id', 'total_amount', 'status')->with('user:id,name,email')->orderBy('order_date', 'desc')->limit(5)->get();

            $data = [
                'metrics' => $metrics,
                'percentages' => $percentages,
                'recentOrders' => $recentOrders
            ];

            return ApiResponseClass::sendResponse($data, 'Dashboard data retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Failed to get dashboard data');
        }
    }

    public function getOrderChart($period = 'week')
    {
        $chartOrder = collect();
        $dateFormat = 'Y-m-d';
        $dateInterval = 'subDays';
        $intervalCount = 6;

        switch ($period) {
            case 'month':
                $dateFormat = 'Y-m';
                $dateInterval = 'subMonths';
                $intervalCount = 11;
                break;
            case 'year':
                $dateFormat = 'Y';
                $dateInterval = 'subYears';
                $intervalCount = 4;
                break;
        }

        for ($i = $intervalCount; $i >= 0; $i--) {
            $date = Carbon::now()->$dateInterval($i)->format($dateFormat);
            $total = Order::whereDate('order_date', 'like', $date . '%')->where('status', 'processed')->sum('total_amount');
            $chartOrder->push([
                'name' => $dateFormat !== 'Y' ? Carbon::parse($date)->format($dateFormat === 'Y-m-d' ? 'd M' : 'M y') : $date,
                'total' => (integer) $total,
            ]);
        }

        return ApiResponseClass::sendResponse($chartOrder, 'Order chart data retrieved successfully');
    }

    function calculatePercentageChange($previous, $current)
    {
        if ($previous == 0) {
            return $current == 0 ? 0 : 100;
        }

        return floor((($current - $previous) / $previous) * 100);
    }
}
