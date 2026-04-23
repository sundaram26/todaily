import { cn } from "@/lib/utils";
import React from "react";


const Form = (
  {
    children,
    className,
    ...props
  }: {
      children: React.ReactNode;
      className?: string;
  } & React.FormHTMLAttributes<HTMLFormElement>
) => {
    return (
      <form
        {...props}
        className={cn("space-y-6 w-full max-w-md mx-auto", className)}
      >
        {children}
      </form>
    )
}

const FormField = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
};

const FormLabel = ({
  children,
  required,
  className,
  ...props
}: {
    children: React.ReactNode;
    required?: boolean;
    className?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      {...props}
      className={cn("text-neutral-700 font-medium", className)}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
};

const FormInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={cn(
        className,
      )}
    />
  );
};

export default Form;
