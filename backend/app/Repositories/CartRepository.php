<?php

namespace App\Repositories;

use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use App\Interfaces\CartRepositoryInterface;

class CartRepository implements CartRepositoryInterface
{
    public function index()
    {
        $cart = Auth::user()->cart()->with('items.product')->first();
        $items = $cart ? $cart->items : [];
        return $items;
    }

    public function addToCart($productId, $quantity)
    {
        $cart = Auth::user()->cart()->firstOrCreate();
        $cartItem = $cart->items()->with('product')->firstOrNew(['product_id' => $productId]);

        $cartItem->quantity = $cartItem->exists ? $cartItem->quantity + $quantity : $quantity;
        $cartItem->save();

        return $cartItem;
    }

    public function removeFromCart($itemId)
    {
        return CartItem::destroy($itemId);
    }

    public function increaseQty($itemId)
    {
        $cartItem = CartItem::with('product')->find($itemId);

        if ($cartItem) {
            $cartItem->quantity += 1;
            $cartItem->save();
        }

        return $cartItem;
    }

    public function decreaseQty($itemId)
    {
        $cartItem = CartItem::with('product')->findOrFail($itemId);

        if ($cartItem) {
            if ($cartItem->quantity > 1) {
                $cartItem->quantity -= 1;
                $cartItem->save();
            } else {
                $this->removeFromCart($itemId);
                return ['item_removed' => true];
            }
        }

        return $cartItem;
    }
}
