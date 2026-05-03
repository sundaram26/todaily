"use client";
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { images } from "@/assets";
import Link from "next/link";
import { useSendVerify } from "../hooks/use-send-verify";
import { useForm } from "react-hook-form";
import { SendVerifyLinkForm, SendVerifyLinkType } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";

function SendVerifyLink() {
    const { mutate, isPending } = useSendVerify();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SendVerifyLinkType>({
        resolver: zodResolver(SendVerifyLinkForm),
        defaultValues: {
            email: ""
        }
    })

    const onsubmit = (data: SendVerifyLinkType) => {
        mutate(data);
    }

    return (
        <div className="w-full border-border">
            <form onSubmit={handleSubmit(onsubmit)}>
                <FieldGroup>
                    <Field className="w-full py-2">
                        <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
                            Email
                        </FieldLabel>
                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="name@example.com"
                            className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
                        />
                        {errors.email && (
                            <FieldError className="text-error font-bold">
                                {errors.email.message || "email error!"}
                            </FieldError>
                        )}
                    </Field>
                    <Button
                        type="submit"
                        className="h-10 md:h-12 bg-primary rounded-sm text-white font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/80 hover:scale-[1.02] disabled:bg-primary/80 transition-transform"
                    >
                        {isPending ? <><LoaderCircle className="animate-spin" /> <p>Sending...</p></> : "Send Link" }
                    </Button>
                    <FieldContent className="w-full text-left cursor-pointer">
                        <p className="font-semibold text-accent-foreground text-sm">
                            Already verified?{" "}
                            <Link href="/login">
                                <span className="text-primary">Login</span>
                            </Link>
                        </p>
                    </FieldContent>
                </FieldGroup>
            </form>
        </div>
    );
}

export default SendVerifyLink;
