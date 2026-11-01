"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, ShieldCheck, Users } from "lucide-react";

export default function Banner() {
return (
<section className="relative bg-linear-to-br from-blue-50 via-white to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
<div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
<div>
<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm dark:border-blue-900 dark:bg-slate-900 dark:text-blue-200">
<HeartHandshake size={18} />
Together for a Better Community
</div>

      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-blue-950 sm:text-5xl lg:text-6xl dark:text-white">
        Small Acts.
        <span className="block text-blue-600">
          Big Differences.
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
        Discover local social service events, meet passionate
        volunteers, and take part in building a kinder, greener,
        stronger community. Every helping hand matters.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-950 px-6 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-800"
        >
          Explore Events <ArrowRight size={19} />
        </Link>

        <Link
          href="/create-event"
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-3.5 font-bold text-blue-950 transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <HeartHandshake size={19} /> Create an Event
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-blue-600" />
          Community driven
        </span>
        <span className="flex items-center gap-2">
          <Users size={18} className="text-blue-600" />
          Open to everyone
        </span>
      </div>
    </div>

    <div className="relative overflow-hidden rounded-3xl border border-white shadow-2xl shadow-blue-950/15 dark:border-slate-700">
      <Image
        src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85"
        alt="Volunteers working together to support their community"
        width={1200}
        height={900}
        priority
        className="h-80 w-full object-cover sm:h-107.5"
      />

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/90 to-transparent p-6 pt-20 text-white sm:p-8 sm:pt-24">
        <p className="text-sm font-semibold text-blue-200">
          EVERY ACTION COUNTS
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          Be the reason someone smiles.
        </h2>
        <p className="mt-2 text-sm text-slate-200">
          Give your time. Share your kindness. Create change.
        </p>
      </div>
    </div>
  </div>
</section>

);
}