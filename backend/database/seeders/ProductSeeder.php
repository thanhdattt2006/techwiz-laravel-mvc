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
     * Generates 20 farm products based on 4 distinct archetypes looped 5 times with premium naming.
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

        // 4 Archetypes with 5 distinct named variations each (Total 20 Products)
        $productArchetypes = [
            // Archetype 1: Vegetables & Greens (Farmer 1)
            [
                'farmer_id' => $farmer1->id,
                'category_id' => $catVeg->id,
                'items' => [
                    [
                        'name' => 'Organic Rainbow Heirloom Tomatoes',
                        'desc' => 'Vine-ripened mix of Cherokee Purple, Green Zebra, and Brandywine tomatoes bursting with garden sweetness.',
                        'price' => 4.50,
                        'unit' => 'lb',
                        'stock' => 45.00,
                        'img' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 50.00,
                        'sun_qty' => 30.00,
                    ],
                    [
                        'name' => 'Crisp Baby Spinach & Peppery Arugula',
                        'desc' => 'Tender, triple-washed greens harvested early morning for maximum crispness and peppery aroma.',
                        'price' => 3.75,
                        'unit' => 'box',
                        'stock' => 35.00,
                        'img' => 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 40.00,
                        'sun_qty' => 25.00,
                    ],
                    [
                        'name' => 'Sweet Tender Butterhead Lettuce',
                        'desc' => 'Living butterhead lettuce head with roots intact for extended fresh longevity in your refrigerator.',
                        'price' => 2.80,
                        'unit' => 'head',
                        'stock' => 28.00,
                        'img' => 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 30.00,
                        'sun_qty' => 20.00,
                    ],
                    [
                        'name' => 'Tri-Color Crunchy Sweet Bell Peppers',
                        'desc' => 'Sweet red, yellow, and orange thick-walled bell peppers perfect for crisp grilling or snacking.',
                        'price' => 3.90,
                        'unit' => 'bag',
                        'stock' => 22.00,
                        'img' => 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 25.00,
                        'sun_qty' => 18.00,
                    ],
                    [
                        'name' => 'Fresh Sweet Golden Bi-Color Corn',
                        'desc' => 'Locally grown sweet bi-color corn picked daily, sugar-sweet and ready for boiling or oven roasting.',
                        'price' => 4.00,
                        'unit' => '4-pack',
                        'stock' => 40.00,
                        'img' => 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 50.00,
                        'sun_qty' => 35.00,
                    ],
                ],
            ],

            // Archetype 2: Orchard Fruits & Berries (Farmer 1)
            [
                'farmer_id' => $farmer1->id,
                'category_id' => $catFruit->id,
                'items' => [
                    [
                        'name' => 'Crisp Handpicked Honeycrisp Apples',
                        'desc' => 'Extra crisp, sweet-tart juicy Honeycrisp apples cultivated under low-spray integrated orchard care.',
                        'price' => 5.20,
                        'unit' => 'bag',
                        'stock' => 30.00,
                        'img' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 40.00,
                        'sun_qty' => 25.00,
                    ],
                    [
                        'name' => 'Fresh Picked Sweet Strawberries',
                        'desc' => 'Fragrant, naturally ripened sweet strawberries picked within 12 hours of market gate opening.',
                        'price' => 4.80,
                        'unit' => 'basket',
                        'stock' => 25.00,
                        'img' => 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 35.00,
                        'sun_qty' => 20.00,
                    ],
                    [
                        'name' => 'Wild Highbush Juicy Blueberries',
                        'desc' => 'Deep indigo berries bursting with antioxidants and rich natural forest sweetness.',
                        'price' => 5.50,
                        'unit' => 'pint',
                        'stock' => 20.00,
                        'img' => 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 25.00,
                        'sun_qty' => 15.00,
                    ],
                    [
                        'name' => 'Juicy Golden Yellow Peaches',
                        'desc' => 'Tree-ripened freestone peaches with velvety blush skin and luscious honeyed aromatic flesh.',
                        'price' => 6.00,
                        'unit' => 'bag',
                        'stock' => 18.00,
                        'img' => 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 20.00,
                        'sun_qty' => 15.00,
                    ],
                    [
                        'name' => 'Sweet Black Diamond Blackberries',
                        'desc' => 'Plump, glossy black forest berries with deep wine-like sweet undertones.',
                        'price' => 5.25,
                        'unit' => 'pint',
                        'stock' => 15.00,
                        'img' => 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 20.00,
                        'sun_qty' => 10.00,
                    ],
                ],
            ],

            // Archetype 3: Dairy & Poultry (Farmer 2)
            [
                'farmer_id' => $farmer2->id,
                'category_id' => $catDairy->id,
                'items' => [
                    [
                        'name' => 'Pasture-Raised Brown Hen Eggs',
                        'desc' => 'Dozen rich amber yolk eggs from free-ranging heritage hens feeding on prairie forage and seeds.',
                        'price' => 6.50,
                        'unit' => 'dozen',
                        'stock' => 50.00,
                        'img' => 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 60.00,
                        'sun_qty' => 45.00,
                    ],
                    [
                        'name' => 'Artisanal Raw Chèvre Goat Cheese',
                        'desc' => 'Handmade creamy fresh chèvre log dusted with garden herbs and French grey sea salt.',
                        'price' => 7.50,
                        'unit' => 'piece',
                        'stock' => 20.00,
                        'img' => 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 25.00,
                        'sun_qty' => 20.00,
                    ],
                    [
                        'name' => 'Small-Batch Country Churned Butter',
                        'desc' => 'Cultured sweet cream butter churned slowly for an 84% butterfat golden flaky richness.',
                        'price' => 5.80,
                        'unit' => 'tub',
                        'stock' => 24.00,
                        'img' => 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 30.00,
                        'sun_qty' => 20.00,
                    ],
                    [
                        'name' => 'Grass-Fed Whole Cream Milk',
                        'desc' => 'Low-temperature pasteurized, non-homogenized whole milk with a rich natural cream line on top.',
                        'price' => 4.90,
                        'unit' => 'bottle',
                        'stock' => 25.00,
                        'img' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 30.00,
                        'sun_qty' => 20.00,
                    ],
                    [
                        'name' => 'Farmstead Smoked Gouda Wedge',
                        'desc' => 'Aged 6 months over applewood embers, offering buttery texture with subtle campfire smoky notes.',
                        'price' => 8.20,
                        'unit' => 'wedge',
                        'stock' => 16.00,
                        'img' => 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 20.00,
                        'sun_qty' => 15.00,
                    ],
                ],
            ],

            // Archetype 4: Bakery & Pantry (Farmer 2)
            [
                'farmer_id' => $farmer2->id,
                'category_id' => $catPantry ? $catPantry->id : $catBakery->id,
                'items' => [
                    [
                        'name' => 'Pure Raw Prairie Wildflower Honey',
                        'desc' => 'Unpasteurized golden liquid honey with delicate wildflower pollen notes from local prairie apiaries.',
                        'price' => 12.00,
                        'unit' => 'jar',
                        'stock' => 25.00,
                        'img' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 30.00,
                        'sun_qty' => 20.00,
                    ],
                    [
                        'name' => 'Stone-Ground Rustic Sourdough Boule',
                        'desc' => '48-hour cold fermented sourdough with bubbly caramel crust and tender airy crumb structure.',
                        'price' => 6.50,
                        'unit' => 'loaf',
                        'stock' => 20.00,
                        'img' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 25.00,
                        'sun_qty' => 15.00,
                    ],
                    [
                        'name' => 'Flaky Traditional Butter Croissants',
                        'desc' => 'Hand-laminated artisanal pastries with layers of grass-fed butter, flaky and melt-in-your-mouth.',
                        'price' => 5.00,
                        'unit' => '2-pack',
                        'stock' => 18.00,
                        'img' => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 20.00,
                        'sun_qty' => 15.00,
                    ],
                    [
                        'name' => 'Crunchy Farmhouse Garlic Dill Pickles',
                        'desc' => 'Pickled Kirby cucumbers steeped in cider vinegar with whole garlic cloves and fresh garden dill.',
                        'price' => 6.20,
                        'unit' => 'jar',
                        'stock' => 22.00,
                        'img' => 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 25.00,
                        'sun_qty' => 18.00,
                    ],
                    [
                        'name' => 'Cold-Pressed Golden Sunflower Seed Oil',
                        'desc' => 'Virgin unfiltered cold-pressed oil with a nutty aroma, perfect for fresh salads and dressings.',
                        'price' => 9.50,
                        'unit' => 'bottle',
                        'stock' => 15.00,
                        'img' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
                        'sat_qty' => 20.00,
                        'sun_qty' => 12.00,
                    ],
                ],
            ],
        ];

        // Iterate through the 4 archetypes x 5 items = exactly 20 products
        foreach ($productArchetypes as $archetype) {
            $farmerId = $archetype['farmer_id'];
            $categoryId = $archetype['category_id'];

            foreach ($archetype['items'] as $item) {
                $product = Product::updateOrCreate(
                    [
                        'farmer_id' => $farmerId,
                        'name' => $item['name'],
                    ],
                    [
                        'category_id' => $categoryId,
                        'description' => $item['desc'],
                        'price' => $item['price'],
                        'unit' => $item['unit'],
                        'stock_quantity' => $item['stock'],
                        'availability' => Product::AVAILABILITY_AVAILABLE,
                        'image' => $item['img'],
                        'is_hidden' => false,
                        'avg_rating' => 4.90,
                        'review_count' => 6,
                    ]
                );

                // Add Saturday (day 6) template
                WeeklyStockTemplate::updateOrCreate(
                    ['product_id' => $product->id, 'day_of_week' => 6],
                    ['default_quantity' => $item['sat_qty'], 'is_active' => true]
                );

                // Add Sunday (day 0) template
                WeeklyStockTemplate::updateOrCreate(
                    ['product_id' => $product->id, 'day_of_week' => 0],
                    ['default_quantity' => $item['sun_qty'], 'is_active' => true]
                );
            }
        }
    }
}
