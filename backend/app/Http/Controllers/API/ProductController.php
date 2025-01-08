<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Exports\ProductsExport;
use App\Classes\ApiResponseClass;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductCollection;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductVariantResource;
use App\Interfaces\ProductRepositoryInterface;
use App\Http\Requests\StoreProductVariantRequest;
use App\Http\Requests\UpdateProductVariantRequest;

class ProductController extends Controller
{
    private ProductRepositoryInterface $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $this->productRepository->index($request);

        return ApiResponseClass::sendResponse(new ProductCollection($data), '', 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $details = [
            'name' => $request->name,
            'collaboration_id' => $request->collaboration ?? null,
            'category_id' => $request->category,
            'images' => $request->file('images'),
            'description' => $request->description,
            'variants' => $request->variants,
            'weight' => $request->weight,
            'price' => $request->price
        ];

        DB::beginTransaction();
        try {
            $product = $this->productRepository->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new ProductResource($product), 'Product created successfully', 201);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'Product creation failed');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $product = $this->productRepository->getBySlug($slug);
        return ApiResponseClass::sendResponse(new ProductResource($product), '', 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, string $id)
    {
        $details = [
            'name' => $request->name,
            'collaboration_id' => $request->collaboration ?? null,
            'category_id' => $request->category,
            'images' => $request->file('images') ?? null,
            'description' => $request->description,
            'weight' => $request->weight,
            'price' => $request->price
        ];

        DB::beginTransaction();
        try {
            $product = $this->productRepository->update($details, $id);
            DB::commit();
            return ApiResponseClass::sendResponse([], 'Product updated successfully', 200);
        } catch(\Exception $e) {
            return ApiResponseClass::rollback($e, 'Product update failed');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->productRepository->delete($id);
        return ApiResponseClass::sendResponse([], 'Product deleted successfully', 200);
    }

    public function destroyImage(string $id, string $imageId)
    {
        try {
            $this->productRepository->deleteImage($id, $imageId);
            return ApiResponseClass::sendResponse([], 'Image deleted successfully', 200);
        }  catch(\Exception $e) {
            $isErrorInList = in_array($e->getCode(), [404, 400]);
            $errMsg = $isErrorInList ? $e->getMessage() : 'Image deleted failed';
            $errCode = $isErrorInList ? $e->getCode() : 500;
            return ApiResponseClass::throw($e, $errMsg, $errCode);
        }
    }

    public function indexVariant(string $productId)
    {
        $variants = $this->productRepository->indexVariant($productId);
        return ApiResponseClass::sendResponse(ProductVariantResource::collection($variants), '', 200);
    }

    public function storeVariant(StoreProductVariantRequest $request, string $id)
    {
        $details = [
            'variant_id' => $request->variant_id,
            'stock' => $request->stock,
            'additional_price' => $request->additional_price ?? 0
        ];

        DB::beginTransaction();
        try {
            $variant = $this->productRepository->addVariant($details, $id);
            DB::commit();
            return ApiResponseClass::sendResponse(new ProductVariantResource($variant), 'Product variant added successfully', 200);
        } catch(\Exception $e) {
            return ApiResponseClass::rollback($e, 'Product variant add failed');
        }
        
    }

    public function updateVariant(UpdateProductVariantRequest $request, string $id, string $variantId)
    {
        $details = [
            'stock' => $request->stock
        ];

        if($request->additional_price){
            $details['additional_price'] = $request->additional_price;
        }

        DB::beginTransaction();
        try {
            $variant = $this->productRepository->updateVariant($details, $id, $variantId);
            DB::commit();
            return ApiResponseClass::sendResponse(new ProductVariantResource($variant), 'Product variant updated successfully', 200);
        } catch(\Exception $e) {
            return ApiResponseClass::rollback($e, 'Product variant update failed');
        }
    }

    public function destroyVariant(string $id, string $variantId)
    {
        try {
            $this->productRepository->deleteVariant($id, $variantId);
            return ApiResponseClass::sendResponse([], 'Product variant deleted successfully', 200);
        } catch(\Exception $e) {
            return ApiResponseClass::throw($e, 'Product variant delete failed', 500);
        }
    }

    public function export()
    {
        try {
            return Excel::download(new ProductsExport, "products-". date('d-m-Y') .".xlsx");
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Product export failed');
        }
    }
}
