"use client";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { LoginType } from "../types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { images } from "@/assets";

function Register() {
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
            <Input
              type="text"
              value={password}
              placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPassword(e.target.value)
              }
              className="rounded-sm h-12 border-2 border-border bg-input"
            />
            <p className="text-sm font-semibold text-primary">
                Forgot password?    
            </p>          
          </Field>
          <Button
            type="submit"
            className="h-12 bg-primary rounded-sm text-white font-semibold"
          >
            Login
          </Button>
        </FieldGroup>
        <FieldSeparator className="my-8">or</FieldSeparator>
        <FieldGroup>
          <div className="h-12 bg-surface rounded-sm flex items-center justify-center gap-2 p-2 border-2 border-primary">
            <Image
              src={images.googleIcon}
              alt="google-icon"
              className="h-full w-fit p-1 object-contain" 
            />
            <p className="text-sm font-semibold text-muted-foreground">Login with Google</p>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

export default Register;
