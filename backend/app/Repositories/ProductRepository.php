<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Interfaces\ProductRepositoryInterface;

class ProductRepository implements ProductRepositoryInterface
{
    private $APP_URL;

    public function __construct()
    {
        $this->APP_URL = env('APP_ENV') == 'production' ? env('APP_URL') : env('APP_URL').':'.env('APP_PORT');
    }

    public function index(Request $request, $limit = 10)
    {
        $search = $request->query('search');
        $category = $request->query('category');
        $collaboration = $request->query('collaboration');
        
        $query = Product::query();
        
        if($search) {
            $query->where('name', 'like', '%'.$search.'%');
        }

        if($category) {
            $query->where('category_id', $category);
        }

        if($collaboration) {
            $query->where('collaboration_id', $collaboration);
        }

		return $query->paginate($limit);
    }

    public function getBySlug($slug)
    {
        return Product::where('slug', $slug)->firstOrFail();
    }

    public function store(array $data)
    {
        try {
            $image = $data['image'];
            $imageName = Str::uuid().'.'.$image->getClientOriginalExtension();
            $image->storeAs('product-images', $imageName, 'public');
            $data['image'] = "$this->APP_URL/storage/product-images/$imageName";
    
            return Product::create($data);
        } catch (\Exception $e) {
            $imageName = str_replace($this->APP_URL.'/storage/','',$imageName);
            if(Storage::disk('public')->exists('product-images/'.$imageName)) {
                Storage::disk('public')->delete('product-images/'.$imageName);
            }
            throw new \Exception($e->getMessage());
        }
    }

    public function update(array $data, $id)
    {
        $product = Product::findOrFail($id);

        try {
            if($data['image']) {
                $image = $data['image'];
                $imageName = Str::uuid().'.'.$image->getClientOriginalExtension();
                $image->storeAs('product-images', $imageName, 'public');
                $data['image'] = "$this->APP_URL/storage/product-images/$imageName";  
                //delete old image
                $oldImage = str_replace($this->APP_URL.'/storage/','',$product->image);
                //delete old image from public storage
                Storage::disk('public')->delete($oldImage);
            } else {
                unset($data['image']);
            }
    
            $product->update($data);
    
            return $product;
        } catch (\Exception $e) {
            if($data['image']) {
                $imageName = str_replace($this->APP_URL.'/storage/','',$imageName);
                if(Storage::disk('public')->exists('product-images/'.$imageName)) {
                    Storage::disk('public')->delete('product-images/'.$imageName);
                }
            }
            throw new \Exception($e->getMessage());
        }
    }

    public function delete($id)
    {
        $product = Product::findOrFail($id);
        if($product->image) {
            $oldImage = str_replace($this->APP_URL.'/storage/','',$product->image);
            //delete old image from public storage
            Storage::disk('public')->delete($oldImage);
        }
        $product->delete();

        return $product;
    }
}
