"use client";

import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="p-8 bg-primary/5 rounded-3xl border-2 border-primary/20 flex flex-col items-center text-center gap-4">
        <h3 className="font-display text-xl font-bold text-on-background">Quer deixar sua opinião?</h3>
        <p className="text-on-surface-variant font-body max-w-md">
          Você precisa estar logado para avaliar este produto e compartilhar sua experiência com outros geeks.
        </p>
        <button 
          onClick={() => router.push(`/login?redirect=/produto/${productId}`)}
          className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold font-label hover:scale-105 transition-transform shadow-md"
        >
          Fazer Login agora
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Por favor, escreva um comentário.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId: user.id,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar avaliação");
      }

      setComment("");
      setRating(5);
      onReviewSubmitted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 bg-surface-container-low rounded-3xl border border-outline-variant shadow-inner">
      <div className="flex flex-col gap-2">
        <label className="font-bold text-on-background font-display text-lg">Sua avaliação</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
            >
              <Star 
                className={`w-8 h-8 ${(hover || rating) >= star ? "fill-tertiary text-tertiary" : "text-outline"}`} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-on-background font-display text-lg">Seu comentário</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="O que você achou dessa peça? O tecido é bom? O tamanho deu certo?"
          className="min-h-[120px] p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant focus:ring-2 focus:ring-primary outline-none text-on-surface font-body resize-none"
        />
        {error && <p className="text-error text-sm font-label font-bold">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-end bg-primary text-on-primary px-8 py-4 rounded-2xl font-bold font-label flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" /> Enviar Avaliação
          </>
        )}
      </button>
    </form>
  );
}
