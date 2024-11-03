<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'image', 'description'];

    public static function boot()
    {
        parent::boot();

        static::creating(function($category) {
            $category->slug = self::generateUniqueSlug(Str::slug($category->name));
        });

        static::updating(function($category) {
            //check only when name updated
            if($category->isDirty('name')) {
                $category->slug = self::generateUniqueSlug(Str::slug($category->name));
            }
        });
    }

    protected static function generateUniqueSlug($slug)
    {
        $randomString = Str::random(5);
        $slug = $slug . '-' . $randomString;

        return $slug;
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
