<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Collaboration extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'slug', 'description'];

    public static function boot()
    {
        parent::boot();

        static::creating(function($collaboration) {
            $collaboration->slug = self::generateUniqueSlug(Str::slug($collaboration->name));
        });

        static::updating(function($collaboration) {
            //check only when name updated
            if($collaboration->isDirty('name')) {
                $collaboration->slug = self::generateUniqueSlug(Str::slug($collaboration->name));
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
