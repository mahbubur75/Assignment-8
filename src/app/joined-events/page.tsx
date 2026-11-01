"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarDays, ArrowDownWideNarrow, ArrowUpWideNarrow, Shuffle } from "lucide-react";

type EventItem = {
  _id: string;
  title: string;
  description: string;
  type: string;
  imageUrl: string;
  location: string;
  eventDate: string;
};

type SortOption = "ascending" | "descending" | "random";

export default function JoinedEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>("ascending");
  const [randomOrder, setRandomOrder] = useState<string[]>([]);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const tokenResponse = await fetch("/api/backend-token");
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.token) {
          toast.error("Please log in to see your joined events.");
          return;
        }

        const response = await fetch(`${apiUrl}/api/joined-events`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load joined events.");
        }

        const joinedEvents: EventItem[] = Array.isArray(result.events)
          ? result.events
          : Array.isArray(result.data)
            ? result.data
            : [];

        setEvents(joinedEvents);
        setRandomOrder(
          [...joinedEvents]
            .sort(() => Math.random() - 0.5)
            .map((event) => event._id)
        );
      } catch (error) {
        console.error("Joined events error:", error);
        toast.error("Could not load joined events.");
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedEvents();
  }, []);

  const sortedEvents = useMemo(() => {
    const list = [...events];

    if (sortOption === "ascending") {
      return list.sort(
        (a, b) =>
          new Date(a.eventDate).getTime() -
          new Date(b.eventDate).getTime()
      );
    }

    if (sortOption === "descending") {
      return list.sort(
        (a, b) =>
          new Date(b.eventDate).getTime() -
          new Date(a.eventDate).getTime()
      );
    }

    const order = new Map(randomOrder.map((id, index) => [id, index]));

    return list.sort(
      (a, b) =>
        (order.get(a._id) ?? 0) - (order.get(b._id) ?? 0)
    );
  }, [events, sortOption, randomOrder]);

  const shuffleEvents = () => {
    setRandomOrder(
      [...events]
        .sort(() => Math.random() - 0.5)
        .map((event) => event._id)
    );
    setSortOption("random");
  };

  const sortButtons = [
    {
      value: "ascending" as const,
      label: "Date Earliest First",
      icon: ArrowUpWideNarrow,
    },
    {
      value: "descending" as const,
      label: "Date Latest First",
      icon: ArrowDownWideNarrow,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 font-semibold tracking-widest text-blue-600">
            YOUR ACTIVITIES
          </p>

          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            Joined Events
          </h1>

          <p className="mt-3 text-gray-600">
            Keep track of the events you have joined.
          </p>
        </div>

        {!loading && events.length > 0 && (
          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-gray-900">Sort your events</h2>
              <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {events.length} {events.length === 1 ? "Event" : "Events"}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {sortButtons.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSortOption(value)}
                  aria-pressed={sortOption === value}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition duration-200 ${
                    sortOption === value
                      ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}

              <button
                type="button"
                onClick={shuffleEvents}
                aria-pressed={sortOption === "random"}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition duration-200 ${
                  sortOption === "random"
                    ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-100"
                    : "border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <Shuffle className="h-4 w-4" />
                Random Order
              </button>
            </div>
          </section>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow"
              >
                <div className="h-48 bg-gray-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mb-4 text-5xl">📅</div>
            <h2 className="text-xl font-bold text-gray-900">
              No joined events yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-600">
              Explore upcoming events and join the ones that interest you.
            </p>
            <Link
              href="/upcoming-events"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-500">
              Showing events in{" "}
              <span className="font-semibold text-gray-700">
                {sortOption === "ascending"
                  ? "earliest date first"
                  : sortOption === "descending"
                    ? "latest date first"
                    : "random order"}
              </span>
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedEvents.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-gray-200">
                    {event.imageUrl && (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold capitalize text-blue-700 shadow-sm">
                        {event.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="line-clamp-1 text-xl font-bold text-gray-900 transition group-hover:text-blue-700">
                      {event.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 min-h-15 text-sm leading-5 text-gray-600">
                      {event.description}
                    </p>

                    <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
                      <p className="flex items-start gap-2">
                        <span>📍</span>
                        <span>{event.location}</span>
                      </p>

                      <p className="flex items-start gap-2">
                        <span>📅</span>
                        <span>
                          {new Date(event.eventDate).toLocaleString("en-BD", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Event <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}