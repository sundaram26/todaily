import Image from "next/image";



export const AuthLayout = ({ children }: { children: React.ReactNode; }) => {
    return (
      <div className="h-screen w-full bg-primary-subtle flex p-8">
        <div className="h-full w-[50%] flex justify-center items-center">
          {children}
        </div>
        <div className="relative h-full w-[50%] rounded-4xl overflow-hidden">
          <Image
            src="/auth-side.png"
            fill
            alt="Side Image"
          />
          {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent-foreground/40 to-transparent" /> */}
          {/* <div className="pointer-events-none absolute inset-0 shadow-[inset_0px_20px_20px_80px_rgba(0,0,0,0.5)]" /> */}
        </div>
      </div>
    );
}