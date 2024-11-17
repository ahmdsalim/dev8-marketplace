<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'name' => 'T-Shirt',
            'description' => 'T-Shirt'
        ]);

        Category::create([
            'name' => 'Hoodie',
            'description' => 'Hoodie'
        ]);

        Category::create([
            'name' => 'Jersey',
            'description' => 'Jersey'
        ]);
    }
}
