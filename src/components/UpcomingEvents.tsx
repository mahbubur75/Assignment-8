"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  PlusCircle,
  SlidersHorizontal,
} from "lucide-react";

type EventItem = {
  _id: string;
  title: string;
  description?: string;
  type: string;
  location: string;
  eventDate: string;
  imageUrl?: string;
  image?: string;
};

const categories = [
  "All",
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Healthcare",
  "Education",
];

const normalize = (value: string) =>
  value.toLowerCase().replace(/[-_]+/g, " ").trim();

export default function UpcomingEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const response = await fetch(`${apiUrl}/api/events`);

        if (!response.ok) {
          throw new Error("Failed to load events.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Could not load upcoming events.");
        }

        const upcomingEvents = (data.events || []).filter(
          (event: EventItem) =>
            new Date(event.eventDate).getTime() > Date.now()
        );

        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Upcoming events error:", err);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = normalize(searchTerm);

    return events.filter((event) => {
      const matchesCategory =
        activeCategory === "All" ||
        normalize(event.type) === normalize(activeCategory);

      const searchableText = normalize(
        `${event.title} ${event.description || ""} ${event.location} ${event.type}`
      );

      const matchesSearch =
        query.length === 0 || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [events, activeCategory, searchTerm]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="flex flex-col gap-6 border-b border-gray-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Make a Difference
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Upcoming Events
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              Discover verified volunteer initiatives scheduled for
              upcoming dates. Find an opportunity and make a difference
              in your community.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <PlusCircle size={19} />
            Create Event
          </Link>
        </div>

        {/* Filters and search */}
        <div className="my-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 flex items-center gap-2 text-sm font-semibold text-gray-500">
              <SlidersHorizontal size={16} />
              Categories
            </span>

            {categories.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="relative w-full xl:max-w-sm">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search events by name..."
              aria-label="Search events by name"
              className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        {/* Results summary */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {loading ? "..." : filteredEvents.length}
            </span>{" "}
            {filteredEvents.length === 1 ? "event" : "events"}
            {activeCategory !== "All" && (
              <>
                {" "}in{" "}
                <span className="font-semibold text-emerald-700">
                  {activeCategory}
                </span>
              </>
            )}
          </p>

          {(activeCategory !== "All" || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setSearchTerm("");
              }}
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-52 animate-pulse bg-gray-200" />
                <div className="space-y-4 p-5">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-14 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <CalendarDays
              className="mx-auto mb-4 text-emerald-600"
              size={44}
            />

            <h2 className="text-xl font-bold text-gray-900">
              No Events Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              We couldn&apos;t find any events matching your search or
              selected category. Try another category or search term.
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setSearchTerm("");
              }}
              className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Show All Events
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const imageUrl = event.imageUrl || event.image;
              const date = new Date(event.eventDate);

              return (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-200">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={event.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No image available
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/95 px-3 py-1.5 text-xs font-bold capitalize text-emerald-800 shadow-sm">
                      {event.type}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="line-clamp-2 min-h-14 text-xl font-bold leading-7 text-gray-900 transition group-hover:text-emerald-700">
                      {event.title}
                    </h2>

                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <p className="flex items-start gap-2.5">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />
                        <span>{event.location}</span>
                      </p>

                      <p className="flex items-start gap-2.5">
                        <CalendarDays
                          size={17}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />
                        <span>
                          {Number.isNaN(date.getTime())
                            ? "Date to be announced"
                            : date.toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                    >
                      View Event
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}