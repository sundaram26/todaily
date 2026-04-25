"use client";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { LoginType } from "../types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { images } from "@/assets";
import { Eye } from "lucide-react";
import Link from "next/link";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login: LoginType = {
    email,
    password,
  };

  return (
    <div className="w-full max-w-md border-border">
      <form>
        <FieldGroup>
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
              Username
            </FieldLabel>
            <Input
              type="text"
              value={username}
              placeholder="example"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setUsername(e.target.value)
              }
              className="rounded-sm h-12 border-2 border-border bg-input text-sm font-medium"
            />
          </Field>
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-foreground text-sm gap-0 leading-1.5">
              Email
            </FieldLabel>
            <Input
              type="text"
              value={email}
              placeholder="name@example.com"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setEmail(e.target.value)
              }
              className="rounded-sm h-12 border-2 border-border bg-input text-sm font-medium"
            />
          </Field>
          <Field className="w-full py-2">
            <FieldLabel className="font-semibold text-accent-foreground text-sm gap-0 leading-1.5">
              Password
            </FieldLabel>
            <div className="h-12 w-full flex justify-between items-center border-2 border-border bg-input rounded-sm px-2 focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-px focus-within:border-ring">
              <Input
                type="text"
                value={password}
                placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setPassword(e.target.value)
                }
                className="w-[90%] h-full p-0 focus-visible:ring-0 focus:border-0"
              />
              <Eye className="text-foreground-muted" />
            </div>
            <FieldContent className="text-sm font-semibold text-primary text-right cursor-pointer">
              Forgot password?
            </FieldContent>
          </Field>
          <Button
            type="submit"
            className="h-12 bg-primary rounded-sm text-white font-semibold"
          >
            Login
          </Button>
          <FieldContent className="w-full text-left cursor-pointer">
            <p className="font-semibold text-accent-foreground text-sm">
              Haven't already joined?{" "}
              <Link
                href="/login"
              >
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
