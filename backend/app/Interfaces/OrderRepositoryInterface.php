<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface OrderRepositoryInterface
{
    public function index(Request $request, $limit = 10);
    public function checkOut(Request $request);
    public function getById($id);
}
