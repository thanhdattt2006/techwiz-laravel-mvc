<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ContactMessage;
use Illuminate\Database\Seeder;

class ContactMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContactMessage::updateOrCreate(
            ['email' => 'michael.green@heritageorchards.com'],
            [
                'name' => 'Michael Green',
                'subject' => 'New Vendor Registration Inquiry for Spring Season',
                'message' => 'Hello MarketLink team, our family orchard produces organic crisp pears and cider in Kendall County. How can we apply to join the Lincoln Park weekend market?',
                'is_read' => false,
            ]
        );

        ContactMessage::updateOrCreate(
            ['email' => 'community@lincolnparkchamber.org'],
            [
                'name' => 'Lincoln Park Neighborhood Alliance',
                'subject' => 'Community Composting Workshop Collaboration',
                'message' => 'We would love to partner with MarketLink farmers to host a sustainable soil workshop next month during the Saturday market.',
                'is_read' => true,
            ]
        );
    }
}
