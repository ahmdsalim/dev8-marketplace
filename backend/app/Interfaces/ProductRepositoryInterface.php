<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface ProductRepositoryInterface
{
    public function index(Request $request, $limit = 10);
    public function getBySlug($slug);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);
    public function deleteImage($id, $imageId);
}
