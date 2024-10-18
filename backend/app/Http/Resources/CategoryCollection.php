<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CategoryCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "result" => $this->collection,
            "current_page" => $this->currentPage(),
            "last_page" => $this->lastPage(),
            "per_page" => $this->perPage(),
            "total" => $this->total()
        ];
    }
}
