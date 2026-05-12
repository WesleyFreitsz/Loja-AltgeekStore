"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BannerItem {
  id: string;
  image: string;
  link?: string | null;
  title: string;
  subtitle?: string | null;
}

interface BannerProps {
  banners: BannerItem[];
}

export default function Banner({ banners }: BannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-[350px] md:h-[600px] overflow-hidden group bg-on-surface">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const swipeThreshold = 50;
            if (info.offset.x < -swipeThreshold) {
              next();
            } else if (info.offset.x > swipeThreshold) {
              prev();
            }
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        >
          {/* Background Layer (Blur) - Clicar aqui passa para a próxima imagem */}
          <div 
            className="absolute inset-0 z-0 cursor-pointer" 
            onClick={next}
          >
            <Image
              src={banners[current].image}
              alt=""
              fill
              className="object-cover blur-3xl opacity-50 scale-110 select-none"
              draggable={false}
            />
          </div>

          {/* Content Layer (Main Image and Link) */}
          <div className="relative h-full flex justify-center items-center z-10 pointer-events-none">
            {banners[current].link ? (
              <Link 
                href={banners[current].link || "#"}
                className="relative h-full flex items-center justify-center pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-full flex items-center justify-center">
                  <img
                    src={banners[current].image}
                    alt={banners[current].title}
                    className="h-full w-auto object-contain select-none"
                    draggable={false}
                  />
                </div>
              </Link>
            ) : (
              <div className="relative h-full flex items-center justify-center pointer-events-auto">
                <img
                  src={banners[current].image}
                  alt={banners[current].title}
                  className="h-full w-auto object-contain select-none"
                  draggable={false}
                />
              </div>
            )}
          </div>

          {/* Text Overlay - Posicionado à esquerda para sair de cima da imagem central */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-24 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="w-full text-left">
              <h2 className="text-white text-2xl md:text-4xl font-display italic font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] uppercase tracking-tighter leading-[0.9]">
                {banners[current].title}
              </h2>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === i ? "bg-primary w-10" : "bg-white/40 w-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
