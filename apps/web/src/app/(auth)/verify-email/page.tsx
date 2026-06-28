"use client";
import { useTimer } from "@/common/hooks/use-timer";
import VerifyEmail from "@/features/auth/components/verify-email";
import { useVerifyLink } from "@/features/auth/hooks/use-verify";
import { VerifyStatus } from "@/features/auth/types";
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const VerifyLinkPage = () => {
    const timer = useTimer(10);
    const [status, setStatus] = useState<VerifyStatus>("loading");

    return (
        <div className="h-full w-full max-w-md flex flex-col justify-center items-center">
            <div className="w-full flex flex-col justify-start mb-8">
                <h1 className="text-2xl font-bold">Verify Email</h1>
                <p className="text-sm text-muted-foreground">
                    {status === "loading" && "Verifying your email..."}
                    {status === "success" && timer > 0
                        ? `Redirecting to login in ${timer}...`
                        : "Click below to continue to login"}
                    {status === "error" && "Verification failed. Please try again."}
                </p>
            </div>
            <VerifyEmail onStatusChange={setStatus} />
        </div>
    );
}

export default VerifyLinkPage;