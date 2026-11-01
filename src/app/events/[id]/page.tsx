import { Suspense } from "react";
import EventDetailsClient from "./event-details-client";

export default function EventDetailsPage() {
return (
<Suspense
fallback={
<main className="mx-auto min-h-screen max-w-5xl px-4 py-16">
<div className="h-80 animate-pulse rounded-2xl bg-muted" />
<div className="mt-6 h-8 w-1/2 animate-pulse rounded bg-muted" />
<div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
</main>
}
>
<EventDetailsClient />
</Suspense>
);
}