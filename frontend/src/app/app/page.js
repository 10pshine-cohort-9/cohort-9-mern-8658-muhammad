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

function Page() {
  const notes = [
  {
    id: 1,
    title: "Welcome to NoteSphere ✨",
    category: "Personal",
    content:
      "Hello there! This is your first note. Try creating a new one, favorite it, or archive it.",
    tags: ["intro", "welcome", "roadmap"],
    createdAt: "10 hours ago",
    favorite: false,
    pinned: true,
  },
  {
    id: 2,
    title: "Reading List",
    category: "Learning",
    content:
      "Designing Data-Intensive Applications, Clean Code and Refactoring.",
    tags: ["books"],
    createdAt: "6 days ago",
    favorite: true,
    pinned: false,
  },
];
  return (
    <div className="dark:bg-[#070811] min-h-screen bg-[#F9FAFE] p-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl tracking-tight  font-bold font-sans md:text-3xl mb-2">Welcome 👋</h2>
      <p className="mt-1 text-sm text-muted-foreground">Here's what's happening in your workspace today.</p>
        </div>
        <button type="button" aria-label="Add new note" className="  flex  items-center  gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            <Plus className="h-4 w-4" />
            New Note
     
          </button>
        
      </div>
      <div className="grid grid-cols-4 gap-4 mt-8 ">
        <DashboardCard
          Icon={File}
          stats={2}
          text="Total Notes"
          color={"from-violet-500 to-indigo-500"}
        />
        <DashboardCard
          Icon={Star}
          stats={1}
          text="Favorites"
          color={"from-amber-500 to-orange-500"}
        />
        <DashboardCard
          Icon={Archive}
          stats={0}
          text="Archived"
          color={"from-slate-500 to-slate-700 "}
        />
        <DashboardCard
          Icon={CalendarDaysIcon}
          stats={0}
          text="Today's notes"
          color={"from-emerald-500 to-teal-500"}
        />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ChartAreaLinear></ChartAreaLinear>
        </div>
        <CategoriesCard />
      </div>

      <div className="grid grid-cols-3 gap-4 ">
        <div className=" mt-8 col-span-2 ">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold">Recent Notes</h4>
            <Link 
            href={"/app/notes"}
              
              aria-label="view all"
              className="group flex items-center gap-1 text-sm text-violet-500 hover:underline"
            >
              View All
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2">
              {notes.map((note) => (
    <Notes
      key={note.id}
      title={note.title}
      category={note.category}
      content={note.content}
      tags={note.tags}
      createdAt={note.createdAt}
      favorite={note.favorite}
      pinned={note.pinned}
    />
  ))}

          </div>
        </div>

        <div className="mt-8">
          <Card className={"shadow bg-[#FCFDFF] dark:bg-[#0D0F1D]"}>
            <CardHeader>
              <CardTitle
                className={"flex items-center gap-1 font-bold font-sans"}
              >
                <SparklesIcon className="size-4 text-violet-500" /> Quick
                actions
              </CardTitle>
            </CardHeader>
            <CardContent className={"space-y-4"}>
              <Button
              type="button" 
                variant="outline"
                className={
                  "hover:bg-violet-50 hover:border-violet-300 w-full justify-start py-5 rounded-xl gap-3 "
                }
              >
                <Plus data-icon="inline-start" className="text-violet-500 " />{" "}
                New Branch
              </Button>

              <Button
              type="button"
                variant="outline"
                className={
                  "hover:bg-violet-50 hover:border-violet-300 w-full justify-start py-5 rounded-xl gap-3 "
                }
              >
                <Upload data-icon="inline-start" className="text-violet-500 " />{" "}
                New Branch
              </Button>

              <Button
              type="button"
                variant="outline"
                className={
                  "hover:bg-violet-50 hover:border-violet-300 w-full justify-start py-5 rounded-xl gap-3 "
                }
              >
                <Download
                  data-icon="inline-start"
                  className="text-violet-500 "
                />{" "}
                New Branch
              </Button>
            </CardContent>
          </Card>

          <Card className={"mt-8 bg-[#FCFDFF] dark:bg-[#0D0F1D] shadow"}>
            <CardHeader>
              <CardTitle className={"font-sans font-bold"}>Pinned </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-200">
                {" "}
                Nothing pinned yet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
