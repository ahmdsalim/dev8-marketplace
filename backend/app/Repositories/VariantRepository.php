<?php

namespace App\Repositories;

use App\Models\Variant;
use App\Interfaces\VariantRepositoryInterface;
use Illuminate\Http\Request;

class VariantRepository implements VariantRepositoryInterface
{
    public function index(Request $request, $limit = 10) {
        $search = $request->query('search');
        $query = Variant::query();
        if($search){
            $query->where('name', 'like', '%'.$search.'%')
                  ->orWhere('type', 'like', '%'.$search.'%');
        }

        return $query->paginate($limit);
    }

    public function store(array $data) {
        $variant = Variant::create($data);
        return $variant;
    }

    public function update(array $data, $id) {
        $variant = Variant::findOrFail($id);
        $variant->update($data);
        return $variant;
    }
    public function delete($id) {
        return Variant::destroy($id);
    }
}
