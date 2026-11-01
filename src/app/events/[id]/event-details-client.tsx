"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type EventItem = {
_id: string;
title: string;
description: string;
type: string;
location: string;
eventDate: string;
imageUrl?: string;
image?: string;
};

export default function EventDetailsClient() {
const params = useParams();
const router = useRouter();
const id = params.id as string;

const [event, setEvent] = useState<EventItem | null>(null);
const [loading, setLoading] = useState(true);
const [joining, setJoining] = useState(false);

useEffect(() => {
if (!id) return;

const fetchEvent = async () => {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${apiUrl}/api/events/${id}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Event not found.");
    }

    setEvent(result.event);
  } catch (error) {
    console.error(error);
    toast.error("Unable to load event details.");
  } finally {
    setLoading(false);
  }
};

fetchEvent();

}, [id]);

const handleJoin = async () => {
setJoining(true);

try {
  const tokenResponse = await fetch("/api/backend-token");
  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.token) {
    toast.error("Please log in before joining an event.");
    router.push("/login");
    return;
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const response = await fetch(`${apiUrl}/api/events/${id}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.token}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not join this event.");
  }

  toast.success(result.message || "Successfully joined the event!");
  router.push("/joined-events");
} catch (error) {
  toast.error(
    error instanceof Error ? error.message : "Failed to join event."
  );
} finally {
  setJoining(false);
}

};

if (loading) {
return (
<main className="mx-auto min-h-screen max-w-5xl px-4 py-16">
<div className="h-80 animate-pulse rounded-2xl bg-muted" />
<div className="mt-6 h-8 w-1/2 animate-pulse rounded bg-muted" />
<div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
</main>
);
}

if (!event) {
return (
<main className="px-4 py-20 text-center">
<h1 className="text-2xl font-bold">Event not found</h1>
<Link href="/" className="mt-5 inline-block text-primary hover:underline">
Back to Home
</Link>
</main>
);
}

const imageUrl = event.imageUrl || event.image;
const date = new Date(event.eventDate);

return (
<main className="min-h-screen bg-muted/20 px-4 py-12 sm:px-6">
<article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-sm">
<div className="p-5 sm:p-7">
<Link
href="/"
className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
>
<ArrowLeft size={16} />
Back to Events
</Link>
</div>

    <div className="relative h-64 w-full bg-muted sm:h-96">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No image available
        </div>
      )}
    </div>

    <div className="p-6 sm:p-9">
      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold capitalize text-primary">
        {event.type}
      </span>

      <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
        {event.title}
      </h1>

      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <MapPin size={18} className="shrink-0 text-primary" />
          {event.location}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays size={18} className="shrink-0 text-primary" />
          {Number.isNaN(date.getTime())
            ? "Date to be announced"
            : date.toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })}
        </p>
      </div>

      <div className="my-8 border-t" />

      <h2 className="text-xl font-semibold">About This Event</h2>
      <p className="mt-3 whitespace-pre-wrap leading-7 text-muted-foreground">
        {event.description}
      </p>

      <button
        type="button"
        onClick={handleJoin}
        disabled={joining}
        className="mt-8 w-full rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {joining ? "Joining..." : "Join Event"}
      </button>
    </div>
  </article>
</main>

);
}