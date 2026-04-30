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
import { z } from "zod";
import { LoginType, RegisterForm, RegisterType } from "../types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { images } from "@/assets";
import { Eye, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRegister } from "../hooks/use-register";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Register() {
  const { mutate, isPending } = useRegister();

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

  return (
    <div className="w-full max-w-md border-border">
      <form onSubmit={handleSubmit(onsubmit)}>
        <FieldGroup>
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
              Username
            </FieldLabel>
            <Input
              type="text"
              {...register("username")}
              placeholder="example"
              className="rounded-sm h-12 border-2 border-border bg-input text-sm font-medium"
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
              className="rounded-sm h-12 border-2 border-border bg-input text-sm font-medium"
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
            <div className="h-12 w-full flex justify-between items-center border-2 border-border bg-input rounded-sm px-2 focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-px focus-within:border-ring">
              <Input
                type="password"
                {...register("password")}
                placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
                className="w-[90%] h-full p-0 focus-visible:ring-0 focus:border-0"
              />
              <Eye className="text-foreground-muted" />
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
            className="h-12 bg-primary rounded-sm text-white font-semibold"
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : "Register"}
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
          <div className="h-12 bg-surface rounded-sm flex items-center justify-center gap-2 p-2 border-2 border-primary cursor-pointer">
            <Image
              src={images.googleIcon}
              alt="google-icon"
              className="h-full w-fit p-1 object-contain"
            />
            <p className="text-sm font-semibold text-muted-foreground">
              Login with Google
            </p>
          </div>
          <div className="h-12 bg-surface rounded-sm flex items-center justify-center gap-2 p-2 border-2 border-primary cursor-pointer">
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
