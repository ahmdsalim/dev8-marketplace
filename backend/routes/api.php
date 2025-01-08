<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\VariantController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\RajaOngkirController;
use App\Http\Controllers\API\CollaborationController;
use App\Http\Controllers\API\ResetPasswordController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Controllers\API\RefundController;

Route::prefix('auth')->group(function() {
    Route::get('/unauthenticated', function () {
        if(request()->wantsJson()){
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        return abort(401);
    })->name('login');
    
    Route::controller(AuthController::class)->group(function() {
        Route::post('/register', 'register')->middleware('guest');
        Route::post('/login', 'login')->middleware('guest');
        Route::post('/logout', 'logout')->middleware('auth:sanctum');
    });
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    Route::put('/user/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
    Route::put('/user/update-profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
    Route::post('/forgot-password', [ForgotPasswordController::class, '__invoke'])->middleware('guest');
    Route::post('/reset-password', [ResetPasswordController::class, '__invoke'])->middleware('guest');
    Route::post('/verify-email/{token}', [AuthController::class, 'verifyUser']);
});

//dashboard
Route::get('/getdashboard', [DashboardController::class, '__invoke'])->middleware(['auth:sanctum', 'authtype:admin']);
Route::get('/getorderchart/{period}', [DashboardController::class, 'getOrderChart'])->middleware(['auth:sanctum', 'authtype:admin']);

//delete image product
Route::delete('/products/{id}/images/{imgId}', [ProductController::class, 'destroyImage'])->middleware(['auth:sanctum', 'authtype:admin']);

//product variant
Route::get('/products/{id}/variants', [ProductController::class, 'indexVariant'])->middleware(['auth:sanctum', 'authtype:admin']);
Route::post('/products/{id}/variants', [ProductController::class, 'storeVariant'])->middleware(['auth:sanctum', 'authtype:admin']);
Route::put('/products/{id}/variants/{variantId}', [ProductController::class, 'updateVariant'])->middleware(['auth:sanctum', 'authtype:admin']);
Route::delete('/products/{id}/variants/{variantId}', [ProductController::class, 'destroyVariant'])->middleware(['auth:sanctum', 'authtype:admin']);

//route export
Route::get('/users/export', [UserController::class, 'export'])->middleware(['auth:sanctum', 'authtype:admin']);
Route::get('/products/export', [ProductController::class, 'export'])->middleware(['auth:sanctum', 'authtype:admin']);
Route::get('/categories/export', [CategoryController::class, 'export'])->middleware(['auth:sanctum', 'authtype:admin']);
Route::get('/collaborations/export', [CollaborationController::class, 'export'])->middleware(['auth:sanctum', 'authtype:admin']);
Route::get('/variants/export', [VariantController::class, 'export'])->middleware(['auth:sanctum', 'authtype:admin']);
Route::get('/data/orders/export', [OrderController::class, 'export'])->middleware(['auth:sanctum', 'authtype:admin']);

//update resi number
Route::put('/data/orders/{id}/resi-number', [OrderController::class, 'updateResiNumber'])->middleware(['auth:sanctum', 'authtype:admin']);

//route resource
Route::apiResource('/users', UserController::class)->middleware(['auth:sanctum', 'authtype:admin']);
Route::apiResource('/products', ProductController::class)->middleware(['auth:sanctum', 'authtype:admin']);
Route::apiResource('/categories', CategoryController::class)->middleware(['auth:sanctum', 'authtype:admin']);
Route::apiResource('/collaborations', CollaborationController::class)->middleware(['auth:sanctum', 'authtype:admin']);
Route::apiResource('/variants', VariantController::class)->except('show')->middleware(['auth:sanctum', 'authtype:admin']);

//route public/user
Route::prefix('data')->group(function(){
    Route::get('/products/list', [ProductController::class, 'index']);
    Route::get('/products/list/{slug}', [ProductController::class, 'show']);

    Route::get('/categories/list', [CategoryController::class, 'index']);
    Route::get('/categories/list/{slug}', [CategoryController::class, 'show']);

    Route::get('/collaborations/list', [CollaborationController::class, 'index']);
    Route::get('/collaborations/list/{slug}', [CollaborationController::class, 'show']);
    
    //route order admin
    Route::get('/orders/list', [OrderController::class, 'index'])->middleware(['auth:sanctum', 'authtype:admin']);
    //route order user
    Route::middleware(['auth:sanctum', 'authtype:user'])->controller(OrderController::class)->group(function() {
        Route::get('/orders/user/list', 'getUserOrders');
        Route::get('/orders/list/{order_id}', 'show');
        Route::post('/orders/checkout', 'checkOut');
    });

    //route payment refund
    Route::post('/payment-refund', [RefundController::class, '__invoke'])->middleware(['auth:sanctum', 'authtype:user']);

    //route cart
    Route::middleware(['auth:sanctum', 'authtype:user'])->controller(CartController::class)->group(function() {
        Route::get('/cart/items', 'getCartItems');
        Route::post('/cart/items/add', 'addItem');
        Route::delete('/cart/items/remove/{itemId}', 'removeItem');
        Route::post('/cart/items/increase-qty/{itemId}', 'increaseQty');
        Route::post('/cart/items/decrease-qty/{itemId}', 'decreaseQty');
        Route::post('/cart/items/checkout', 'getCheckOutItems');
    });
    
    //route raja ongkir
    Route::controller(RajaOngkirController::class)->prefix('rajaongkir')->group(function() {
        Route::get('/provinces', 'getProvinces');
        Route::get('/cities/{province_id}', 'getCities');
        Route::post('/delivery-cost', 'getDeliveryCost');
    });
});

//wehbook midtrans
Route::post('/webhooks/midtrans', [PaymentController::class, 'webhook']);

