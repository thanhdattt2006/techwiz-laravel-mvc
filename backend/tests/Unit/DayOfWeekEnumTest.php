<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Enums\DayOfWeek;
use PHPUnit\Framework\TestCase;

class DayOfWeekEnumTest extends TestCase
{
    public function test_name_of_returns_correct_day_name(): void
    {
        $this->assertEquals('Sunday', DayOfWeek::nameOf(0));
        $this->assertEquals('Monday', DayOfWeek::nameOf(1));
        $this->assertEquals('Tuesday', DayOfWeek::nameOf(2));
        $this->assertEquals('Wednesday', DayOfWeek::nameOf(3));
        $this->assertEquals('Thursday', DayOfWeek::nameOf(4));
        $this->assertEquals('Friday', DayOfWeek::nameOf(5));
        $this->assertEquals('Saturday', DayOfWeek::nameOf(6));
        $this->assertEquals('Unknown', DayOfWeek::nameOf(7));
        $this->assertEquals('Unknown', DayOfWeek::nameOf(-1));
    }

    public function test_map_returns_all_seven_days(): void
    {
        $map = DayOfWeek::map();

        $this->assertCount(7, $map);
        $this->assertEquals('Sunday', $map[0]);
        $this->assertEquals('Saturday', $map[6]);
    }

    public function test_values_returns_zero_through_six(): void
    {
        $this->assertEquals([0, 1, 2, 3, 4, 5, 6], DayOfWeek::values());
    }
}
