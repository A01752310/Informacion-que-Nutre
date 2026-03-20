import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

/* Server component shell for the unified auth page */
export default function AuthPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-24">
      <Suspense>
        <AuthForm />
      </Suspense>
    </div>
  );
}
