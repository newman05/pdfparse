// app/page.tsx
import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from 'next/navigation'
const Page = async () => { // must be async
  const session = await getKindeServerSession(); // await here
  const user = session ? await session.getUser() : null; // await getUser()

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard')


    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })

    if(!dbUser) redirect('/auth-callback?origin=dashboard') ; 



  return <Dashboard/> ;
};

export default Page;
