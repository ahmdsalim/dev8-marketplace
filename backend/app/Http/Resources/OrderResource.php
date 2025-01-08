<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $route = $request->route();
        $isUserShow = $route->uri() === 'api/data/orders/list' && $request->isMethod('GET');

        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'user_id' => $this->user_id,
            'user' => $this->when($isUserShow, $this->user),
            'status' => $this->status,
            'subtotal' => $this->subtotal,
            'total_amount' => $this->total_amount,
            'delivery_address' => $this->delivery_address,
            'courier' => $this->courier,
            'courier_service' => $this->courier_service,
            'resi_number' => $this->resi_number ?? null,
            'delivery_cost' => $this->delivery_cost,
            'order_items' => $this->whenLoaded('orderitems', null) ?? [],
            'payment' => $this->whenLoaded('payment', null),
            //column for development test
            'snap_token' => $this->snap_token ?? null,
            'payment_url' => $this->payment_url ?? null,
            'need_refund' => $this->need_refund,
            'order_date' => $this->order_date,
            'updated_at' => $this->updated_at,
        ];
    }
}
