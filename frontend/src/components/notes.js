import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MoreVertical, Pin, Star } from "lucide-react";

function Notes({
  title,
  category, 
  content,
  tags,
  createdAt,
  favorite,
  pinned,
}) {
  return (
    <Card
      className="font-sans h-64 m-2 shadow-xs transition-all duration-300
      hover:shadow-[0_10px_35px_rgba(139,92,246,0.4)]
      hover:ring-violet-300 group
      dark:bg-[#101321]
      dark:border-b-gray-800
      border-b-gray-100"
    >
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>
            <div className="flex items-center gap-3">
              {pinned && (
                <Pin className="size-4 text-violet-700 fill-violet-700" />
              )}

              <div className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-[#1D2130] dark:text-gray-400">
                {category}
              </div>
            </div>

            <h2 className="mt-3 text-xl">{title}</h2>
          </CardTitle>

          <CardAction>
            <button>
              <Star
                className={`size-4 ${
                  favorite
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            </button>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="h-28 flex flex-col">
  <p className="line-clamp-3 text-gray-600 dark:text-gray-400">
    {content}
  </p>

  <div className="mt-auto flex flex-wrap gap-2">
    {tags?.map((tag) => (
      <div
        key={tag}
        className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold text-gray-700 dark:bg-[#2B2654] dark:text-gray-200"
      >
        #{tag}
      </div>
    ))}
  </div>
</CardContent>

                <CardFooter className={"border-0 bg-transparent mt-0 pt-0 flex justify-between"}>
        <p className="text-xs text-gray-700 dark:text-gray-200">
          {createdAt}
        </p>

        <MoreVertical className="size-4 opacity-0 transition-all duration-200 group-hover:opacity-100 dark:text-gray-200" />
      </CardFooter>
    </Card>
  );
}

export default Notes;