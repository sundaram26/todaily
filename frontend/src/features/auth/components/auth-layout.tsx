import Image from "next/image";
import { images } from "@/assets";



export const AuthLayout = ({ children }: { children: React.ReactNode; }) => {
    return (
      <div className="h-screen w-full bg-primary-subtle flex p-4 md:p-6 lg:p-12 items-center gap-4 md:gap-8 lg:gap-12 selection:bg-primary/80 selection:text-foreground-muted/90">
        <div className="w-full md:w-1/2 max-w-4xl mx-auto flex justify-center">
          {children}
        </div>
        <div className="relative h-full w-full rounded-4xl overflow-hidden hidden lg:block">
          <Image
            loading="eager"
            src={images.authSide}
            fill
            alt="Side Image"
            className="object-cover"
          />
        </div>
      </div>
    );
}