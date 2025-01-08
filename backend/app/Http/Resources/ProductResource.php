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
        $route = $request->route();
        $isShowSold = $route->uri() === 'api/products' && $request->isMethod('GET');
         
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')) ?? [],
            'slug' => $this->slug,
            'weight' => $this->weight,
            'price' => $this->price,
            'collaboration_id' => $this->collaboration_id ?? null,
            'collaboration' => $this->collaboration->name ?? null,
            'category_id' => $this->category_id,
            'category' => $this->category->name,
            'images' => $this->images,
            'total_stock' => $this->when($this->relationLoaded('variants'), function () {
                return $this->variants->sum('pivot.stock');
            }),
            'sold' => $this->when($isShowSold, $this->sold),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
