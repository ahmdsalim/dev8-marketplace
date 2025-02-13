<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['type', 'content', 'user_id', 'read_at', 'created_at'];

    public $timestamps = false;
    
    protected $dates = [
        'read_at'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function markAsRead()
    {
        return $this->update(['read_at' => now()]);
    }

    static function markAllAsRead()
    {
        return parent::whereNull('read_at')->update(['read_at' => now()]);
    }
}
