"use client";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { LoginType } from "../types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login: LoginType = {
    email,
    password,
  };

  return (
    <div className="w-full max-w-md border-border">
      <form>
        <FieldGroup className="py-8">
          <Field className="w-full px-4 py-2">
            <FieldLabel className="font-medium text-foreground text-sm gap-0 leading-1.5">
              Email
            </FieldLabel>
            <Input
              type="text"
              value={email}
              placeholder="name@gmail.com"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setEmail(e.target.value)
              }
              className="rounded-sm h-12 border-2 bg-input"
            />
          </Field>
          <Field className="w-full px-4 py-2">
            <FieldLabel className="font-medium text-accent-foreground text-sm gap-0 leading-1.5">
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
          </Field>
        </FieldGroup>
        <Button type="submit" className="bg-primary">
            Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
