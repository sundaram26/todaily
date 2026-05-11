"use client";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { LoginForm, LoginType } from "../types";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { images } from "@/assets";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useLogin } from "../hooks/use-login";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate, isPending } = useLogin({
    onSuccess: () => {
      setTimeout(() => router.push("/my-day"), 1000)
    }
  });

  const passwordMouseEnter = () => {
    setShowPassword(true);
    timeoutRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 3000);
  };

  const passwordMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowPassword(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginType>({
    resolver: zodResolver(LoginForm),
    defaultValues: {
      email: "",
      password: "",
      provider: "local",
    }
  })

  const onsubmit = (data: LoginType) => {
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
              type="email"
              {...register("email")}
              placeholder="name@example.com"
              className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
            />
            {errors.email && (
              <FieldError className="text-error font-bold">
                {errors.email?.message || "invalid email!"}
              </FieldError>
            )}
          </Field>
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-accent-foreground text-sm gap-0 leading-1.5">
              Password
            </FieldLabel>
            <div className="h-10 md:h-12 w-full flex justify-between items-center border-2 border-border bg-input rounded-sm focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-px focus-within:border-ring">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
                className="flex-1 h-full py-0 px-2 focus-visible:ring-0 focus:border-0"
              />
              <span
                onMouseEnter={passwordMouseEnter}
                onMouseLeave={passwordMouseLeave}
                className="pr-2"
              >
                {showPassword ? (
                  <EyeOff className="text-foreground-muted" />
                ) : (
                  <Eye className="text-foreground-muted" />
                )}
              </span>
            </div>
            {errors.password && (
              <FieldError className="text-error font-bold">
                {errors.password?.message || "Invalid password!"}
              </FieldError>
            )}
            <FieldContent className="text-sm font-semibold text-primary text-right cursor-pointer">
              Forgot password?
            </FieldContent>
          </Field>
          <Button
            type="submit"
            className="h-10 md:h-12 bg-primary rounded-sm text-white font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/80 hover:scale-[1.02] disabled:bg-primary/80 transition-transform"
          >
            {isPending ? <><LoaderCircle className="animate-spin"/> Login...</> : "Login"}
          </Button>
          <FieldContent className="w-full text-left cursor-pointer">
            <p className="font-semibold text-accent-foreground text-sm">
              Haven't already joined?{" "}
              <Link href="/register">
                <span className="text-primary">Register</span>
              </Link>
            </p>
          </FieldContent>
        </FieldGroup>
        <FieldSeparator className="my-8">or</FieldSeparator>
        <FieldGroup>
          <div className="h-10 md:h-12 bg-surface rounded-sm flex items-center justify-center gap-2 p-2 border-2 border-primary cursor-pointer hover:bg-primary/60 hover:scale-[1.02] transition-transform">
            <Image
              src={images.googleIcon}
              alt="google-icon"
              className="h-full w-fit p-1 object-contain"
            />
            <p className="text-sm font-semibold text-muted-foreground">
              Login with Google
            </p>
          </div>
          <div className="h-10 md:h-12 bg-surface rounded-sm flex items-center justify-center gap-2 p-2 border-2 border-primary cursor-pointer hover:bg-primary/60 hover:scale-[1.02] transition-transform">
            <Image
              src={images.githubIcon}
              alt="github-icon"
              className="h-full w-fit p-1 object-contain"
            />
            <p className="text-sm font-semibold text-muted-foreground">
              Login with Github
            </p>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

export default Login;
