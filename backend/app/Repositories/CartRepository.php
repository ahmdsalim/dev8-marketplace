<?php

namespace App\Repositories;

use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use App\Interfaces\CartRepositoryInterface;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CartRepository implements CartRepositoryInterface
{
    public function index()
    {
        $cart = Auth::user()->cart()->with(['items' => function($query) {
            $query->select('id', 'cart_id', 'product_id', 'variant_id', 'quantity', 'price');
        }, 'items.product' => function($query) {
            $query->select('id', 'name', 'description', 'slug', 'price', 'weight', 'category_id', 'images', 'created_at', 'updated_at');
        }, 'items.product.category' => function($query) {
            $query->select('id', 'name');
        }, 'items.variant' => function($query) {
            $query->select('id', 'name', 'type');
        }])->first();
        $items = $cart ? $cart->items : [];
        return $items;
    }

    public function addToCart($productId, $variantId, $quantity)
    {
        if ($quantity < 1) {
            throw new \Exception('Quantity must be greater than 0', 400);
        }

        $cart = Auth::user()->cart()->firstOrCreate();

        $productVariant = $this->getProductVariant($productId, $variantId);

        $cartItem = $cart->items()->firstOrNew(['product_id' => $productId, 'variant_id' => $variantId]);

        $totalQuantity = $cartItem->exists ? $cartItem->quantity + $quantity : $quantity;

        if ($productVariant->stock < $totalQuantity) {
            throw new \Exception('Product variant is out of stock', 400);
        }
        
        $cartItem->quantity = $totalQuantity;
        $cartItem->price = $productVariant->price + $productVariant->additional_price;
        $cartItem->save();

        return $cartItem;
    }

    private function getProductVariant($productId, $variantId)
    {
        return Product::join('product_variant', 'products.id', '=', 'product_variant.product_id')
            ->join('variants', 'variants.id', '=', 'product_variant.variant_id')
            ->where('products.id', $productId)
            ->where('variants.id', $variantId)
            ->select('products.price as price', 'product_variant.id as product_variant_id', 'product_variant.stock', 'product_variant.additional_price')
            ->firstOrFail();
    }

    public function removeFromCart($itemId)
    {
        return CartItem::destroy($itemId);
    }

    public function increaseQty($itemId)
    {
        $cartItem = CartItem::with('product')->findOrFail($itemId);

        //check product stock
        $product_variant = DB::table('product_variant')
            ->where('product_id', $cartItem->product_id)
            ->where('variant_id', $cartItem->variant_id)
            ->first();

        if ($product_variant->stock < $cartItem->quantity + 1) {
            throw new \Exception('Product variant is out of stock', 400);
        }

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
        $cartItems = $cart->items()->with('product.category', 'variant')->whereIn('id', $cartItemIds)->get();

        if ($cartItems->count() !== count($cartItemIds)) {
            throw new \Exception('Invalid cart item id', 400);
        }

        $isSufficientStock = true;

        foreach ($cartItems as $item) {
            $product_variant = DB::table('product_variant')
                ->where('product_id', $item->product_id)
                ->where('variant_id', $item->variant_id)
                ->first();

            if ($product_variant->stock < $item->quantity) {
                $isSufficientStock = false;
                break;
            }
        }

        if (!$isSufficientStock) {
            throw new \Exception('Some items are out of stock', 400);
        }

        return $cartItems;
    }
}
