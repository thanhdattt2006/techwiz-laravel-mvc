<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use App\Models\WeeklyStockTemplate;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Generates 20 farm products based on 4 distinct archetypes (Total 20 Products).
     */
    public function run(): void
    {
        $farmer1 = Farmer::where('stall_name', 'Green Valley Organics')->first();
        $farmer2 = Farmer::where('stall_name', 'Sunny Meadow Dairy & Apiary')->first();

        $catVeg = Category::where('slug', 'fresh-vegetables')->first();
        $catFruit = Category::where('slug', 'orchard-fruits')->first();
        $catDairy = Category::where('slug', 'farm-dairy-eggs')->first();
        $catBakery = Category::where('slug', 'artisan-bakery')->first();
        $catPantry = Category::where('slug', 'pantry-honey')->first();

        if (! $farmer1 || ! $farmer2 || ! $catVeg || ! $catFruit || ! $catDairy) {
            return;
        }

        $productArchetypes = [
            // Archetype 1: Vegetables & Greens (Farmer 1)
            [
                'farmer_id' => $farmer1->id,
                'category_id' => $catVeg->id,
                'img' => '/images/categories/fresh-vegetables.webp',
                'items' => [
                    ['name' => 'Organic Rainbow Heirloom Tomatoes', 'desc' => 'Vine-ripened mix of Cherokee Purple, Green Zebra, and Brandywine tomatoes bursting with garden sweetness.', 'price' => 4.50, 'unit' => 'lb', 'stock' => 45.00, 'sat_qty' => 50.00, 'sun_qty' => 30.00],
                    ['name' => 'Crisp Baby Spinach & Peppery Arugula', 'desc' => 'Tender, triple-washed greens harvested early morning for maximum crispness and peppery aroma.', 'price' => 3.75, 'unit' => 'box', 'stock' => 35.00, 'sat_qty' => 40.00, 'sun_qty' => 25.00],
                    ['name' => 'Sweet Tender Butterhead Lettuce', 'desc' => 'Living butterhead lettuce head with roots intact for extended fresh longevity in your refrigerator.', 'price' => 2.80, 'unit' => 'head', 'stock' => 28.00, 'sat_qty' => 30.00, 'sun_qty' => 20.00],
                    ['name' => 'Tri-Color Crunchy Sweet Bell Peppers', 'desc' => 'Sweet red, yellow, and orange thick-walled bell peppers perfect for crisp grilling or snacking.', 'price' => 3.90, 'unit' => 'bag', 'stock' => 22.00, 'sat_qty' => 25.00, 'sun_qty' => 18.00],
                    ['name' => 'Fresh Sweet Golden Bi-Color Corn', 'desc' => 'Locally grown sweet bi-color corn picked daily, sugar-sweet and ready for boiling or oven roasting.', 'price' => 4.00, 'unit' => '4-pack', 'stock' => 40.00, 'sat_qty' => 50.00, 'sun_qty' => 35.00],
                ],
            ],

            // Archetype 2: Orchard Fruits & Berries (Farmer 1)
            [
                'farmer_id' => $farmer1->id,
                'category_id' => $catFruit->id,
                'img' => '/images/categories/orchard-fruits.webp',
                'items' => [
                    ['name' => 'Crisp Handpicked Honeycrisp Apples', 'desc' => 'Extra crisp, sweet-tart juicy Honeycrisp apples cultivated under low-spray integrated orchard care.', 'price' => 5.20, 'unit' => 'bag', 'stock' => 30.00, 'sat_qty' => 40.00, 'sun_qty' => 25.00],
                    ['name' => 'Fresh Picked Sweet Strawberries', 'desc' => 'Fragrant, naturally ripened sweet strawberries picked within 12 hours of market gate opening.', 'price' => 4.80, 'unit' => 'basket', 'stock' => 25.00, 'sat_qty' => 35.00, 'sun_qty' => 20.00],
                    ['name' => 'Wild Highbush Juicy Blueberries', 'desc' => 'Deep indigo berries bursting with antioxidants and rich natural forest sweetness.', 'price' => 5.50, 'unit' => 'pint', 'stock' => 20.00, 'sat_qty' => 25.00, 'sun_qty' => 15.00],
                    ['name' => 'Juicy Golden Yellow Peaches', 'desc' => 'Tree-ripened freestone peaches with velvety blush skin and luscious honeyed aromatic flesh.', 'price' => 6.00, 'unit' => 'bag', 'stock' => 18.00, 'sat_qty' => 20.00, 'sun_qty' => 15.00],
                    ['name' => 'Sweet Black Diamond Blackberries', 'desc' => 'Plump, glossy black forest berries with deep wine-like sweet undertones.', 'price' => 5.25, 'unit' => 'pint', 'stock' => 15.00, 'sat_qty' => 20.00, 'sun_qty' => 10.00],
                ],
            ],

            // Archetype 3: Dairy & Poultry (Farmer 2)
            [
                'farmer_id' => $farmer2->id,
                'category_id' => $catDairy->id,
                'img' => '/images/categories/farm-dairy-eggs.webp',
                'items' => [
                    ['name' => 'Pasture-Raised Brown Hen Eggs', 'desc' => 'Dozen rich amber yolk eggs from free-ranging heritage hens feeding on prairie forage and seeds.', 'price' => 6.50, 'unit' => 'dozen', 'stock' => 50.00, 'sat_qty' => 60.00, 'sun_qty' => 45.00],
                    ['name' => 'Artisanal Raw Chèvre Goat Cheese', 'desc' => 'Handmade creamy fresh chèvre log dusted with garden herbs and French grey sea salt.', 'price' => 7.50, 'unit' => 'piece', 'stock' => 20.00, 'sat_qty' => 25.00, 'sun_qty' => 20.00],
                    ['name' => 'Small-Batch Country Churned Butter', 'desc' => 'Cultured sweet cream butter churned slowly for an 84% butterfat golden flaky richness.', 'price' => 5.80, 'unit' => 'tub', 'stock' => 24.00, 'sat_qty' => 30.00, 'sun_qty' => 20.00],
                    ['name' => 'Grass-Fed Whole Cream Milk', 'desc' => 'Low-temperature pasteurized, non-homogenized whole milk with a rich natural cream line on top.', 'price' => 4.90, 'unit' => 'bottle', 'stock' => 25.00, 'sat_qty' => 30.00, 'sun_qty' => 20.00],
                    ['name' => 'Farmstead Smoked Gouda Wedge', 'desc' => 'Aged 6 months over applewood embers, offering buttery texture with subtle campfire smoky notes.', 'price' => 8.20, 'unit' => 'wedge', 'stock' => 16.00, 'sat_qty' => 20.00, 'sun_qty' => 15.00],
                ],
            ],

            // Archetype 4: Bakery & Pantry (Farmer 2)
            [
                'farmer_id' => $farmer2->id,
                'category_id' => $catPantry ? $catPantry->id : $catBakery->id,
                'items' => [
                    ['name' => 'Pure Raw Prairie Wildflower Honey', 'desc' => 'Unpasteurized golden liquid honey with delicate wildflower pollen notes.', 'price' => 12.00, 'unit' => 'jar', 'stock' => 25.00, 'sat_qty' => 30.00, 'sun_qty' => 20.00, 'category_id' => $catPantry?->id, 'img' => '/images/categories/pantry-honey.webp'],
                    ['name' => 'Stone-Ground Rustic Sourdough Boule', 'desc' => '48-hour cold fermented sourdough with bubbly caramel crust and tender crumb.', 'price' => 6.50, 'unit' => 'loaf', 'stock' => 20.00, 'sat_qty' => 25.00, 'sun_qty' => 15.00, 'category_id' => $catBakery?->id, 'img' => '/images/categories/artisan-bakery.webp'],
                    ['name' => 'Flaky Traditional Butter Croissants', 'desc' => 'Hand-laminated artisanal pastries with layers of grass-fed butter, flaky and tender.', 'price' => 5.00, 'unit' => '2-pack', 'stock' => 18.00, 'sat_qty' => 20.00, 'sun_qty' => 15.00, 'category_id' => $catBakery?->id, 'img' => '/images/categories/artisan-bakery.webp'],
                    ['name' => 'Crunchy Farmhouse Garlic Dill Pickles', 'desc' => 'Pickled Kirby cucumbers steeped in cider vinegar with whole garlic cloves and dill.', 'price' => 6.20, 'unit' => 'jar', 'stock' => 22.00, 'sat_qty' => 25.00, 'sun_qty' => 18.00, 'category_id' => $catPantry?->id, 'img' => '/images/categories/pantry-honey.webp'],
                    ['name' => 'Cold-Pressed Golden Sunflower Seed Oil', 'desc' => 'Virgin unfiltered cold-pressed oil with a nutty aroma, perfect for salads.', 'price' => 9.50, 'unit' => 'bottle', 'stock' => 15.00, 'sat_qty' => 20.00, 'sun_qty' => 12.00, 'category_id' => $catPantry?->id, 'img' => '/images/categories/pantry-honey.webp'],
                ],
            ],
        ];

        foreach ($productArchetypes as $archetype) {
            $farmerId = $archetype['farmer_id'];
            $defaultCatId = $archetype['category_id'];
            $defaultImg = $archetype['img'] ?? null;

            foreach ($archetype['items'] as $item) {
                $product = Product::updateOrCreate(
                    ['farmer_id' => $farmerId, 'name' => $item['name']],
                    [
                        'category_id' => $item['category_id'] ?? $defaultCatId,
                        'description' => $item['desc'],
                        'price' => $item['price'],
                        'unit' => $item['unit'],
                        'stock_quantity' => $item['stock'],
                        'availability' => Product::AVAILABILITY_AVAILABLE,
                        'image' => $item['img'] ?? $defaultImg,
                        'is_hidden' => false,
                        'avg_rating' => 4.90,
                        'review_count' => 6,
                    ]
                );

                WeeklyStockTemplate::updateOrCreate(
                    ['product_id' => $product->id, 'day_of_week' => 6],
                    ['default_quantity' => $item['sat_qty'], 'is_active' => true]
                );

                WeeklyStockTemplate::updateOrCreate(
                    ['product_id' => $product->id, 'day_of_week' => 0],
                    ['default_quantity' => $item['sun_qty'], 'is_active' => true]
                );
            }
        }
    }
}
