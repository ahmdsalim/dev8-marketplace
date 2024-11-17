<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = ['cart_id', 'product_id', 'variant_id', 'quantity', 'price'];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant() {
        return $this->belongsTo(Variant::class);
    }

    //get quantity of product in cart using local scope
    public function scopeGetQuantity($query, $cart_id, $product_id, $variant_id)
    {
        return $query->where('cart_id', $cart_id)
            ->where('product_id', $product_id)
            ->where('variant_id', $variant_id)
            ->select('quantity');
    }
}
