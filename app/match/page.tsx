import { getMatches } from "../neo4j.action";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MatchPage(){
    const currentUserId = "user1"; // Hardcoded for demo without auth
    const matches = await getMatches(currentUserId);
    return (
        <main>
            {matches.map((user) =>(
            <Card key={user.applicationId} className="w-[320px] h-[420px] bg-white rounded-2xl shadow-xl cursor-grab select-none flex flex-col p-4">
                <CardHeader>
                    <CardTitle>
                        {user.firstname} {user.lastname}
                    </CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
            </Card> 
            ))}
        </main>
    )
}