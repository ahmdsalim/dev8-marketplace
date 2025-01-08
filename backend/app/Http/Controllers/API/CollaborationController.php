<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use App\Exports\CollaborationsExport;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Resources\CollaborationResource;
use App\Http\Resources\CollaborationCollection;
use App\Http\Requests\StoreCollaborationRequest;
use App\Http\Requests\UpdateCollaborationRequest;
use App\Interfaces\CollaborationRepositoryInterface;

class CollaborationController extends Controller
{
    private CollaborationRepositoryInterface $collaborationRepository;

    public function __construct(CollaborationRepositoryInterface $collaborationRepository)
    {
        $this->collaborationRepository = $collaborationRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $this->collaborationRepository->index($request);
        return ApiResponseClass::sendResponse(new CollaborationCollection($data), 'Collaboration retrieved successfully', 200);
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
    public function store(StoreCollaborationRequest $request)
    {
        $details = [
            'name' => $request->name
        ];

        DB::beginTransaction();
        try {
            $this->collaborationRepository->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse([], 'Collaboration created successfully', 201);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'Collaboration creation failed');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $data = $this->collaborationRepository->getBySlug($slug);
        return ApiResponseClass::sendResponse(new CollaborationResource($data), 'Collaboration retrieved successfully', 200);
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
    public function update(UpdateCollaborationRequest $request, string $id)
    {
        $details = [
            'name' => $request->name
        ];

        DB::beginTransaction();
        try {
            $this->collaborationRepository->update($details, $id);
            DB::commit();
            return ApiResponseClass::sendResponse([], 'Collaboration updated successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'Collaboration update failed');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->collaborationRepository->delete($id);
        return ApiResponseClass::sendResponse([], 'Collaboration deleted successfully', 200);   
    }

    public function export()
    {
        try {
            return Excel::download(new CollaborationsExport, "collaborations-". date('d-m-Y') .".xlsx");
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Collaboration export failed');
        }
    }
}
