"use client";

import { Neo4JUser } from "@/types";
import TinderCard from "react-tinder-card";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { neo4jSwipe } from "../neo4j.action";
import HeaderPfp from "../components/HeaderPfp";

interface HomepageClientComponentProps {
  currentUser: Neo4JUser;
  users: Neo4JUser[];
}

const HomepageClientComponent: React.FC<HomepageClientComponentProps> = ({
  currentUser,
  users,
}) => {
  const handleSwipe = async (direction: string, userId: string) => {
    try {
      const isMatch = await neo4jSwipe(
        currentUser.applicationId,
        direction,
        userId,
      );
      if (isMatch) alert(`Congrats!! It's a match with ${userId}!`);
    } catch (err) {
      console.error("Swipe error:", err);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <HeaderPfp />

      {/* Swipe Area */}
      <div className="relative h-[80vh] w-full">
        {users.map((user) => (
          <TinderCard
            key={user.applicationId}
            onSwipe={(dir) => handleSwipe(dir, user.applicationId)}
            preventSwipe={["up", "down"]}
            className="absolute w-full"
          >
            <Card className="w-full p-1 rounded-lg shadow-lg">
              <img
                src={user.photoUrl}
                alt={user.fullName}
                className="rounded-t-lg h-[60vh] w-full object-cover"
              />

              <CardHeader>
                <CardTitle className="text-2xl">{user.fullName}</CardTitle>

                <div className="mt-2">
                  <p className="font-semibold text-sm">Bio</p>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
              </CardHeader>

              <CardFooter>
                <div className="flex flex-col gap-2 w-full">
                  <p className="font-semibold text-sm">Hobbies</p>
                  <div className="flex flex-wrap gap-2">
                    {user.hobbies?.map((hobby, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-secondary rounded-full text-xs"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TinderCard>
        ))}
      </div>

      {/* Like / Dislike Buttons (only sm and above) */}
      <div className="hidden sm:flex justify-center gap-6 mt-6">
        <button
          onClick={() => console.log("Dislike button")}
          className="w-14 h-14 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center shadow-md"
        >
          ❌
        </button>

        <button
          onClick={() => console.log("Like button")}
          className="w-14 h-14 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center shadow-md"
        >
          ❤️
        </button>
      </div>
    </div>
  );
};

export default HomepageClientComponent;
