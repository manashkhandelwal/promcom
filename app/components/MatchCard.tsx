import { Neo4JUser } from "../../types/index";
import Image from "next/image";
export default function MatchCard({ user }: { user: Neo4JUser }) {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="card-swipe aspect-[3/4] overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={user.photoUrl}
            alt={user.fullName}
            fill
            className={`object-cover transition-opacity duration-300`}
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {user.fullName}, {user.age}
                </h2>
                <p className="text-sm leading-relaxed">{user.bio}</p>
                {user.hobbies && user.hobbies.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Interests
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.hobbies.map((hobby, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-secondary/80 text-secondary-foreground rounded-full text-xs font-medium"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
