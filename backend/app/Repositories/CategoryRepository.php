<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Interfaces\CategoryRepositoryInterface;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function index(Request $request, $limit = 10)
	{
        $search = $request->query('search');
        
        $query = Category::query();
        
        if($search) {
            $query->where('name', 'like', '%'.$search.'%');
        }

		return $query->paginate($limit);
	}

	public function getBySlug($id)
	{
		return Category::where('slug', $id)->firstOrFail();
	}

	public function store(array $data)
	{
		return Category::create($data);
	}

	public function update(array $data, $id)
	{
		$category = Category::findOrFail($id);
		return $category->update($data);
	}

	public function delete($id)
	{
		return Category::destroy($id);
	}
}
