<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Interfaces\CategoryRepositoryInterface;

class CategoryRepository implements CategoryRepositoryInterface
{
	private $APP_URL;

    public function __construct()
    {
        $this->APP_URL = env('APP_ENV') == 'production' ? env('APP_URL') : env('APP_URL').':'.env('APP_PORT');
    }
	
    public function index(Request $request, $limit = null)
	{
        $search = $request->query('search');

        if($request->has('limit') && $request->query('limit') <= 50){
            $limit = (integer) $request->query('limit');
        }
        
        $query = Category::query();
        
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
		return Category::where('slug', $id)->firstOrFail();
	}

	public function store(array $data)
	{
		try {
			if($data['image']){
				$image = $data['image'];
				$imageName = Str::uuid().'.'.$image->getClientOriginalExtension();
				$image->storeAs('category-images', $imageName, 'public');
				$data['image'] = "$this->APP_URL/storage/category-images/$imageName";
			} else {
				unset($data['image']);
			}

			return Category::create($data);
		} catch (\Exception $e) {
			if($data['image']) {
                $imageName = str_replace($this->APP_URL.'/storage/','',$imageName);
                if(Storage::disk('public')->exists('category-images/'.$imageName)) {
                    Storage::disk('public')->delete('category-images/'.$imageName);
                }
            }
            throw new \Exception($e->getMessage());
		}
	}

	public function update(array $data, $id)
	{
		$category = Category::findOrFail($id);
		try {
            if($data['image']) {
                $image = $data['image'];
                $imageName = Str::uuid().'.'.$image->getClientOriginalExtension();
                $image->storeAs('category-images', $imageName, 'public');
                $data['image'] = "$this->APP_URL/storage/category-images/$imageName";  
                //delete old image if exists
                if($category->image){
                    $oldImage = str_replace($this->APP_URL.'/storage/','',$category->image);
                    //delete old image from public storage
                    Storage::disk('public')->delete($oldImage);
                }
            } else {
                unset($data['image']);
            }
    
            $category->update($data);
    
            return $category;
        } catch (\Exception $e) {
            if($data['image']) {
                $imageName = str_replace($this->APP_URL.'/storage/','',$imageName);
                if(Storage::disk('public')->exists('category-images/'.$imageName)) {
                    Storage::disk('public')->delete('category-images/'.$imageName);
                }
            }
            throw new \Exception($e->getMessage());
        }
	}

	public function delete($id)
	{
		$category = Category::findOrFail($id);
		if($category->image) {
            $oldImage = str_replace($this->APP_URL.'/storage/','',$category->image);
            //delete old image from public storage
            Storage::disk('public')->delete($oldImage);
        }
        $category->delete();

		return $category;
	}
}
