<?php

namespace App\Repositories;

use App\Models\Collaboration;
use App\Interfaces\CollaborationRepositoryInterface;

class CollaborationRepository implements CollaborationRepositoryInterface
{
    public function index($request, $limit = 10)
    {
        $search = $request->query('search');

		if($request->has('limit') && $request->query('limit') <= 50){
			$limit = (integer) $request->query('limit');
		}
		
        $query = Collaboration::query();
        
        if($search) {
            $query->where('name', 'like', '%'.$search.'%');
        }

		if($request->has('sortby')){
			$sortDef = array(
				'latest' => 'desc',
				'oldest' => 'asc'
			);

			$sort = $sortDef[$request->query('sortby', 'oldest')];
			$query->orderBy('id', $sort);
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
