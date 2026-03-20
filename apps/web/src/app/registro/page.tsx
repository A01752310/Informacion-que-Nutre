import { redirect } from "next/navigation";

/* Server redirect: /registro → /auth?mode=register */
export default function RegistroRedirect() {
  redirect("/auth?mode=register");
}
