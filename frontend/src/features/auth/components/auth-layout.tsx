import Image from "next/image";
import { images } from "@/assets";



export const AuthLayout = ({ children }: { children: React.ReactNode; }) => {
    return (
      <div className="h-screen w-full bg-primary-subtle flex p-12">
        <div className="w-[50%] max-w-4xl mx-auto">
          {children}
        </div>
        <div className="relative h-full w-[50%] rounded-4xl overflow-hidden">
          <Image
            loading="eager"
            src={images.authSide}
            fill
            alt="Side Image"
          />
        </div>
      </div>
    );
}