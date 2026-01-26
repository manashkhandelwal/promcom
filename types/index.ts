export interface Neo4JUser {
    applicationId: string;
    fullName: string;
    email: string;
    phone?: string;
    bio?: string;
    hobbies?: string[];
    photoUrl?: string;
    createdAt?: string;
}