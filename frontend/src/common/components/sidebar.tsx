"use client";
import { authStore } from "@/features/auth/store/auth.store";
import { useEffect } from "react";
import {
  LifeBuoy,
  FolderDot,
  CalendarDays,
  ChartGantt,
  Webhook,
  LogOut,
  Route,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/hooks/use-logout";

const SidebarContent = [
  {
    id: 1,
    icon: LifeBuoy,
    slug: "my-day",
    content: "My Day",
  },
  {
    id: 2,
    icon: FolderDot,
    slug: "projects",
    content: "Projects",
  },
  {
    id: 3,
    icon: CalendarDays,
    slug: "calendar",
    content: "Calendar",
  },
  {
    id: 4,
    icon: ChartGantt,
    slug: "timeline",
    content: "Timeline",
  },
  {
    id: 5,
    icon: Webhook,
    slug: "collaborations",
    content: "Collaborations",
  },
];

export const Sidebar = () => {
  const user = authStore((state) => state.user);
  const { mutate: logout } = useLogout();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log("user: ", user);
  }, [user]);

  const getIsActivePage = (path: string) => {
    return `/${path}` === pathname;
  };

  const changePage = (path: string) => {
    router.push(path);
  }

  return (
    <div className="h-screen w-[20%] max-w-xl border-r-2 border-border">
      <div className="h-[16%] border-b-2 border-border p-2">
        <h3 className="text-3xl">
          Hi,{" "}
          <span className="font-semibold text-primary">{user?.username}</span>
        </h3>
        <p className="text-md">Hope you are killing today!</p>
      </div>
      <div className="h-[74%] border-b-2 border-border cursor-pointer">
        {SidebarContent.map((contents) => (
          <div
            className={cn(
              "h-16 flex items-center p-4 gap-2 font-semibold border-b-2 border-border active:bg-primary/30 transition-all duration-75",
              getIsActivePage(contents.slug) && "bg-primary/30",
            )}
            key={contents.id}
            onClick={() => changePage(contents.slug)}
          >
            <contents.icon />
            <p>{contents.content}</p>
          </div>
        ))}
      </div>
      <div className="h-[10%] bg-foreground-muted/10 flex items-center divide-x-1 divide-primary cursor-pointer">
        <div
          className="w-[50%] flex justify-center items-center gap-2 p-2 text-md font-semibold hover:h-full active:h-full active:bg-foreground-muted/20 transition-all duration-100"
          onClick={() => logout()}
        >
          <p>Logout</p>
          <LogOut className="text-danger" />
        </div>
        <div className="w-[50%] flex justify-center items-center gap-2 p-2 text-md font-semibold hover:h-full active:h-full active:bg-foreground-muted/20 transition-all duration-100">
          <p>Switch</p>
          <Route className="text-success" />
        </div>
      </div>
    </div>
  );
};
