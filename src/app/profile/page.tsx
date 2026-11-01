"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  UserRound,
  Mail,
  Camera,
  LockKeyhole,
  Save,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileUpdate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const image = String(formData.get("image") || "").trim();

    if (name.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    if (image) {
      try {
        new URL(image);
      } catch {
        toast.error("Please enter a valid photo URL.");
        return;
      }
    }

    setSavingProfile(true);

    try {
      const { error } = await authClient.updateUser({
        name,
        image: image || undefined,
      });

      if (error) {
        toast.error(error.message || "Could not update profile.");
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating your profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEmailUpdate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newEmail = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    if (!newEmail || newEmail === user?.email?.toLowerCase()) {
      toast.error("Enter a different email address.");
      return;
    }

    setSavingProfile(true);

    try {
      const { error } = await authClient.changeEmail({
        newEmail,
      });

      if (error) {
        toast.error(error.message || "Could not update email.");
        return;
      }

      toast.success("Email change request submitted.");
      router.refresh();
    } catch {
      toast.error("Could not update email. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const currentPassword = String(
      formData.get("currentPassword") || ""
    );
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(
      formData.get("confirmPassword") || ""
    );

    if (!/[A-Z]/.test(newPassword)) {
      toast.error("New password needs an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      toast.error("New password needs a lowercase letter.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      });

      if (error) {
        toast.error(error.message || "Could not change password.");
        return;
      }

      form.reset();
      toast.success("Password changed successfully!");
    } catch {
      toast.error("Could not change password. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (isPending) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl animate-pulse space-y-5">
          <div className="h-10 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ShieldCheck className="mx-auto mb-4 text-blue-600" size={42} />
          <h1 className="text-2xl font-bold">Sign in required</h1>
          <p className="mt-2 text-slate-500">
            Please log in to view and update your profile.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200";

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Account Settings
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Manage your personal information and account security.
          </p>
        </div>

        {/* Profile Summary */}
        <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-blue-50 bg-blue-100 text-blue-800 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={36} />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="wrap-break-word text-xl font-bold text-slate-900 dark:text-white">
              {user.name || "CareConnect Member"}
            </h2>
            <p className="break-all text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
              <ShieldCheck size={14} />
              Account Profile
            </span>
          </div>
        </section>

        {/* Name and Photo */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <UserRound size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Personal Information</h2>
              <p className="mt-1 text-sm text-slate-500">
                Update your name and profile photo.
              </p>
            </div>
          </div>

          <form
            key={`${user.id}-profile`}
            onSubmit={handleProfileUpdate}
            className="space-y-5"
          >
            <div>
              <label className={labelClass} htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                required
                minLength={2}
                defaultValue={user.name || ""}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="image">
                Profile Photo URL
              </label>
              <div className="relative">
                <Camera
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="image"
                  name="image"
                  type="url"
                  defaultValue={user.image || ""}
                  placeholder="https://example.com/photo.jpg"
                  className={`${inputClass} pl-11`}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Enter a direct URL to your image. Leave empty to remove it.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className={buttonClass}
            >
              {savingProfile ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Profile
            </button>
          </form>
        </section>

        {/* Email */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <Mail size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Email Address</h2>
              <p className="mt-1 text-sm text-slate-500">
                Change the email linked to your account.
              </p>
            </div>
          </div>

          <form
            key={`${user.id}-email`}
            onSubmit={handleEmailUpdate}
            className="space-y-5"
          >
            <div>
              <label className={labelClass} htmlFor="currentEmail">
                Current Email
              </label>
              <input
                id="currentEmail"
                value={user.email}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="email">
                New Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your new email"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className={buttonClass}
            >
              {savingProfile ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Mail size={18} />
              )}
              Update Email
            </button>
            <p className="text-xs leading-5 text-slate-500">
              Your Better Auth server settings determine whether email changes
              require verification.
            </p>
          </form>
        </section>

        {/* Password */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <LockKeyhole size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Change Password</h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose a strong password to protect your account.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="currentPassword">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter current password"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className={inputClass}
              />
              <p className="mt-2 text-xs text-slate-500">
                Include at least one uppercase letter and one lowercase letter.
              </p>
            </div>

            <div>
              <label className={labelClass} htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className={buttonClass}
            >
              {savingPassword ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <LockKeyhole size={18} />
              )}
              Change Password
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}