<?php

namespace App\Repositories;

use App\Models\Variant;
use App\Interfaces\VariantRepositoryInterface;
use Illuminate\Http\Request;

class VariantRepository implements VariantRepositoryInterface
{
    public function index(Request $request, $limit = null) {
        $search = $request->query('search');

        $request->has('limit') && $limit = (integer) $request->query('limit');

        $query = Variant::query();

        if($search){
            $query->where('name', 'like', '%'.$search.'%')
                  ->orWhere('type', 'like', '%'.$search.'%');
        }

        if($request->has('type') && $request->query('type') !== "all"){
			$query->where('type', 'like', '%'.$request->query('type').'%');
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
