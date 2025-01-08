<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class OrdersExport implements WithMultipleSheets
{
    protected $orders;
    protected $orderItems;
    protected $option;

    public function __construct($orders, $orderItems, $option)
    {
        $this->orders = $orders;
        $this->orderItems = $orderItems;
        $this->option = $option;
    }

    public function sheets(): array
    {
        return [
            new OrdersSheet($this->orders, $this->option),
            new OrderItemsSheet($this->orderItems, $this->option),
        ];
    }
}
