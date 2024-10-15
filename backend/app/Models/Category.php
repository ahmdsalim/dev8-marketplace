<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description'];

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
        $originalSlug = $slug;
        $randomString = Str::random(5);
        $slug = $slug . '-' . $randomString;

        while(Category::where('slug', $slug)->exists()) {
            $randomString = Str::random(5);
            $slug = $originalSlug . '' . $randomString;
        }

        return $slug;
    }
}
