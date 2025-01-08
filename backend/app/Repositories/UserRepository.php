<?php

namespace App\Repositories;

use Illuminate\Http\Request;
use App\Interfaces\UserRepositoryInterface;
use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
	public function index(Request $request, $limit = 10)
	{
        $search = $request->query('search');

		if($request->has('limit') && $request->query('limit') <= 50){
			$limit = (integer) $request->query('limit');
		}
        
        $query = User::query();
        
        if($search) {
            $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('email', 'like', '%'.$search.'%')
                ->orWhere('phone', 'like', '%'.$search.'%');
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

	public function getById($id)
	{
		return User::findOrFail($id);
	}

	public function store(array $data)
	{
		return User::create($data);
	}

	public function update(array $data, $id)
	{
		return User::whereId($id)->update($data);
	}

	public function delete($id)
	{
		return User::destroy($id);
	}
}
