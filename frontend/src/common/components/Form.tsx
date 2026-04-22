import { cn } from "@/lib/utils";
import React from "react";


const Form = () => {
    // return (
        
    // )
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
        "flex flex-col gap-2 has-invalid:bg-red-50 rounded-md p-2",
        className,
      )}
    >
      {children}
    </div>
  );
};

const FormLabel = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label {...props} className={cn("text-neutral-700 font-medium", className)}>
      {children}
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
        "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-4 focus:border-gray-300 border border-transparent focus:bg-gray-100 px-4 py-2 bg-white rounded-lg shadow-input transition-all duration-200 placeholder:text-neutral-300",
        className,
      )}
    />
  );
};

export default Form;
