import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Neo4JUser } from "../../types/index";

interface SwipeCardProps {
  user: Neo4JUser;
  onSwipe: (direction: "left" | "right") => void;
  isAnimating: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  user,
  onSwipe,
  isAnimating,
}) => {
  const [exitX, setExitX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef(null);

  const handleDragEnd = (
    _event: any,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    if (isAnimating) return;

    const swipeThreshold = 50;
    const swipeVelocity = 500;

    if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      setExitX(1000);
      onSwipe("right");
    } else if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -swipeVelocity
    ) {
      setExitX(-1000);
      onSwipe("left");
    }
  };

  return (
    <motion.div
      ref={ref}
      className="w-80 h-96 bg-white rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden"
      drag="x"
      dragElastic={0.2}
      dragConstraints={{ left: -500, right: 500 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        handleDragEnd(event, info);
      }}
      exit={{ x: exitX, opacity: 0, rotate: exitX > 0 ? 20 : -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={!isDragging ? { y: -10 } : {}}
    >
      {/* Image Container */}
      <div className="relative w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
        {user.photoUrl ? (
          <img
            src={user.photoUrl}
            alt={user.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
            <div className="text-center">
              <div className="text-6xl mb-2">👤</div>
              <p className="text-white text-sm font-medium">{user.fullName}</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />

        {/* User Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          {user.age && (
            <p className="text-sm text-gray-200">{user.age} years old</p>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-3">
        {/* Bio */}
        {user.bio && (
          <div>
            <p className="text-sm text-gray-700 line-clamp-2">{user.bio}</p>
          </div>
        )}

        {/* Hobbies/Interests */}
        {user.hobbies && user.hobbies.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {user.hobbies.map((hobby, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SwipeCard;
