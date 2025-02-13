<?php

namespace App\Http\Controllers\API;

use App\Classes\ApiResponseClass;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationCollection;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __invoke(Request $request)
    {
        $limit = 10;
        $search = $request->query('search');
        $type = $request->query('type');
        $read = $request->query('read');
        
        if($request->has('limit') && $request->query('limit') <= 50) {
            $limit = $request->query('limit');
        }

        $query = Notification::query()->where('user_id', auth()->id());
        
        if($search) {
            $query->where('content', 'like', '%'.$search.'%');
        }

        if($type && in_array($type, ['user', 'order'])) {
            $query->where('type', $type);
        }

        if($request->has('read') && in_array($read, [0, 1])) {
            $condition = 'whereNull';

            if($read == 1) {
                $condition = 'whereNotNull';
            }
            $query->$condition('read_at');
        }

        $notifications = $query->orderBy('id', 'desc')->paginate($limit);
        return ApiResponseClass::sendResponse(new NotificationCollection($notifications));
    }

    public function read($id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->markAsRead();

            return ApiResponseClass::sendResponse([], 'Notification read successfully');
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Read notification failed');
        }
    }

    public function readAll()
    {
        try {
            Notification::markAllAsRead();

            return ApiResponseClass::sendResponse([], 'All notification read successfully');
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, 'Read all notification failed');
        }
    }
}
