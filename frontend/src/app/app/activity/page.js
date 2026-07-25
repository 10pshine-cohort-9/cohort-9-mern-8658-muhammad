"use client";

import {
  Archive,
  ArchiveRestore,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    action: "delete",
    note: "Reading list",
    time: "4 minutes ago",
  },
  {
    id: 2,
    action: "delete",
    note: "Product roadmap Q3",
    time: "2 days ago",
  },
  {
    id: 3,
    action: "favorite",
    note: "Welcome to NoteSphere ✨",
    time: "2 days ago",
  },
  {
    id: 4,
    action: "favorite",
    note: "Reading list",
    time: "6 days ago",
  },
  {
    id: 5,
    action: "create",
    note: "Welcome to NoteSphere ✨",
    time: "3 days ago",
  },
  {
    id: 6,
    action: "archive",
    note: "Design System",
    time: "1 week ago",
  },
  {
    id: 7,
    action: "update",
    note: "Meeting Notes",
    time: "1 week ago",
  },
];

const activityConfig = {
  create: {
    icon: Plus,
    title: "Create",
    color: "text-emerald-500",
    
  },

  favorite: {
    icon: Star,
    title: "Favorite",
    color: "text-amber-500",
   
  },

  archive: {
    icon: Archive,
    title: "Archive",
    color: "text-slate-500",
    
  },

  delete: {
    icon: Trash2,
    title: "Delete",
    color: "text-red-500",
   
  },

  update: {
    icon: Pencil,
    title: "Update",
    color: "text-sky-500",
   
  },
  
pin: {
  icon: Pin,
  title: "Pinned",
  color: "text-violet-500",
 
},

unpin: {
  icon: PinOff,
  title: "Unpinned",
  color: "text-gray-500",
 
},

unfavorite: {
  icon: StarOff,
  title: "Removed Favorite",
  color: "text-gray-500",
  
},

unarchive: {
  icon: ArchiveRestore,
  title: "Restored",
  color: "text-emerald-500",
  
},

};

function page() {
  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] p-6">
      <h1 className="text-2xl md:text-3xl font-bold">Activity</h1>

      <p className="mt-2 text-muted-foreground">
        Everything that happened, in order
      </p>

      <Card className="mt-8 overflow-hidden rounded-3xl gap-0 p-0 dark:bg-[#101321]">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.action];

          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className={`flex items-center gap-5 p-4 ${
                index !== activities.length - 1
                  ? "border-b "
                  : ""
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF1FC] dark:bg-[#1D2130]`}
              >
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>

              <div>
                <p className="text-sm">
                  <span className="font-semibold">
                    {config.title}
                  </span>

                  <span className="text-muted-foreground">
                    — {activity.note}
                  </span>
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
}
export default page