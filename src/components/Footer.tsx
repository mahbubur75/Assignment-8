import Link from "next/link";
import { HeartHandshake, ArrowUpRight } from "lucide-react";

const footerLinks = [
{ label: "Home", href: "/" },
{ label: "Upcoming Events", href: "/upcoming-events" },
{ label: "Create Event", href: "/create-event" },
{ label: "Joined Events", href: "/joined-events" },
{ label: "Manage Events", href: "/manage-events" },
];

export default function Footer() {
return (
<footer className="border-t border-border bg-card">
<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
<div>
<Link href="/" className="inline-flex items-center gap-2">
<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
<HeartHandshake size={24} />
</span>
<span className="text-xl font-bold tracking-tight">
CareConnect
</span>
</Link>

        <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
          Connecting people, empowering communities, and creating
          positive social change through volunteering and community
          events.
        </p>
      </div>

      <div>
        <h3 className="mb-4 font-semibold">Quick Links</h3>

        <nav className="flex flex-col items-start gap-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <h3 className="mb-4 font-semibold">Our Mission</h3>

        <p className="text-sm leading-7 text-muted-foreground">
          We believe that small acts of kindness can create lasting
          change. Join our community and help build a better future.
        </p>

        <Link
          href="/upcoming-events"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Explore Events
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>

    <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
      ©  2026 CareConnect. All rights reserved.
    </div>
  </div>
</footer>

);
}