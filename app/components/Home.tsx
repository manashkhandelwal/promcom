"use client";
import { Neo4JUser } from "@/types";
import TinderCard from "react-tinder-card";
import * as React from "react";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { neo4jSwipe } from "../neo4j.action";

interface HomepageClientComponentProps {
    currentUser: Neo4JUser
    users: Neo4JUser[]
}


const HomepageClientComponent: React.FC<HomepageClientComponentProps> = ({currentUser, users}) => {
   
    const handleSwipe = async (direction: string, userId: string) => {
        const isMatch = await neo4jSwipe(currentUser.applicationId, direction, userId);
        if (isMatch) alert(`Congrats!! It's a match with ${userId}!`);
    } 
   
   
    return (
    <div className="w-screen h-screen flex justify-center items-center">
        <div>
        <div>
            <h1 className="text-4xl">
                Hello {currentUser.firstname} {currentUser.lastname}!
            </h1>
        </div>
        <div className="mt-4 relative">
            {users.map((user) => (
                <TinderCard onSwipe={(direction) => handleSwipe(direction,user.applicationId)} className="absolute" key={user.applicationId} >
                  <Card className="w-[320px] h-[420px] bg-white rounded-2xl shadow-xl cursor-grab select-none flex flex-col p-4">
                    <CardHeader>
                        <CardTitle>
                            {user.firstname} {user.lastname}
                        </CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                   </Card>
                </TinderCard>
            ))}
        </div>
        </div>
    </div>
   ); 
};

export default HomepageClientComponent;