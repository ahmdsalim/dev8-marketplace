<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'size', 'price', 'image', 'stock', 'category_id'];

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
        $originalSlug = $slug;
        $randomString = Str::random(11);
        $slug = $slug . '-' . $randomString;

        while(Product::where('slug', $slug)->exists()) {
            $randomString = Str::random(11);
            $slug = $originalSlug . '' . $randomString;
        }

        return $slug;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
