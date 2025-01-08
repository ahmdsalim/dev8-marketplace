<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;

class UserVerification
{
    use SerializesModels;

    public $user;
    public $token;

    /**
     * Create a new event instance.
     */
    public function __construct($user, $token)
    {
        $this->user = $user;
        $this->token = $token;
    }
    
}
