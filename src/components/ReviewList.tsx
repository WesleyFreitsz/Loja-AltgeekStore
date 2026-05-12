"use client";

import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    name: string | null;
  };
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant">
        <p className="text-on-surface-variant font-body">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-on-background font-display">{review.user.name || "Usuário Anônimo"}</span>
              <div className="flex text-tertiary">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-outline"}`} 
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-outline font-label">
              {new Date(review.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <p className="text-on-surface-variant font-body leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
