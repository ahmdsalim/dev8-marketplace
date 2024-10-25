<?php

namespace App\Repositories;

use App\Models\Collaboration;
use App\Interfaces\CollaborationInterface;

class CollaborationRepository implements CollaborationInterface
{
    public function index($request, $limit = 10)
    {
        $search = $request->query('search');
        
        $query = Collaboration::query();
        
        if($search) {
            $query->where('name', 'like', '%'.$search.'%');
        }

		return $query->paginate($limit);
    }

    public function getBySlug($id)
	{
		return Collaboration::where('slug', $id)->firstOrFail();
	}

	public function store(array $data)
	{
		return Collaboration::create($data);
	}

	public function update(array $data, $id)
	{
		$collaboration = Collaboration::findOrFail($id);
		return $collaboration->update($data);
	}

	public function delete($id)
	{
		return Collaboration::destroy($id);
	}
}
