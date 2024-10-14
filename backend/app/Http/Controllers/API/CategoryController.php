<?php

namespace App\Http\Controllers\API;

use App\Classes\ApiResponseClass;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Interfaces\CategoryRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    private CategoryRepositoryInterface $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $this->categoryRepository->index($request);
        return ApiResponseClass::sendResponse(CategoryResource::collection($data), '', 200);
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
    public function store(StoreCategoryRequest $request)
    {
        $details = [
            'name' => $request->name,
            'description' => $request->description,
        ];

        DB::beginTransaction();
        try{
            $category = $this->categoryRepository->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new CategoryResource($category), 'Category created successfully', 201);
        } catch (\Exception $e) {
            ApiResponseClass::rollback($e, 'Category creation failed');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $category = $this->categoryRepository->getBySlug($slug);
        return ApiResponseClass::sendResponse(new CategoryResource($category), '', 200);
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
    public function update(UpdateCategoryRequest $request, string $id)
    {
        $details = [
            'name' => $request->name,
            'description' => $request->description,
        ];

        DB::beginTransaction();
        try {
            $category = $this->categoryRepository->update($details, $id);
            DB::commit();
            return ApiResponseClass::sendResponse([], 'Category updated successfully', 200);
        } catch (\Exception $e) {
            ApiResponseClass::rollback($e, 'Category update failed');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->categoryRepository->delete($id);
        return ApiResponseClass::sendResponse([], 'Category deleted successfully', 200);
    }
}
