import { headers } from "next/headers";
import { auth } from "./auth";

const adminRoles = new Set(["admin", "superadmin", "owner"]);

type SessionUserWithRole = {
  role?: string | null;
  adminRole?: string | null;
  isAdmin?: boolean | null;
};

export async function requireAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized.");
  }

  const user = session.user as SessionUserWithRole;
  const role = user.adminRole ?? user.role;

  if (user.isAdmin === false || (role && !adminRoles.has(role))) {
    throw new Error("Forbidden.");
  }

  return session;
}
