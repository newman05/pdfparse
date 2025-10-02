import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!key) return new Response("Missing key", { status: 400 });

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) return new Response("Unauthorized", { status: 401 });

  const file = await db.file.findFirst({
    where: { key, userId: user.id },
  });

  if (!file) return new Response("Not found", { status: 404 });

  // Redirect to the UploadThing signed URL
  return Response.redirect(file.url, 302);
}
