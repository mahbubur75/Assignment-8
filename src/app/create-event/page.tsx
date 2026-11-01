"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarPlus,
  ImagePlus,
  MapPin,
  CalendarDays,
  Type,
  FileText,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Healthcare",
  "Community Support",
  "Other",
];

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    imageUrl: "",
    location: "",
    eventDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (!session?.user) {
      toast.error("Please login to create an event.");
      router.push("/login");
      return;
    }

    if (new Date(`${formData.eventDate}T00:00:00`) <= new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )) {
      toast.error("Please select a future event date.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      // Get JWT token from the protected Next.js API route
      const tokenResponse = await fetch("/api/backend-token", {
        method: "GET",
        cache: "no-store",
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.success || !tokenData.token) {
        throw new Error(
          tokenData.message || "Authentication token could not be created."
        );
      }

      // Create event with JWT authorization
      const response = await fetch(`${apiUrl}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create event.");
      }

      toast.success("Event created successfully!");

      setFormData({
        title: "",
        description: "",
        type: "",
        imageUrl: "",
        location: "",
        eventDate: "",
      });

      router.push("/upcoming-events");
      router.refresh();
    } catch (error) {
      console.error("Create event error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-700" size={36} />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Login Required
        </h1>

        <p className="text-slate-500">
          Please login to create a community event.
        </p>

        <Link
          href="/login"
          className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Login Now
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">

        {/* Back Link */}
        <Link
          href="/upcoming-events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900 dark:text-blue-400"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <CalendarPlus size={32} />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            Create an Event
          </h1>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Bring people together and make a positive difference.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-9 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Event Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                <Type size={17} />
                Event Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter your event title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                <FileText size={17} />
                Event Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe your event and its purpose..."
                value={formData.description}
                onChange={handleChange}
                required
                minLength={10}
                rows={5}
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900"
              />
            </div>

            {/* Event Type */}
            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Event Type
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900"
              >
                <option value="">Select event type</option>

                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                <ImagePlus size={17} />
                Event Image URL
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/event-image.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900"
              />

              <p className="mt-2 text-xs text-slate-400">
                Provide a valid image URL for your event.
              </p>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                <MapPin size={17} />
                Event Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter event location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900"
              />
            </div>

            {/* Event Date */}
            <div>
              <label
                htmlFor="eventDate"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                <CalendarDays size={17} />
                Event Date
              </label>

              <input
                id="eventDate"
                name="eventDate"
                type="date"
                min={getTomorrowDate()}
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900"
              />
            </div>

            {/* Creator Information */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                EVENT CREATOR
              </p>

              <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-white">
                {session.user.name || session.user.email}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {session.user.email}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <CalendarPlus size={19} />
                  Create Event
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Together, we can make a difference.
        </p>
      </div>
    </main>
  );
}