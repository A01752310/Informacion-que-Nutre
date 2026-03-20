import { redirect } from "next/navigation";

/* Server redirect: /login → /auth */
export default function LoginRedirect() {
  redirect("/auth");
}
