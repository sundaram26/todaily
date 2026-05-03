"use client";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { LoginType } from "../types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { images } from "@/assets";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

    const handlePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const passwordMouseEnter = () => {
      handlePasswordVisibility();
    };

    const passwordMouseLeave = () => {
      handlePasswordVisibility();
    };

  return (
    <div className="w-full border-border">
      <form>
        <FieldGroup>
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
              Email
            </FieldLabel>
            <Input
              type="email"
              placeholder="name@example.com"
              className="rounded-sm h-10 md:h-12 border-2 border-border bg-input text-sm font-medium"
            />
            {/* <FieldError className="text-error font-bold">
              
            </FieldError> */}
          </Field>
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-accent-foreground text-sm gap-0 leading-1.5">
              Password
            </FieldLabel>
            <div className="h-10 md:h-12 w-full flex justify-between items-center border-2 border-border bg-input rounded-sm px-2 focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-px focus-within:border-ring">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
                className="flex-1 h-full p-0 focus-visible:ring-0 focus:border-0"
              />
              <span
                onMouseEnter={passwordMouseEnter}
                onMouseLeave={passwordMouseLeave}
              >
                {showPassword ? (
                  <EyeOff className="text-foreground-muted" />
                ) : (
                  <Eye className="text-foreground-muted" />
                )}
              </span>
            </div>
            <FieldContent className="text-sm font-semibold text-primary text-right cursor-pointer">
              Forgot password?
            </FieldContent>
          </Field>
          <Button
            type="submit"
            className="h-10 md:h-12 bg-primary rounded-sm text-white font-semibold focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary/80 hover:scale-[1.02] disabled:bg-primary/80 transition-transform"
          >
            Login
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
