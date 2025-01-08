<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserVerification extends Notification implements ShouldQueue
{
    use Queueable;
    
    private $url;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->url = url(config(('app.frontend_url')) . '/verify-email/' . $token);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
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
                    ->subject(config('app.name').' Email Verification')
                    ->greeting('Hello, ' . $notifiable->name . '!')
                    ->line('Please click the button below to verify your email address.')
                    ->action('Verify Email', $this->url);
    }
}
