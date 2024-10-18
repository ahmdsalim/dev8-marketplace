<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'amount',
        'payment_method',
        'status',
        'expired_date',
        'payment_date'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
