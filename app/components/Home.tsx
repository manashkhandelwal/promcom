"use client";

import { Neo4JUser } from "@/types";
import TinderCard from "react-tinder-card";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { neo4jSwipe } from "../neo4j.action";
import HeaderPfp from "../components/HeaderPfp";
import { X, Heart } from "lucide-react";

interface HomepageClientComponentProps {
  currentUser: Neo4JUser;
  users: Neo4JUser[];
}

const HomepageClientComponent: React.FC<HomepageClientComponentProps> = ({
  currentUser,
  users,
}) => {
  const [remainingUsers, setRemainingUsers] = React.useState(users);
  const [canSwipe, setCanSwipe] = React.useState(true);
  const cardRefs = React.useRef<(any | null)[]>([]);

  const handleSwipe = async (direction: string, userId: string) => {
    if (!canSwipe) return;

    setCanSwipe(false);

    try {
      const isMatch = await neo4jSwipe(
        currentUser.applicationId,
        direction,
        userId,
      );

      // Remove user from stack
      setRemainingUsers((prev) =>
        prev.filter((u) => u.applicationId !== userId),
      );

      if (isMatch) {
        const matchedUser = remainingUsers.find(
          (u) => u.applicationId === userId,
        );
        alert(`🎉 It's a match with ${matchedUser?.fullName}!`);
      }
    } catch (err) {
      console.error("Swipe error:", err);
    } finally {
      setTimeout(() => setCanSwipe(true), 300);
    }
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (!canSwipe || remainingUsers.length === 0) return;

    const currentCardIndex = remainingUsers.length - 1;
    const currentCard = cardRefs.current[currentCardIndex];

    if (currentCard) {
      currentCard.swipe(direction);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <HeaderPfp />
      <div className="relative h-[calc(100vh-200px)] sm:h-[75vh] w-full">
        {remainingUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-6xl">👋</div>
            <p className="text-xl font-semibold text-foreground">
              No more profiles
            </p>
            <p className="text-sm text-muted-foreground">
              Check back later for new matches!
            </p>
          </div>
        ) : (
          remainingUsers
            .slice()
            .reverse()
            .map((user, index) => (
              <div
                key={user.applicationId}
                className="absolute w-full transition-transform duration-300"
                style={{
                  zIndex: remainingUsers.length - index,
                  transform: `scale(${1 - index * 0.02}) translateY(${index * -6}px)`,
                }}
              >
                <TinderCard
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  onSwipe={(dir) => handleSwipe(dir, user.applicationId)}
                  preventSwipe={["up", "down"]}
                  swipeRequirementType="position"
                  swipeThreshold={10}
                >
                  <Card className="w-full overflow-hidden shadow-lg border-0 rounded-lg p-1">
                    <div className="relative">
                      <img
                        src={user.photoUrl}
                        alt={user.fullName}
                        className="h-[55vh] sm:h-[58vh] w-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                      {/* User Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h2 className="text-2xl font-bold">
                          {user.fullName}, {user.age}
                        </h2>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <CardHeader className="gap-4 pb-4">
                      <CardTitle className="text-lg">{user.bio}</CardTitle>
                      {user.hobbies && user.hobbies.length > 0 && (
                        <div className="flex flex-col gap-2 w-full">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Interests
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {user.hobbies[0].split(" ").map((hobby, idx) => (
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
                    </CardHeader>
                  </Card>
                </TinderCard>
              </div>
            ))
        )}
      </div>
      {remainingUsers.length > 0 && (
        <div className="hidden md:flex justify-center gap-8 mt-6">
          <button
            onClick={() => handleButtonSwipe("left")}
            disabled={!canSwipe}
            className="group relative w-16 h-16 rounded-full bg-white border-2 border-red-200 hover:border-red-400 hover:bg-red-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
            aria-label="Pass"
            style={{ zIndex: 10 }}
          >
            <X className="w-7 h-7 text-red-500 group-hover:text-red-600 transition-colors" />
          </button>

          <button
            onClick={() => handleButtonSwipe("right")}
            disabled={!canSwipe}
            className="group relative w-16 h-16 rounded-full bg-blue-500 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
            aria-label="Like"
            style={{ zIndex: 10 }}
          >
            <Heart className="w-7 h-7 text-green-500 group-hover:text-green-600 transition-colors fill-current" />
          </button>
        </div>
      )}
      {remainingUsers.length > 0 && (
        <div className="md:hidden flex justify-center mt-4">
          <p className="text-xs text-muted-foreground">
            👆 Swipe left or right
          </p>
        </div>
      )}
    </div>
  );
};

export default HomepageClientComponent;
