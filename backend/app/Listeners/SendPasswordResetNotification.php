<?php

namespace App\Listeners;

use App\Notifications\AfterPasswordReset;
use Illuminate\Auth\Events\PasswordReset;

class SendPasswordResetNotification
{
    /**
     * Handle the event.
     *
     * @param  PasswordReset  $event
     * @return void
     */
    public function handle(PasswordReset $event)
    {
        $event->user->notify(new AfterPasswordReset());
    }
}
