<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'size' => $this->size,
            'slug' => $this->slug,
            'weight' => $this->weight,
            'price' => $this->price,
            'stock' => $this->stock,
            'collaboration' => $this->collaboration->name ?? null,
            'category' => $this->category->name,
            'images' => $this->images,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
