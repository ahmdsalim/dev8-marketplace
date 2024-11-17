<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface VariantRepositoryInterface
{
    public function index(Request $request, $limit = 10);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);
}
