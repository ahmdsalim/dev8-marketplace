<?php

namespace App\Interfaces;

interface CartRepositoryInterface
{
    public function index();
    public function addToCart($productId, $productVariantId, $quantity);
    public function removeFromCart($itemId);
    public function increaseQty($itemId);
    public function decreaseQty($itemId);
    public function getCheckOutItems($cartItemIds);
}
