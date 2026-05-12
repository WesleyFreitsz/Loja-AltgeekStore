"use client";

import { useState, useEffect } from "react";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
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

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
}

export default function ReviewSection({ productId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <section id="reviews" className="flex flex-col gap-12 mt-24 border-t-2 border-outline-variant pt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-display text-4xl font-extrabold text-on-background italic">O QUE OS GEEKS DIZEM</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex text-tertiary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i < Math.round(averageRating) ? "fill-current" : "text-outline"}`} />
              ))}
            </div>
            <span className="font-label font-bold text-lg">{averageRating.toFixed(1)} ({reviews.length} avaliações)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-8">
          <h3 className="font-display text-2xl font-bold italic">AVALIAÇÕES</h3>
          <ReviewList reviews={reviews} />
        </div>
        <div className="flex flex-col gap-8">
          <h3 className="font-display text-2xl font-bold italic">DEIXE SUA OPINIÃO</h3>
          <ReviewForm productId={productId} onReviewSubmitted={fetchReviews} />
        </div>
      </div>
    </section>
  );
}
