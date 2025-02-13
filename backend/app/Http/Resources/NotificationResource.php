<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'content' => $this->content,
            'read_at' => $this->read_at ? \Carbon\Carbon::parse($this->read_at)->diffForHumans() : $this->read_at,
            'created_at' => \Carbon\Carbon::parse($this->created_at)->diffForHumans()
        ];
    }
}
