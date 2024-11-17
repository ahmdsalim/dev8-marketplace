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
        
        $query = Product::query()->with('variants');
        
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
        return Product::with('variants')->where('slug', $slug)->firstOrFail();
    }

    public function store(array $data)
    {
        try {
            $images = $data['images'];
            
            $uploadedImg = [];

            foreach($images as $image) {
                $imageName = Str::uuid().'.'.$image->getClientOriginalExtension();
                $image->storeAs('product-images', $imageName, 'public');
                $imgId = Str::random(2);
                $uploadedImg[] = [
                    'id' => $imgId,
                    'image' => "$this->APP_URL/storage/product-images/$imageName"
                ];
            }

            $data['images'] = $uploadedImg;
            
            $product_variant = [];
            foreach($data['variants'] as $variant) {
                $product_variant[$variant['id']] = [
                    'stock' => $variant['stock'],
                    'additional_price' => $variant['additional_price'] ?? 0
                ];
            }

            //delete variants key from product data
            unset($data['variants']);
    
            $product = Product::create($data);

            $product->variants()->attach($product_variant);

            return $product;
        } catch (\Exception $e) {
            foreach($uploadedImg as $image) {
                $imageName = str_replace($this->APP_URL.'/storage/','',$image['image']);
                if(Storage::disk('public')->exists('product-images/'.$imageName)) {
                    Storage::disk('public')->delete('product-images/'.$imageName);
                }
            }
            throw new \Exception($e->getMessage());
        }
    }

    public function update(array $data, $id)
    {
        $product = Product::findOrFail($id);
        $uploadedImg = [];

        try {
            $newImages = $data['images'];
            if($newImages) {
                $images = $product->images;
                foreach ($newImages as $image) {
                    $imageName = Str::uuid().'.'.$image->getClientOriginalExtension();
                    $image->storeAs('product-images', $imageName, 'public');
                    $imgId = Str::random(2);
                    $imageData = [
                        'id' => $imgId,
                        'image' => "$this->APP_URL/storage/product-images/$imageName"
                    ];

                    //push to updated image
                    $images[] = $imageData;
                    //push to uploaded image for tracking
                    $uploadedImg[] = $imageData;
                }
                $data['images'] = $images;
            } else {
                unset($data['images']);
            }
    
            $product->update($data);
    
            return $product;
        } catch (\Exception $e) {
            if($newImages) {
                foreach ($uploadedImg as $image) {
                    $imageName = str_replace($this->APP_URL.'/storage/','',$image['image']);
                    if(Storage::disk('public')->exists('product-images/'.$imageName)) {
                        Storage::disk('public')->delete('product-images/'.$imageName);
                    }
                }
            }
            throw new \Exception($e->getMessage());
        }
    }

    public function delete($id)
    {
        $product = Product::findOrFail($id);
        if(count($product->images) > 0) {
            foreach ($product->images as $image) {
                $oldImage = str_replace($this->APP_URL.'/storage/','',$image['image']);
                //delete old image from public storage
                Storage::disk('public')->delete($oldImage);
            }
        }
        $product->delete();

        return $product;
    }

    public function deleteImage($id, $imgId)
    {
        $product = Product::findOrFail($id);
        $images = collect($product->images);
        
        $selectedImg = $images->where('id', $imgId)->first();
        
        if(!$selectedImg) throw new \Exception('Image not found', 404);
        if(count($product->images) === 2) throw new \Exception('A product must have at least two image', 400);

        $oldImage = str_replace($this->APP_URL.'/storage/','',$selectedImg['image']);
        Storage::disk('public')->delete($oldImage);

        $images = $images->reject(function($image) use ($imgId) {
            return $image['id'] === $imgId;
        });

        $product->images = $images->values()->all();
        $product->save();

        return $product;
    }

    public function addVariant(array $data, $id)
    {
        $product = Product::findOrFail($id);

        $product->variants()->attach($data['variant_id'], [
            'stock' => $data['stock'],
            'additional_price' => $data['additional_price'] ?? 0
        ]);

        $variant = $product->variants()->where('variant_id', $data['variant_id'])->first();

        return $variant;
    }

    public function updateVariant(array $data, $id, $variantId)
    {
        $product = Product::findOrFail($id);
        $product->variants()->updateExistingPivot($variantId, $data);

        $variant = $product->variants()->where('variant_id', $variantId)->first();

        return $variant;
    }

    public function deleteVariant($id, $variantId)
    {
        $product = Product::findOrFail($id);
        $variant = $product->variants()->detach($variantId);

        return $variant;
    }
}
