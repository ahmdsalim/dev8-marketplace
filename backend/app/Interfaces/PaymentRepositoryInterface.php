<?php

namespace App\Interfaces;

interface PaymentRepositoryInterface
{
    public function store($order_id, $notification);
}
