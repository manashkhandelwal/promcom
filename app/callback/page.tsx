import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { createUser, getUserByID } from "../neo4j.action";

export default async function CallbackPage() {
  const { isAuthenticated, getUser}=getKindeServerSession();
  
    if(!(await isAuthenticated())){
      redirect(
        "/api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
      )
    }
    const user = await getUser();
    if(!user)
        redirect(
        "/api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
        )
    //Check if user is present in database
    const dbUser = await getUserByID(user.id)

    //if not create user in database
    if(!dbUser){
        //create user in neo4j
        await createUser({
            applicationId: user.id!,
            firstname: user.given_name!,
            lastname: user.family_name ?? "",
            email: user.email!
        });
    }

    redirect("/");
}