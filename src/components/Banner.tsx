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
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {banners[current].link ? (
            <Link href={banners[current].link || "#"}>
              <div className="relative w-full h-full">
                <Image
                  src={banners[current].image}
                  alt={banners[current].title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-16">
                  <h2 className="text-white text-3xl md:text-6xl font-display italic font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] uppercase tracking-tighter">
                    {banners[current].title}
                  </h2>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={banners[current].image}
                alt={banners[current].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-16">
                <h2 className="text-white text-3xl md:text-6xl font-display italic font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] uppercase tracking-tighter">
                  {banners[current].title}
                </h2>
              </div>
            </div>
          )}
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
