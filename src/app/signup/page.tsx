"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Camera,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Leaf,
} from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

// Password requirement component - declared outside SignupPage
function Requirement({
  fulfilled,
  children,
}: {
  fulfilled: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        fulfilled
          ? "text-green-600"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {fulfilled ? (
        <CheckCircle2 size={16} />
      ) : (
        <XCircle size={16} />
      )}
      <span>{children}</span>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  // Password validation
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;

  const passwordValid =
    hasUppercase && hasLowercase && hasMinLength;

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordValid) {
      toast.error("Please fulfill all password requirements.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const image = (formData.get("image") as string).trim();

    setLoading(true);

    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      });

      if (error) {
        toast.error(error.message || "Signup failed. Please try again.");
        return;
      }

      toast.success("Your account has been created successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 px-4 py-12 dark:from-gray-950 dark:via-gray-900 dark:to-green-950">
      <div className="mx-auto w-full max-w-md">

        {/* Logo */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-none">
            <Leaf size={34} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Join CareConnect and make a difference together.
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/20">
          <form onSubmit={handleSignup} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Profile Photo URL */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Profile Photo URL
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <div className="relative">
                <Camera
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <p className="mt-1.5 text-xs text-gray-400">
                Add a direct image URL for your profile picture.
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-green-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
                <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Password must contain:
                </p>

                <div className="space-y-2">
                  <Requirement fulfilled={hasUppercase}>
                    At least one uppercase letter (A-Z)
                  </Requirement>

                  <Requirement fulfilled={hasLowercase}>
                    At least one lowercase letter (a-z)
                  </Requirement>

                  <Requirement fulfilled={hasMinLength}>
                    Minimum 6 characters
                  </Requirement>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !passwordValid}
              className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-green-600 transition hover:text-green-700"
            >
              Sign In
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 CareConnect. Together, We Can Make a Difference.
        </p>
      </div>
    </main>
  );
}