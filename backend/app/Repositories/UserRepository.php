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
        
        $query = User::query();
        
        if($search) {
            $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('email', 'like', '%'.$search.'%')
                ->orWhere('phone', 'like', '%'.$search.'%');
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
