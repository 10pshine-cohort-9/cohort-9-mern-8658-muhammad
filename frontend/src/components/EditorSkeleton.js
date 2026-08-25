import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditorSkeleton() {
  return (
    <div className="min-h-screen bg-[#F9FAFE] px-3 py-6 dark:bg-[#070811] sm:px-6">
      <div className="flex flex-col justify-between md:flex-row">
        <div className="space-y-3">
          <div className="h-9 w-40 animate-pulse rounded bg-muted" />
          <div className="h-5 w-64 animate-pulse rounded bg-muted" />
        </div>

        <div className="mt-4 flex gap-3 md:mt-0">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-10 w-20 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-10">
        <div className="space-y-4 md:col-span-7">
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-80 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="space-y-3 md:col-span-3">
          <Card>
            <CardHeader>
              <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-12 animate-pulse rounded bg-muted" />
              <div className="h-12 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-6 w-28 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-10 w-40 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
