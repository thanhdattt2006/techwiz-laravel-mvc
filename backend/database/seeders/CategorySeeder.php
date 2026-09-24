<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Fresh Vegetables',
                'slug' => 'fresh-vegetables',
                'description' => 'Crisp leafy greens, root vegetables, organic tomatoes and farm-fresh brassicas.',
                'is_active' => true,
            ],
            [
                'name' => 'Orchard Fruits',
                'slug' => 'orchard-fruits',
                'description' => 'Seasonal crisp apples, sweet berries, orchard stone fruits and melons.',
                'is_active' => true,
            ],
            [
                'name' => 'Farm Dairy & Eggs',
                'slug' => 'farm-dairy-eggs',
                'description' => 'Pasture-raised poultry eggs, raw goat cheese, churned butter and artisanal yogurt.',
                'is_active' => true,
            ],
            [
                'name' => 'Artisan Bakery',
                'slug' => 'artisan-bakery',
                'description' => 'Stone-ground sourdough loaves, country baguettes, and fresh hearth pastries.',
                'is_active' => true,
            ],
            [
                'name' => 'Pantry & Raw Honey',
                'slug' => 'pantry-honey',
                'description' => 'Wildflower honey jars, small-batch preserves, pickles and cold-pressed oils.',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
