"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  MapPin,
  Trash2,
  Loader2,
  Plus,
  Pencil,
  X,
  Save,
  ImagePlus,
  Type,
  FileText,
  Eye,
} from "lucide-react";
import Link from "next/link";

const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Healthcare",
  "Community Support",
  "Other",
];

type EventItem = {
  _id: string;
  title: string;
  description: string;
  type: string;
  imageUrl: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
};

type EventForm = {
  title: string;
  description: string;
  type: string;
  imageUrl: string;
  location: string;
  eventDate: string;
};

const emptyForm: EventForm = {
  title: "",
  description: "",
  type: "",
  imageUrl: "",
  location: "",
  eventDate: "",
};

function formatDateForInput(dateValue: string | Date) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return`${year}-${month}-${day}`;
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateForInput(tomorrow);
}

export default function ManageEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState<EventForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    const fetchMyEvents = async () => {
      try {
        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const tokenResponse = await fetch("/api/backend-token", {
          cache: "no-store",
        });
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.token) {
          throw new Error(tokenData.message || "Authentication failed.");
        }

        const response = await fetch(`${apiUrl}/api/my-events`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load events.");
        }

        setEvents(result.events || []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [session, isPending, router, apiUrl]);

  const handleEdit = (event: EventItem) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      type: event.type || "",
      imageUrl: event.imageUrl || "",
      location: event.location || "",
      eventDate: formatDateForInput(event.eventDate),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingEvent || saving) return;

    if (!session?.user) {
      toast.error("Please login first.");
      router.push("/login");
      return;
    }

    if (new Date(`${formData.eventDate}T00:00:00`) <= new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )) {
      toast.error("Please select a future event date.");
      return;
    }

    if (!apiUrl) {
      toast.error("API URL is not configured.");
      return;
    }

    setSaving(true);

    try {
      const tokenResponse = await fetch("/api/backend-token", {
        cache: "no-store",
      });
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(tokenData.message || "Authentication failed.");
      }

      const response = await fetch(
        `${apiUrl}/api/events/${editingEvent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update event.");
      }

      setEvents((previous) =>
        previous.map((event) =>
          event._id === editingEvent._id
            ? { ...event, ...formData }
            : event
        )
      );

      toast.success("Event updated successfully!");
      setEditingEvent(null);
      setFormData(emptyForm);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update event."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    if (!apiUrl) {
      toast.error("API URL is not configured.");
      return;
    }

    setDeletingId(id);

    try {
      const tokenResponse = await fetch("/api/backend-token", {
        cache: "no-store",
      });
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(tokenData.message || "Authentication failed.");
      }

      const response = await fetch(`${apiUrl}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete event.");
      }

      setEvents((previous) => previous.filter((event) => event._id !== id));

      if (editingEvent?._id === id) {
        setEditingEvent(null);
        setFormData(emptyForm);
      }

      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-700" size={38} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 font-semibold text-blue-700 dark:text-blue-400">
              Your Dashboard
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
              Manage Events
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              View and manage the community events you created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            <Plus size={19} />
            Create New Event
          </Link>
        </div>

        {editingEvent && (
          <section
            id="edit-event-form"
            className="mb-10 rounded-3xl border border-blue-200 bg-white p-5 shadow-lg sm:p-8 dark:border-blue-900 dark:bg-slate-900"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  UPDATE EVENT
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Edit Event
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setFormData(emptyForm);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close edit form"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label htmlFor="edit-title" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <Type size={16} /> Event Title
                </label>
                <input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  minLength={3}
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <FileText size={16} /> Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  minLength={10}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="edit-type" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Event Type
                </label>
                <select
                  id="edit-type"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  {formData.type && !eventTypes.includes(formData.type) && (
                    <option value={formData.type}>{formData.type}</option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="edit-imageUrl" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <ImagePlus size={16} /> Image URL
                </label>
                <input
                  id="edit-imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="edit-location" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <MapPin size={16} /> Location
                </label>
                <input
                  id="edit-location"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="edit-eventDate" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <CalendarDays size={16} /> Event Date
                </label>
                <input
                  id="edit-eventDate"
                  name="eventDate"
                  type="date"
                  min={getTomorrowDate()}
                  value={formData.eventDate}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setEditingEvent(null);
                    setFormData(emptyForm);
                  }}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Events Created
          </p>
          <p className="mt-1 text-3xl font-extrabold text-blue-800 dark:text-blue-400">
            {events.length}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <CalendarDays size={48} className="mx-auto mb-4 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              No Events Found
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              You have not created any events yet.
            </p>
            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-950 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              <Plus size={18} /> Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      width={600}
                      height={300}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <CalendarDays size={48} />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {event.type}
                  </span>

                  <h2 className="mt-4 line-clamp-1 text-xl font-bold text-slate-900 dark:text-white">
                    {event.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} /> {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
  <Link
    href={`/events/${event._id}`}
    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
  >
    <Eye size={16} />
    View
  </Link>

  <button
    type="button"
    onClick={() => handleEdit(event)}
    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950"
  >
    <Pencil size={16} />
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDelete(event._id)}
    disabled={deletingId === event._id}
    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/40 dark:text-red-400"
  >
    {deletingId === event._id ? (
      <Loader2 size={16} className="animate-spin" />
    ) : (
      <Trash2 size={16} />
    )}
    Delete
  </button>
</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}