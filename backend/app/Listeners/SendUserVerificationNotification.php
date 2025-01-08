<?php

namespace App\Listeners;

use App\Events\UserVerification;
use App\Notifications\UserVerification as UserVerificationNotification;

class SendUserVerificationNotification
{
    /**
     * Handle the event.
     */
    public function handle(UserVerification $event): void
    {
        $event->user->notify(new UserVerificationNotification($event->token));
    }
}
