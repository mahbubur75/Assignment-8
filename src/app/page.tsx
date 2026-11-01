import Banner from "@/components/Banner";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import Newsletter from "@/components/Newsletter";
import RecentUpcomingEvents from "@/components/RecentUpcomingEvents";



export default function Home() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <Banner />
      <Features />
      <RecentUpcomingEvents />
      <Gallery />
      <Newsletter />
    </main>
  );
}