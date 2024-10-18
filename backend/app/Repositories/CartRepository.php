<?php

namespace App\Repositories;

use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use App\Interfaces\CartRepositoryInterface;
use App\Models\Product;

class CartRepository implements CartRepositoryInterface
{
    public function index()
    {
        $cart = Auth::user()->cart()->with('items.product.category')->first();
        $items = $cart ? $cart->items : [];
        return $items;
    }

    public function addToCart($productId, $quantity)
    {
        $cart = Auth::user()->cart()->firstOrCreate();
        
        if(Product::find($productId)->stock < $quantity) {
            throw new \Exception('Product is out of stock');
        }

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

    public function getCheckOutItems($cartItemIds)
    {
        $cart = Auth::user()->cart()->firstOrFail();
        $cartItems = $cart->items()->with('product.category')->whereIn('id', $cartItemIds)->get();

        $outOfStockItems = [];

        foreach ($cartItems as $item) {
            if ($item->product->stock < $item->quantity) {
                $outOfStockItems[] = $item->product->name;
            }
        }

        if (!empty($outOfStockItems)) {
            throw new \Exception('Some items are out of stock');
        }

        return $cartItems;
    }
}
