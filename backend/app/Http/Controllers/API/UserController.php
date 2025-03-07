<?php

namespace App\Http\Controllers\API;

use App\Exports\UsersExport;
use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Resources\UserCollection;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Interfaces\UserRepositoryInterface;

class UserController extends Controller
{
    private UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $this->userRepository->index($request);
        
        return ApiResponseClass::sendResponse(new UserCollection($data), '', 200);
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
    public function store(StoreUserRequest $request)
    {
        $details = [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone' => $request->phone,
            'role' => 'user'
        ];

        DB::beginTransaction();
        try {
            $user = $this->userRepository->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new UserResource($user), 'User created successfully', 201);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'User creation failed');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = $this->userRepository->getById($id);

        return ApiResponseClass::sendResponse(new UserResource($user), '', 200);
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
    public function update(UpdateUserRequest $request, string $id)
    {
        $details = [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone
        ];
        
        $request->password && $details['password'] = bcrypt($request->password);

        DB::beginTransaction();
        try {
            $user = $this->userRepository->update($details, $id);
            DB::commit();
            return ApiResponseClass::sendResponse([], 'User updated successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'User update failed');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->userRepository->delete($id);

        return ApiResponseClass::sendResponse([], 'User deleted successfully', 200);
    }

    /**
     * Export data to excel.
     */
    public function export()
    {
        try {
            return Excel::download(new UsersExport, "users-". date('d-m-Y') .".xlsx");
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'User export failed');
        }
    }

}
