import Login from "@/features/auth/components/login";


const login = () => {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="w-full flex flex-col items-start px-38 mb-8">
          <h1 className="font-bold text-5xl leading-16">Login,</h1>
          <p className="font-semibold text-lg text-foreground-muted">Pick up where you left off.</p>
        </div>
        <Login />
      </div>
    );
}

export default login;