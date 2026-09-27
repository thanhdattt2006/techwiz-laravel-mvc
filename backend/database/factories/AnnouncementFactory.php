<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'created_by' => User::factory()->create(['role' => User::ROLE_ADMIN]),
            'title' => $this->faker->sentence(5),
            'content' => $this->faker->paragraphs(2, true),
            'target_role' => Announcement::TARGET_ALL,
            'is_active' => true,
        ];
    }
}
