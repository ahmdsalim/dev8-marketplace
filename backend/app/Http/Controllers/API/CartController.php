<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Interfaces\CartRepositoryInterface;

class CartController extends Controller
{
    private CartRepositoryInterface $cartRepository;

    public function __construct(CartRepositoryInterface $cartRepository)
    {
        $this->cartRepository = $cartRepository;
    }

    public function getCartItems()
    {
        $data = $this->cartRepository->index();
        return ApiResponseClass::sendResponse(CartResource::collection($data), '', 200);
    }

    public function addItem(Request $request)
    {
        DB::beginTransaction();
        try {
            $cartItem = $this->cartRepository->addToCart($request->product_id, $request->quantity);
            DB::commit();
            return ApiResponseClass::sendResponse(new CartResource($cartItem), 'Item added to cart', 201);
        } catch (\Exception $e) {
            ApiResponseClass::rollback($e);
        }
    }

    public function removeItem(string $itemId)
    {
        $this->cartRepository->removeFromCart($itemId);
        return ApiResponseClass::sendResponse([], 'Cart item deleted successfully', 200);
    }

    public function increaseQty(string $itemId)
    {
        DB::beginTransaction();
        try {
            $cartItem = $this->cartRepository->increaseQty($itemId);
            DB::commit();
            return ApiResponseClass::sendResponse(new CartResource($cartItem), '', 200);
        } catch(\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    public function decreaseQty(string $itemId)
    {
        DB::beginTransaction();
        try {
            $cartItem = $this->cartRepository->decreaseQty($itemId);
            DB::commit();
            if (is_array($cartItem) && isset($cartItem['item_removed'])) {
                return ApiResponseClass::sendResponse(['item_removed' => true], 'Item removed from cart', 200);
            }
            return ApiResponseClass::sendResponse(new CartResource($cartItem), '', 200);
        } catch(\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }
}
