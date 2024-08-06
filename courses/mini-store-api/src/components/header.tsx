import { Link, NavLink } from "react-router-dom";
import { CircleUser, Home, Menu } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import ModeToggle from "./mode-toggle";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";

export default function Header() {
  const { auth } = useAuth();
  const logout = useLogout();
  return (
    <header className="sticky z-10 top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 lg:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium max-w-[1600px] mx-auto lg:flex lg:flex-row lg:justify-between lg:w-full lg:items-center md:gap-5 lg:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold lg:text-2xl text-primary"
        >
          LOGO
          <span className="sr-only">LOGO</span>
        </Link>
        <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1.5 ${
                isActive ? "!text-primary" : "!text-foreground"
              } ${buttonVariants({
                variant: "link",
              })}`
            }
          >
            <Home size={20} />
            <span>Home</span>
          </NavLink>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-44" align="end">
              <DropdownMenuLabel className="flex flex-col gap-1.5">
                <p className="font-medium">
                  {auth?.user?.first_name} {auth?.user?.last_name}
                </p>
                <span className="text-gray-500 text-xs">
                  {auth.user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link to="/" className="text-2xl text-primary font-semibold mb-6">
              OXSAID
              <span className="sr-only">Oxsaid</span>
            </Link>
            <div className="flex flex-col gap-6 font-medium text-lg">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 ${
                    isActive ? "text-primary" : "text-foreground"
                  }`
                }
              >
                <Home size={20} />
                Home
              </NavLink>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex lg:hidden items-center gap-3">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-44" align="end">
            <DropdownMenuLabel className="flex flex-col gap-1.5">
              <p className="font-medium">
                {auth?.user?.first_name} {auth?.user?.last_name}
              </p>
              <span className="text-gray-500 text-xs">{auth.user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
