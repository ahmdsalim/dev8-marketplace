<?php

namespace App\Interfaces;

interface CollaborationRepositoryInterface
{
    public function index($request, $limit = 10);
    public function getBySlug($slug);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);
}
