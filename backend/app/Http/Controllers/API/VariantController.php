<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use App\Exports\VariantsExport;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Resources\VariantResource;
use App\Http\Resources\VariantCollection;
use App\Http\Requests\StoreVariantRequest;
use App\Http\Requests\UpdateVariantRequest;
use App\Interfaces\VariantRepositoryInterface;

class VariantController extends Controller
{
    private VariantRepositoryInterface $variantRepository;
    public function __construct(VariantRepositoryInterface $variantRepository)
    {
        $this->variantRepository = $variantRepository;
    }

    public function index(Request $request)
    {
        try {
            $data = $this->variantRepository->index($request);

            return ApiResponseClass::sendResponse(new VariantCollection($data));
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e);
        }
    }

    public function store(StoreVariantRequest $request)
    {
        $details = [
            'name' => $request->name,
            'type' => $request->type
        ];
        
        DB::beginTransaction();
        try {
            $variant = $this->variantRepository->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new VariantResource($variant), 'Variant created successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'Variant creation failed');
        }
    }

    public function update(UpdateVariantRequest $request, $id)
    {
        $details = [
            'name' => $request->name,
            'type' => $request->type
        ];
        
        DB::beginTransaction();
        try {
            $variant = $this->variantRepository->update($details, $id);
            DB::commit();
            return ApiResponseClass::sendResponse(new VariantResource($variant), 'Variant updated successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    public function destroy($id)
    {
        try {
            $this->variantRepository->delete($id);
            return ApiResponseClass::sendResponse([], 'Variant deleted successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Variant delete failed');
        }
    }

    public function export()
    {
        try {
            return Excel::download(new VariantsExport, "variants-". date('d-m-Y') .".xlsx");
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Variant export failed');
        }
    }
}
