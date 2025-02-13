<?php

namespace App\Listeners;

use App\Events\NewUserNotification;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User;
use Illuminate\Bus\Queueable;

class SendNewUserNotification implements ShouldQueue
{
    use Queueable;

    public function handle(NewUserNotification $event): void
    {
        try {
            $user = $event->user;
            foreach(User::ofRole('admin')->cursor() as $notifyUser) {
                Notification::create([
                    'type' => 'user',
                    'content' => "$user->name is registered as new user",
                    'user_id' => $notifyUser->id,
                    'created_at' => now()
                ]);
            }
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
        }
    }
}
