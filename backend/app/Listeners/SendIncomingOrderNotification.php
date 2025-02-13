<?php

namespace App\Listeners;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\IncomingOrderNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendIncomingOrderNotification implements ShouldQueue
{
    use Queueable;

    public function handle(IncomingOrderNotification $event): void
    {
        try {
            $order = $event->order;
            foreach(User::ofRole('admin')->cursor() as $notifyUser) {
                Notification::create([
                    'type' => 'order',
                    'content' => "New order received [$order->invoice_number]. Please process and ship order as soon as possible",
                    'user_id' => $notifyUser->id,
                    'created_at' => now()
                ]);
            }
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
        }
    }
}
