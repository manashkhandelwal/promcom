"use server";

import { driver } from "../db/index";
import { Neo4JUser } from "@/types";

export const getUserByID = async (id: string) => {
    const result = await driver.executeQuery(
        `MATCH (u:User { applicationId: $applicationId }) RETURN u`,
        { applicationId: id }
    );
    const users = result.records.map((record) => record.get("u").properties);
    if (users.length === 0) return null;
    return users[0] as Neo4JUser;
};

export const deleteUserByEmail = async (email: string) => {
    await driver.executeQuery(
        `MATCH (u:User { email: $email }) DELETE u`,
        { email }
    );
}

export const getUserByEmail = async (email: string) => {
    const result = await driver.executeQuery(
        `MATCH (u:User { email: $email }) RETURN u`,
        { email }
    );
    const users = result.records.map((record) => record.get("u").properties);
    if (users.length === 0) return null;
    return users[0] as Neo4JUser;
};

export const createUser = async (user: Neo4JUser) => {
    const { applicationId, fullName, age, email, phone, bio, hobbies, photoUrl } = user;

    await driver.executeQuery(
        `
    MERGE (u:Student { applicationId: $applicationId })
    ON CREATE SET
      u.createdAt = datetime()
    SET
      u.fullName = $fullName,
      u.age = $age,
      u.email    = $email,
      u.phone    = $phone,
      u.bio      = $bio,
      u.hobbies  = $hobbies,
      u.photoUrl = $photoUrl
    `,
        {
            applicationId,
            fullName,
            age: age ?? 18,
            email,
            phone,
            bio,
            hobbies,
            photoUrl,
        }
    );
};

export const updateUser = async (user: Neo4JUser) => {
    const { applicationId, fullName, age, email, phone, bio, hobbies, photoUrl } = user;

    await driver.executeQuery(
        `
    MATCH (u:Student { applicationId: $applicationId })
    SET
      u.fullName = $fullName,
      u.age = $age,
      u.email    = $email,
      u.phone    = $phone,
      u.bio      = $bio,
      u.hobbies  = $hobbies,
      u.photoUrl = $photoUrl
    `,
        {
            applicationId,
            fullName,
            age: age ?? 0,
            email,
            phone,
            bio,
            hobbies,
            photoUrl,
        }
    );
};



export const getUsersWithNoConnection = async (id: string) => {
    const result = await driver.executeQuery(
        `MATCH (cu:User { applicationId: $applicationId }) MATCH (ou: User) WHERE NOT (cu)-[:LIKE | :DISLIKE]->(ou) AND cu <> ou RETURN ou`,
        { applicationId: id }
    )
    const users = result.records.map((record) => record.get("ou").properties);
    return users as Neo4JUser[];
};

export const neo4jSwipe = async (id: string, swipe: string, userId: string) => {
    const type = swipe === "left" ? "DISLIKE" : "LIKE";
    await driver.executeQuery(
        `MATCH (cu: User { applicationId: $id }), (ou:User { applicationId: $userId }) CREATE (cu)-[:${type}]->(ou)`,
        { id, userId }
    );

    if (type === "LIKE") {
        const result = await driver.executeQuery(
            `MATCH (cu: User { applicationId: $id }), (ou: User { applicationId: $userId }) WHERE (ou)-[:LIKE]->(cu) RETURN ou as match`,
            { id, userId }
        );
        const matches = result.records.map(
            (record) => record.get("match").properties
        );
        return Boolean(matches.length > 0);
    }
}


export const getMatches = async (currentUserId: string) => {
    const result = await driver.executeQuery(
        `MATCH (cu: User { applicationId: $id })-[:LIKE]->(ou: User)-[:LIKE]->(cu) RETURN ou as match`,
        { id: currentUserId }
    );
    const matches = result.records.map(
        (record) => record.get("match").properties
    );
    return matches as Neo4JUser[];
}