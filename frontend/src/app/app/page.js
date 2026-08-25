"use client";

import DashboardCard from "@/components/dashboardCard";
import CategoriesCard from "@/components/dashboardCategoryChart";
import { ChartAreaLinear } from "@/components/dashboardCharts";
import Notes from "@/components/notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Archive,
  ArrowRight,
  CalendarDaysIcon,
  Download,
  File,
  Plus,
  SparklesIcon,
  Star,
  Upload,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardData } from "./action";
import {
  archievedNote,
  deleteNote,
  favoriteNote,
  pinnedNote,
} from "./notes/action";
import { toast } from "@/components/ui/toast";

function updatePinnedNotes(pinnedNotes, updatedNote) {
  if (!updatedNote.pinned || updatedNote.archived) {
    return pinnedNotes.filter((note) => note.id !== updatedNote.id);
  }

  const alreadyPinned = pinnedNotes.some((note) => note.id === updatedNote.id);

  if (alreadyPinned) {
    return pinnedNotes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note,
    );
  }

  return [updatedNote, ...pinnedNotes];
}

function Page() {
  const router = useRouter();

  const [data, setData] = useState({
    stats: {
      totalNotes: 0,
      favoriteNotes: 0,
      archivedNotes: 0,
      todayNotes: 0,
    },
    weeklyNotes: [],
    categories: [],
    recentNotes: [],
    pinnedNotes: [],
  });

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await DashboardData();
        if (!res?.success) {
          toast.add({
            type: "error",
            description: res?.message || "Failed to load dashboard",
          });
          return;
        }

        setData((prev) => ({
          ...prev,
          ...res.data,
          stats: {
            ...prev.stats,
            ...res.data?.stats,
          },
          weeklyNotes: res.data?.weeklyNotes ?? [],
          categories: res.data?.categories ?? [],
          recentNotes: res.data?.recentNotes ?? [],
          pinnedNotes: res.data?.pinnedNotes ?? [],
        }));
      } catch (error) {
        toast.add({
          type: "error",
          description:
            error?.message || "Something went wrong while loading dashboard",
        });
      }
    };

    getDashboard();
  }, []);

  const handleToggle = async (id, action) => {
    try {
      let res;

      if (action === "favorite") {
        res = await favoriteNote(id);
      } else if (action === "pinned") {
        res = await pinnedNote(id);
      } else if (action === "archived") {
        res = await archievedNote(id);
      } else if (action === "delete") {
        res = await deleteNote(id);
      } else {
        return;
      }

      if (!res?.success) {
        toast.add({
          type: "error",
          description: res?.message || "Something went wrong",
        });
        return;
      }

      if (action === "delete") {
        setData((prev) => ({
          ...prev,

          recentNotes: prev.recentNotes.filter((note) => note.id !== id),

          pinnedNotes: prev.pinnedNotes.filter((note) => note.id !== id),

          stats: {
            ...prev.stats,
            totalNotes: Math.max(0, prev.stats.totalNotes - 1),
          },
        }));

        router.refresh();

        return;
      }

      const updatedNote = res.notes;

      if (!updatedNote) {
        return;
      }

      setData((prev) => ({
        ...prev,

        recentNotes: prev.recentNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note,
        ),

        pinnedNotes: updatePinnedNotes(prev.pinnedNotes, updatedNote),
      }));
    } catch (error) {
      console.error("Note action error:", error);

      toast.add({
        type: "error",
        description: error?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="dark:bg-[#070811] min-h-screen bg-[#F9FAFE] px-3 sm:px-6 py-6">
      <div className="flex flex-col  sm:flex-row justify-between sm:items-center">
        <div>
          <h2 className="text-2xl tracking-tight font-bold font-sans md:text-3xl mb-2">
            Welcome 👋
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening in your workspace today.
          </p>
        </div>

        <div className="w-full sm:w-auto flex justify-end mt-2 sm:mt-0">
          <Link href="/app/notes/new">
            <button
              type="button"
              aria-label="Add new note"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              New Note
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <DashboardCard
          Icon={File}
          stats={data.stats.totalNotes ?? 0}
          text="Total Notes"
          color="from-violet-500 to-indigo-500"
        />

        <DashboardCard
          Icon={Star}
          stats={data.stats.favoriteNotes ?? 0}
          text="Favorites"
          color="from-amber-500 to-orange-500"
        />

        <DashboardCard
          Icon={Archive}
          stats={data.stats.archivedNotes ?? 0}
          text="Archived"
          color="from-slate-500 to-slate-700"
        />

        <DashboardCard
          Icon={CalendarDaysIcon}
          stats={data.stats.todayNotes ?? 0}
          text="Today's notes"
          color="from-emerald-500 to-teal-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartAreaLinear data={data.weeklyNotes} />
        </div>

        <CategoriesCard data={data.categories} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="mt-8 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold">Recent Notes</h4>

            <Link
              href="/app/notes"
              aria-label="view all"
              className="group flex items-center gap-1 text-sm text-violet-500 hover:underline"
            >
              View All
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {data.recentNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {data.recentNotes.map((note) => (
                <Notes
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  category={note.category}
                  content={note.content}
                  tags={note.tags}
                  createdAt={note.createdAt}
                  favorite={note.favorite}
                  pinned={note.pinned}
                  onNoteAction={handleToggle}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No recent notes yet.</p>

              <Link
                href="/app/notes/new"
                className="inline-flex mt-3 text-sm text-violet-500 hover:underline"
              >
                Create your first note
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Card className="shadow bg-[#FCFDFF] dark:bg-[#0D0F1D]">
            <CardHeader>
              <CardTitle className="flex items-center gap-1 font-bold font-sans">
                <SparklesIcon className="size-4 text-violet-500" />
                Quick actions
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Link href="/app/notes/new" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-violet-50 hover:border-violet-300 w-full justify-start py-5 rounded-xl gap-3"
                >
                  <Plus className="text-violet-500" />
                  Create new note
                </Button>
              </Link>

              <Button
                type="button"
                variant="outline"
                className="hover:bg-violet-50 hover:border-violet-300 w-full justify-start py-5 rounded-xl gap-3"
              >
                <Upload className="text-violet-500" />
                Import from JSON
              </Button>

              <Button
                type="button"
                variant="outline"
                className="hover:bg-violet-50 hover:border-violet-300 w-full justify-start py-5 rounded-xl gap-3"
              >
                <Download className="text-violet-500" />
                Export all notes
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-[#FCFDFF] dark:bg-[#0D0F1D] shadow">
            <CardHeader>
              <CardTitle className="font-sans font-bold">Pinned</CardTitle>
            </CardHeader>

            <CardContent>
              {data.pinnedNotes.length > 0 ? (
                <div className="space-y-4">
                  {data.pinnedNotes.map((note) => (
                    <Notes
                      key={note.id}
                      id={note.id}
                      title={note.title}
                      category={note.category}
                      content={note.content}
                      tags={note.tags}
                      createdAt={note.createdAt}
                      favorite={note.favorite}
                      pinned={note.pinned}
                      onNoteAction={handleToggle}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-200">
                  Nothing pinned yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
