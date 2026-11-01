"use client";

import { useState } from "react";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();

if (!email.trim()) {
  setMessage("Please enter your email address.");
  return;
}

setMessage("Thank you for your interest in CareConnect!");
setEmail("");

}

return (
<section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
<div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16">
<div className="mx-auto max-w-2xl text-center">
<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15">
<Mail size={28} />
</div>

      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Stay Connected With Our Community
      </h2>

      <p className="mx-auto mt-4 max-w-xl leading-7 opacity-90">
        Discover upcoming events, volunteer opportunities, and inspiring
        stories from the CareConnect community.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>

        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setMessage("");
          }}
          placeholder="Enter your email address"
          className="min-w-0 flex-1 rounded-xl border border-transparent bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-background px-5 py-3 font-semibold text-foreground transition-opacity hover:opacity-90"
        >
          Subscribe
          <ArrowRight size={18} />
        </button>
      </form>

      {message && (
        <p
          role="status"
          className="mt-4 flex items-center justify-center gap-2 text-sm"
        >
          <CheckCircle2 size={17} />
          {message}
        </p>
      )}

      <p className="mt-4 text-xs opacity-80">
        Stay informed. Unsubscribe whenever you want.
      </p>
    </div>
  </div>
</section>

);
}