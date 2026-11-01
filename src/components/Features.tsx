"use client";

import { HeartHandshake, Users, Sprout, HandCoins } from "lucide-react";

const features = [
{
icon: Sprout,
title: "Environmental Protection",
description:
"Join cleanup campaigns and tree-planting initiatives to build a cleaner, greener environment.",
},
{
icon: HeartHandshake,
title: "Humanitarian Support",
description:
"Stand beside people in need and help deliver meaningful support to vulnerable communities.",
},
{
icon: Users,
title: "Community Connection",
description:
"Connect with like-minded people and work together to create positive social change.",
},
{
icon: HandCoins,
title: "Volunteer Initiatives",
description:
"Contribute your time, skills, and effort to make a meaningful difference in society.",
},
];

export default function Features() {
return (
<section
id="features"
className="bg-background px-4 py-16 sm:px-6 lg:px-8"
>
<div className="mx-auto max-w-7xl">
<div className="mx-auto mb-12 max-w-2xl text-center">
<p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
Why CareConnect?
</p>

      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Together, We Can Change Our Society
      </h2>

      <p className="mt-4 leading-7 text-muted-foreground">
        Every small action can create a big impact. Your participation
        can help build a better and brighter future for everyone.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <article
            key={feature.title}
            className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={25} />
            </div>

            <h3 className="mb-3 text-lg font-semibold">
              {feature.title}
            </h3>

            <p className="text-sm leading-7 text-muted-foreground">
              {feature.description}
            </p>
          </article>
        );
      })}
    </div>
  </div>
</section>

);
}