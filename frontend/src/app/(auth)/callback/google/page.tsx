// frontend/src/app/auth/callback/google/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { googleOAuthCallback } from "@/features/auth/api/auth.api";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) {
        toast.error("Invalid OAuth callback");
        router.push("/login");
        return;
      }

      try {
        await googleOAuthCallback(code, state || "");
        toast.success("Successfully logged in with Google!");
        router.push("/home");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Login failed");
        router.push("/login");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Completing login...</p>
    </div>
  );
}
