"use client";

import Image from "next/image";

const galleryImages = [
{
src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80",
title: "Community Volunteering",
description: "People working together to support their community.",
},
{
src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
title: "Protect Our Environment",
description: "Taking action for a cleaner and greener planet.",
},
{
src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80",
title: "Helping Hands",
description: "Making a difference through kindness and support.",
},
{
src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80",
title: "A Greener Future",
description: "Building a sustainable future for the next generation.",
},
{
src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
title: "Sharing With Others",
description: "Supporting people through community initiatives.",
},
{
src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80",
title: "Stronger Together",
description: "Creating meaningful connections through volunteering.",
},
];

export default function Gallery() {
return (
<section
id="gallery"
className="bg-background px-4 py-16 sm:px-6 lg:px-8"
>
<div className="mx-auto max-w-7xl">
<div className="mx-auto mb-12 max-w-2xl text-center">
<p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
Our Community
</p>

      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Moments That Matter
      </h2>

      <p className="mt-4 leading-7 text-muted-foreground">
        Every volunteer, every helping hand, and every small action
        brings us closer to a better community.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {galleryImages.map((image) => (
        <article
          key={image.title}
          className="group overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="relative h-64 overflow-hidden">
            <Image
              src={image.src}
              alt={image.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold">{image.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {image.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

);
}