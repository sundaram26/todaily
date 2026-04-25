import Image from "next/image";
import { images } from "@/assets";



export const AuthLayout = ({ children }: { children: React.ReactNode; }) => {
    return (
      <div className="h-screen w-full bg-primary-subtle flex p-12 items-center">
        <div className="w-[50%] md:w-full max-w-4xl mx-auto flex justify-center">
          {children}
        </div>
        <div className="relative h-full w-full min-w-96 rounded-4xl overflow-hidden sm:hidden lg:block bg-amber-500">
          <Image
            loading="eager"
            src={images.authSide}
            fill
            alt="Side Image"
            className=""
          />
        </div>
      </div>
    );
}