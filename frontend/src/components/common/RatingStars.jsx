import React from 'react';
import { Star } from 'lucide-react';

/**
 * RatingStars Component
 * Displays 1-5 star ratings with optional interactive selection and review count.
 *
 * @param {number} rating - Current rating value (0 to 5)
 * @param {number} maxStars - Maximum number of stars (default 5)
 * @param {number} reviewsCount - Optional total review count to display
 * @param {'xs'|'sm'|'md'|'lg'} size - Icon size
 * @param {boolean} interactive - Enable click/hover to select rating
 * @param {function} onRatingChange - Callback when interactive rating changes
 * @param {boolean} showScore - Show numerical score badge
 */
export default function RatingStars({
  rating = 5,
  maxStars = 5,
  reviewsCount = null,
  size = 'sm',
  interactive = false,
  onRatingChange = () => {},
  showScore = true,
  className = '',
}) {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const starIconClass = sizeMap[size] || sizeMap.sm;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange(starValue)}
              className={`${
                interactive
                  ? 'cursor-pointer hover:scale-110 transition-transform'
                  : 'cursor-default'
              } p-0.5 focus:outline-none`}
              aria-label={interactive ? `Rate ${starValue} stars` : `${rating} stars`}
            >
              <Star
                className={`${starIconClass} ${
                  isFilled
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-slate-300 fill-slate-100'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showScore && !interactive && (
        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md">
          {Number(rating).toFixed(1)}
        </span>
      )}

      {reviewsCount !== null && (
        <span className="text-xs text-[#475569]">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
}
