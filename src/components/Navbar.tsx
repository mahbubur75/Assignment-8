"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HeartHandshake,
  House,
  CalendarDays,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  UserRound,
  CalendarPlus,
  ClipboardList,
  UsersRound,
  LogOut,
  LogIn,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", href: "/", icon: House },
  {
    label: "Upcoming Events",
    href: "/upcoming-events",
    icon: CalendarDays,
  },
];

const profileLinks = [
  {
    label: "Create Event",
    href: "/create-event",
    icon: CalendarPlus,
  },
  {
    label: "Manage Events",
    href: "/manage-events",
    icon: ClipboardList,
  },
  {
    label: "Joined Events",
    href: "/joined-events",
    icon: UsersRound,
  },
];

function ProfileAvatar({
  image,
  name,
  size = "normal",
}: {
  image?: string | null;
  name?: string | null;
  size?: "normal" | "small";
}) {
  const avatarSize =
    size === "small" ? "h-9 w-9" : "h-10 w-10";

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-900 ${avatarSize}`}
    >
      {image ? (
        <Image
          src={image}
          alt={name || "User profile"}
          width={44}
          height={44}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        <UserRound size={size === "small" ? 19 : 22} />
      )}
    </span>
  );
}

export default function Navbar() {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = useSession();

  const isLoggedIn = !!session?.user;
  const user = session?.user;

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await signOut();

      if (result?.error) {
        throw new Error(result.error.message || "Logout failed.");
      }

      toast.success("Logged out successfully!");

      closeMenus();
      router.push("/login");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Logout failed. Please try again.";

      toast.error(message);
    } finally {
      setLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);

    document.documentElement.classList.toggle(
      "dark",
      nextDarkMode
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${
        darkMode
          ? "border-slate-800 bg-slate-950 text-white"
          : "border-slate-200/80 bg-white/95 text-slate-800"
      }`}
    >
      <nav className="mx-auto flex min-h-20.5 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-700 to-blue-950 text-white shadow-md shadow-blue-950/15 transition group-hover:scale-105">
            <HeartHandshake size={29} strokeWidth={2.2} />
          </span>

          <span className="min-w-0">
            <span className="block text-xl font-extrabold tracking-tight sm:text-2xl">
              <span className="text-blue-950">Care</span>
              <span className="text-blue-600">Connect</span>
            </span>

            <span
              className={`hidden text-xs sm:block ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Social Development Events Platform
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenus}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                href === "/"
                  ? "bg-blue-50 text-blue-800"
                  : darkMode
                    ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex items-center gap-1 rounded-full border p-1 transition ${
              darkMode
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <span
              className={`rounded-full p-2 ${
                !darkMode
                  ? "bg-white text-amber-500 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <Sun size={17} />
            </span>

            <span
              className={`rounded-full p-2 ${
                darkMode
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <Moon size={17} />
            </span>
          </button>

          {/* Login / Profile */}
          {isPending ? (
            <div className="h-11 w-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          ) : !isLoggedIn ? (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              <LogIn size={18} />
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen((value) => !value)
                  }
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-3 transition hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <ProfileAvatar
                    image={user?.image}
                    name={user?.name}
                  />

                  <span className="max-w-28 truncate text-sm font-semibold">
                    {user?.name || "My Profile"}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                    {/* User Information */}
                    <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-4 dark:border-slate-700">
                      <ProfileAvatar
                        image={user?.image}
                        name={user?.name}
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {user?.name || "User"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-slate-800"
                    >
                      <UserRound size={19} />
                      My Profile
                    </Link>

                    {profileLinks.map(
                      ({ label, href, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={closeMenus}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-slate-800"
                        >
                          <Icon size={19} />
                          {label}
                        </Link>
                      )
                    )}

                    <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                    {/* Logout inside dropdown */}
                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut size={19} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>

              {/* Separate Logout Button beside Profile */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
              >
                <LogOut size={18} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`rounded-xl border p-2.5 ${
              darkMode
                ? "border-slate-700 text-amber-300"
                : "border-slate-200 text-blue-900"
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={
              mobileOpen ? "Close navigation" : "Open navigation"
            }
            aria-expanded={mobileOpen}
            className={`rounded-xl border p-2.5 ${
              darkMode
                ? "border-slate-700 text-white"
                : "border-slate-200 text-blue-950"
            }`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`border-t px-4 pb-5 pt-3 md:hidden ${
            darkMode
              ? "border-slate-800 bg-slate-950"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {/* Main Links */}
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenus}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
                  darkMode
                    ? "text-slate-200 hover:bg-slate-800"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-800"
                }`}
              >
                <Icon size={19} />
                {label}
              </Link>
            ))}

            {/* Mobile Session */}
            {isPending ? (
              <div className="mt-3 h-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            ) : isLoggedIn ? (
              <>
                <div className="my-2 flex items-center gap-3 border-y border-slate-200 py-4 dark:border-slate-700">
                  <ProfileAvatar
                    image={user?.image}
                    name={user?.name}
                  />

                  <div className="min-w-0">
                    <p className="truncate font-bold">
                      {user?.name || "User"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium hover:bg-blue-50 dark:hover:bg-slate-800"
                >
                  <UserRound size={19} />
                  My Profile
                </Link>

                {profileLinks.map(
                  ({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium hover:bg-blue-50 dark:hover:bg-slate-800"
                    >
                      <Icon size={19} />
                      {label}
                    </Link>
                  )
                )}

                {/* Mobile Logout */}
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                >
                  <LogOut size={19} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenus}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-3.5 font-bold text-white transition hover:bg-blue-800"
              >
                <LogIn size={19} />
                Login to CareConnect
              </Link>
            )}

            <p className="mt-3 px-4 text-xs text-slate-500">
              Together, we can make a difference.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}