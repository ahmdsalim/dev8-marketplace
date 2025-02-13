<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResiNumberUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    private $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Your #'.$this->order->invoice_number.' is Shipped!')
                    ->greeting('Hello, ' . $notifiable->name . '!')
                    ->line('Your order #'.$this->order->invoice_number.' has been shipped.')
                    ->action('Track Order', 'https://cekresi.com/?noresi=' . $this->order->resi_number)
                    ->line('Order Details:')
                    ->line('Invoice Number: '.$this->order->invoice_number)
                    ->line('Courier: '.$this->order->courier)
                    ->line('Resi Number: '.$this->order->resi_number);
    }
}
