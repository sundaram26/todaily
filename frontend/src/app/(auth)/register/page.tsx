import Register from "@/features/auth/components/register";


const register = () => {
    return (
      <div className="h-full w-full max-w-md flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-start mb-8">
          <h1 className="font-bold text-[clamp(1.8rem,2.5vw,2.8rem)] leading-16">
            Register,
          </h1>
          <p className="font-semibold text-[clamp(0.9rem,1.2vw,1.1rem)] text-foreground-muted">
            Turn chaos into clarity.
          </p>
        </div>
        <Register />
      </div>
    );
}

export default register;