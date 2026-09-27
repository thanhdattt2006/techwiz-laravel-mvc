<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\FarmerMarket;
use Illuminate\Support\Carbon;

class TimeSlotGeneratorService
{
    /**
     * Generate available pickup time slots for a given farmer stall at a market on a specific date.
     *
     * @return array<int, array<string, mixed>>
     */
    public function generateSlots(FarmerMarket $farmerMarket, string $pickupDate): array
    {
        $date = Carbon::parse($pickupDate);
        $dayOfWeek = $date->dayOfWeek; // 0 = Sunday, 6 = Saturday

        $pickupDays = $farmerMarket->pickup_days ?? [];
        if (! in_array($dayOfWeek, $pickupDays, true)) {
            return [];
        }

        $slotMinutes = $farmerMarket->slot_minutes > 0 ? (int) $farmerMarket->slot_minutes : 30;
        $cutoffHours = (int) $farmerMarket->cutoff_hours;

        $startTimeStr = substr((string) $farmerMarket->pickup_start_time, 0, 5);
        $endTimeStr = substr((string) $farmerMarket->pickup_end_time, 0, 5);

        $currentSlotStart = Carbon::parse("{$pickupDate} {$startTimeStr}");
        $overallEnd = Carbon::parse("{$pickupDate} {$endTimeStr}");
        $now = Carbon::now();

        $slots = [];

        while ($currentSlotStart->lt($overallEnd)) {
            $currentSlotEnd = $currentSlotStart->copy()->addMinutes($slotMinutes);
            if ($currentSlotEnd->gt($overallEnd)) {
                $currentSlotEnd = $overallEnd->copy();
            }

            $slotCutoff = $currentSlotStart->copy()->subHours($cutoffHours);
            $isCutoffPassed = $now->gte($slotCutoff);

            $slots[] = [
                'start_time' => $currentSlotStart->format('H:i'),
                'end_time' => $currentSlotEnd->format('H:i'),
                'label' => $currentSlotStart->format('H:i') . ' - ' . $currentSlotEnd->format('H:i'),
                'cutoff_at' => $slotCutoff->toISOString(),
                'is_available' => ! $isCutoffPassed,
                'cutoff_passed' => $isCutoffPassed,
            ];

            $currentSlotStart->addMinutes($slotMinutes);
        }

        return $slots;
    }
}
