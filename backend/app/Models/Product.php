<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'weight', 'price', 'images', 'stock', 'category_id', 'collaboration_id'];

    protected $casts = [
        'images' => 'json'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function($product) {
            $product->slug = self::generateUniqueSlug(Str::slug($product->name));
        });

        static::updating(function($product) {
            //check only when name updated
            if($product->isDirty('name')) {
                $product->slug = self::generateUniqueSlug(Str::slug($product->name));
            }
        });
    }

    protected static function generateUniqueSlug($slug)
    {
        $randomString = Str::random(11);
        $slug = $slug . '-' . $randomString;

        return $slug;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function collaboration()
    {
        return $this->belongsTo(Collaboration::class);
    }

    public function variants()
    {
        return $this->hasMany(Variant::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
