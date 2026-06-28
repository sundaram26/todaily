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
import { RegisterForm, RegisterType } from "../types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { images } from "@/assets";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRegister } from "../hooks/use-register";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleOAuth } from "../hooks/use-google-oauth";

function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { mutate, isPending } = useRegister({
    onSuccess: () => {
      setTimeout(() => router.push("/login"), 1000);
    }
  });
  const { login: googleLogin } = useGoogleOAuth();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterForm),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    }
  })

  const onsubmit = (data: RegisterType) => {
    mutate(data);
  }

  const passwordMouseEnter = () => {
    setShowPassword(true);
    timeoutRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 3000);
  }

  const passwordMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowPassword(false);
  }

  return (
    <div className="w-full border-border">
      <form onSubmit={handleSubmit(onsubmit)}>
        <FieldGroup>
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
              Username
            </FieldLabel>
            <Input
              type="text"
              {...register("username")}
              placeholder="@example123"
              className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
            />
            {errors.username && (
              <FieldError className="text-error font-bold">
                {errors.username.message || "username error!"}
              </FieldError>
            )}
          </Field>
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
              Email
            </FieldLabel>
            <Input
              {...register("email")}
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
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-accent-foreground text-sm gap-0 leading-1.5">
              Password
            </FieldLabel>
            <div className="h-10 md:h-12 w-full flex justify-between items-center border-2 border-border bg-input rounded-sm px-2 focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-px focus-within:border-ring">
              <Input
                type={`${showPassword ? "text" : "password"}`}
                {...register("password")}
                placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
                className="flex-1 h-full p-0 focus-visible:ring-0 focus:border-0"
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
                {errors.password.message || "passsword error!"}
              </FieldError>
            )}
            <FieldContent className="text-sm font-semibold text-primary text-right cursor-pointer">
              Forgot password?
            </FieldContent>
          </Field>
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 md:h-12 bg-primary rounded-sm text-white font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/80 hover:scale-[1.02] disabled:bg-primary/80 transition-transform"
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" /> <p>Registering...</p>
              </>
            ) : (
              "Register"
            )}
          </Button>
          <FieldContent className="w-full text-left cursor-pointer">
            <p className="font-semibold text-accent-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-primary">Login</span>
              </Link>
            </p>
          </FieldContent>
        </FieldGroup>
        <FieldSeparator className="my-8">or</FieldSeparator>
        <FieldGroup>
          <Button
            type="button"
            variant="outline"
            onClick={() => googleLogin()}
            className="h-10 md:h-12 bg-surface rounded-sm flex items-center justify-center gap-2 p-2 border-2 border-primary cursor-pointer hover:bg-primary/60 hover:scale-[1.02] transition-transform"
          >
            <Image
              src={images.googleIcon}
              alt="google-icon"
              className="h-full w-fit p-1 object-contain"
            />
            <p className="text-sm font-semibold text-muted-foreground">
              Login with Google
            </p>
          </Button>
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

export default Register;
