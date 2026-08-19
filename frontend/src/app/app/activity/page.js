import {
  Archive,
  ArchiveRestore,
  CircleHelp,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { AxiosReq } from "@/lib/api/server-api";

const activityConfig = {
  NOTE_CREATED: {
    icon: Plus,
    title: "Created",
    color: "text-emerald-500",
  },

  NOTE_UPDATED: {
    icon: Pencil,
    title: "Updated",
    color: "text-sky-500",
  },

  NOTE_DELETED: {
    icon: Trash2,
    title: "Deleted",
    color: "text-red-500",
  },

  NOTE_PINNED: {
    icon: Pin,
    title: "Pinned",
    color: "text-violet-500",
  },

  NOTE_UNPINNED: {
    icon: PinOff,
    title: "Unpinned",
    color: "text-gray-500",
  },

  NOTE_FAVORITED: {
    icon: Star,
    title: "Favorited",
    color: "text-amber-500",
  },

  NOTE_UNFAVORITED: {
    icon: StarOff,
    title: "Removed Favorite",
    color: "text-gray-500",
  },

  NOTE_ARCHIVED: {
    icon: Archive,
    title: "Archived",
    color: "text-slate-500",
  },

  NOTE_UNARCHIVED: {
    icon: ArchiveRestore,
    title: "Restored",
    color: "text-emerald-500",
  },
};

const defaultActivityConfig = {
  icon: CircleHelp,
  title: "Activity",
  color: "text-muted-foreground",
};

async function page() {
  try {
    let api = await AxiosReq();
    let res = await api.get("/activity");
    let activities = await res.data;

    return (
      <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] px-3 sm:px-6 py-6 ">
        <h1 className="text-2xl md:text-3xl font-bold">Activity</h1>

        <p className="mt-2 text-muted-foreground">
          Everything that happened, in order
        </p>

        <Card className="mt-8 overflow-hidden rounded-3xl gap-0 p-0 dark:bg-[#101321]">
          {activities.map((activity, index) => {
            const config =
              activityConfig[activity.action] ?? defaultActivityConfig;

            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className={`flex items-center gap-5 p-4 ${
                  index !== activities.length - 1 ? "border-b " : ""
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF1FC] dark:bg-[#1D2130]`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>

                <div>
                  <p className="text-sm">
                    <span className="">{activity.message}</span>
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    );
  } catch (error) {
    throw new Error("Failed to load activity");
  }
}
export default page;
