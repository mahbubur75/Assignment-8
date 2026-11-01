"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

type EventItem = {
  _id: string;
  title: string;
  type: string;
  location: string;
  eventDate: string;
  imageUrl?: string;
  image?: string;
};

export default function RecentUpcomingEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5000";

        const response = await fetch(
          `${apiUrl}/api/events?view=recent`
        );

        if (!response.ok) {
          throw new Error("Failed to load events.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Could not load recent events.");
        }

        const now = Date.now();

        const upcomingEvents = (data.events || [])
          .filter(
            (event: EventItem) =>
              new Date(event.eventDate).getTime() > now
          )
          .slice(0, 6);

        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Recent events error:", err);
        setError(
          "Unable to load recent events. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section
      id="recent-upcoming-events"
      className="bg-gray-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Make a Difference
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Recent Upcoming Events
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              Explore the latest community events and find an
              opportunity to make a positive difference.
            </p>
          </div>

          <Link
            href="/upcoming-events"
            className="inline-flex shrink-0 items-center gap-2 font-bold text-emerald-700 transition hover:gap-3 hover:text-emerald-800"
          >
            View All Events
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-52 animate-pulse bg-gray-200" />
                <div className="space-y-4 p-5">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-red-600">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <CalendarDays
              size={42}
              className="mx-auto mb-4 text-emerald-600"
            />

            <h3 className="text-xl font-bold text-gray-900">
              No Upcoming Events Yet
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              New community events will appear here when they are created.
            </p>

            <Link
              href="/upcoming-events"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Explore Events
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
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

                    <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm">
                      {event.type}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-2 min-h-14 text-xl font-bold leading-7 text-gray-900 transition group-hover:text-emerald-700">
                      {event.title}
                    </h3>

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

        <div className="mt-9 text-center sm:hidden">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
          >
            View All Events
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}