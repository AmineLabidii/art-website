import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, size = 14, className = "" }: StarRatingProps) {
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            className={filled ? "fill-gold text-gold" : "text-stone/40"}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}
