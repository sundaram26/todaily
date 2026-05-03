"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useVerifyLink } from "../hooks/use-verify";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { VerifyStatus } from "../types";
import Link from "next/link";

type VerifyEmailProps = {
    onStatusChange: (status: VerifyStatus) => void;
}

function VerifyEmail({ onStatusChange }: VerifyEmailProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { data, isPending, error } = useVerifyLink(token || "");

    useEffect(() => {
        if (isPending) {
            onStatusChange("loading")
        }
        if (data) {
            onStatusChange("success")
            toast.success(data.message, { position: "top-center" });
            router.push("/login");
        } else {
            onStatusChange("success")
            toast.error(
                error?.message || "Unable to verify!",
                { position: "top-center" },
            );
            router.push("/send-verify-link")
        }
    }, [isPending, data, error, onStatusChange, router]);

    return (
      <div className="w-full border-border pr-8">
        <div className="my-4">
          <Link href="/login">
            <Button className="h-10 md:h-12 w-full bg-primary rounded-sm text-white font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/80 hover:scale-[1.02] disabled:bg-primary/80 transition-transform">
              Go to Login
            </Button>
          </Link>
        </div>
        <div className="my-4">
          <Link href="/send-verify-link">
            <Button className="h-10 md:h-12 w-full bg-primary rounded-sm text-white font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/80 hover:scale-[1.02] disabled:bg-primary/80 transition-transform">
              Go to send verify
            </Button>
          </Link>
        </div>
      </div>
    );
}

export default VerifyEmail;
