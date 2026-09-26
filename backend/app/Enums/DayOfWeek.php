<?php

declare(strict_types=1);

namespace App\Enums;

enum DayOfWeek: int
{
    case Sunday = 0;
    case Monday = 1;
    case Tuesday = 2;
    case Wednesday = 3;
    case Thursday = 4;
    case Friday = 5;
    case Saturday = 6;

    /**
     * Get the human-readable English name of the day.
     */
    public function label(): string
    {
        return $this->name;
    }

    /**
     * Get the day name by numeric day index (0..6).
     */
    public static function nameOf(int $day): string
    {
        return self::tryFrom($day)?->name ?? 'Unknown';
    }

    /**
     * Return all days mapped as [index => name].
     *
     * @return array<int, string>
     */
    public static function map(): array
    {
        return [
            self::Sunday->value => self::Sunday->name,
            self::Monday->value => self::Monday->name,
            self::Tuesday->value => self::Tuesday->name,
            self::Wednesday->value => self::Wednesday->name,
            self::Thursday->value => self::Thursday->name,
            self::Friday->value => self::Friday->name,
            self::Saturday->value => self::Saturday->name,
        ];
    }

    /**
     * Return all valid integer day values [0, 1, 2, 3, 4, 5, 6].
     *
     * @return array<int>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
