import Login from "@/features/auth/components/login";


const LoginPage = () => {
    return (
      <div className="h-full w-full max-w-md flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-start mb-8">
          <h1 className="font-bold text-[clamp(1.8rem,2.5vw,2.8rem)] leading-16">
            Login,
          </h1>
          <p className="font-semibold text-[clamp(0.9rem,1.2vw,1.1rem)] text-foreground-muted">
            Pick up where you left off.
          </p>
        </div>
        <Login />
      </div>
    );
}

export default LoginPage;