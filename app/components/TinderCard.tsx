"use client";

import React, { useRef, useState } from "react";

export type SwipeDirection = "left" | "right" | "up" | "down";

interface TinderCardProps {
  children: React.ReactNode;
  onSwipe?: (direction: SwipeDirection) => void;
  onCardLeftScreen?: (direction: SwipeDirection) => void;
  preventSwipe?: SwipeDirection[];
}

const SWIPE_THRESHOLD = 120;

const TinderCard: React.FC<TinderCardProps> = ({
  children,
  onSwipe,
  onCardLeftScreen,
  preventSwipe = [],
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [start, setStart] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const getPoint = (
    e: React.MouseEvent | React.TouchEvent
  ): { x: number; y: number } => {
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
    return {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const point = getPoint(e);
    setStart(point);
    setIsDragging(true);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const point = getPoint(e);

    setPos({
      x: point.x - start.x,
      y: point.y - start.y,
    });
  };

  const handleEnd = () => {
    setIsDragging(false);

    if (pos.x > SWIPE_THRESHOLD && !preventSwipe.includes("right")) {
      swipe("right");
    } else if (pos.x < -SWIPE_THRESHOLD && !preventSwipe.includes("left")) {
      swipe("left");
    } else {
      reset();
    }
  };

  const swipe = (direction: SwipeDirection) => {
    const flyX =
      direction === "right" ? window.innerWidth : -window.innerWidth;

    setPos({ x: flyX, y: pos.y });

    onSwipe?.(direction);

    setTimeout(() => {
      onCardLeftScreen?.(direction);
    }, 300);
  };

  const reset = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.x * 0.05}deg)`,
        transition: isDragging ? "none" : "transform 0.3s ease",
      }}
      className="absolute w-[320px] h-[420px] bg-white rounded-2xl shadow-xl cursor-grab select-none flex items-center justify-center"
    >
      {children}
    </div>
  );
};

export default TinderCard;
