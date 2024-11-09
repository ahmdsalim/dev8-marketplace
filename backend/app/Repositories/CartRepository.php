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
        $cart = Auth::user()->cart()->with(['items' => function($query) {
            $query->select('id', 'cart_id', 'product_id', 'product_variant_id', 'quantity', 'price');
        }, 'items.product' => function($query) {
            $query->select('id', 'name', 'slug', 'price', 'stock', 'weight', 'category_id');
        }, 'items.product.category' => function($query) {
            $query->select('id', 'name', 'slug');
        }, 'items.variant' => function($query) {
            $query->select('id', 'value', 'additional_price');
        }])->first();
        $items = $cart ? $cart->items : [];
        return $items;
    }

    public function addToCart($productId, $productVariantId, $quantity)
    {
        $cart = Auth::user()->cart()->firstOrCreate();
        
        $product = Product::where('id', $productId)->whereHas('variants', function($query) use ($productVariantId) {
            $query->where('id', $productVariantId);
        })->firstOrFail();
        
        if($product->stock < $quantity) {
            throw new \Exception('Product is out of stock');
        }

        $cartItem = $cart->items()->with('product')->firstOrNew(['product_id' => $productId, 'product_variant_id' => $productVariantId]);

        $cartItem->quantity = $cartItem->exists ? $cartItem->quantity + $quantity : $quantity;
        $cartItem->price = $cartItem->exists ? $cartItem->product->price : $product->price;
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

        if ($cartItems->count() !== count($cartItemIds)) {
            throw new \Exception('Invalid cart item id', 400);
        }

        $outOfStockItems = [];

        foreach ($cartItems as $item) {
            if ($item->product->stock < $item->quantity) {
                $outOfStockItems[] = $item->product->name;
            }
        }

        if (!empty($outOfStockItems)) {
            throw new \Exception('Some items are out of stock', 400);
        }

        return $cartItems;
    }
}
