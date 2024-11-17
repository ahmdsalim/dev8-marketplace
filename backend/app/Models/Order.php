<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, HasUlids;

    const CREATED_AT = 'order_date';

    protected $fillable = [
        'invoice_number',
        'user_id',
        'status',
        'total_amount',
        'subtotal',
        'delivery_address',
        'courier',
        'delivery_cost',
        'snap_token',
        'payment_url',
    ];

    protected $appends = ['need_refund'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderitems()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function refund()
    {
        return $this->hasOne(Refund::class);
    }
    
    public function getNeedRefundAttribute()
    {
        if($this->refund && in_array($this->refund->status, ['pending', 'failed'])){
            return true;
        }

        return false;
    }
}
