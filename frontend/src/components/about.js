

import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Heart,
  Globe,
} from "lucide-react";

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] p-8">
   
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          About NoteSphere
        </h1>

        <p className="mt-2 text-muted-foreground">
          Made with care for people who love their notes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <Card className="lg:col-span-2 rounded-3xl border bg-white shadow-sm dark:bg-[#101321]">
          <CardContent className="p-8">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-violet-500 to-sky-500">
              <FileText className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold">
              A calmer way to write things down.
            </h2>

            <p className="mt-3 leading-8 text-muted-foreground">
              NoteSphere is a modern notes workspace born from a simple
              frustration: existing tools were either too heavy or too plain.
              We wanted something fast, thoughtful, and delightful — a place
              where ideas feel welcome.
            </p>

            <p className="mt-3 leading-8 text-muted-foreground">
              Every screen, every interaction, every color has been considered
              so you can focus on what actually matters — your thoughts.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-3xl border bg-white shadow-sm dark:bg-[#101321]">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <Heart className="h-5 w-5 text-violet-500" />

                <h3 className="text-xl font-semibold">
                  Values
                </h3>
              </div>

              <ul className="space-y-3 text-muted-foreground">
                <li>• Speed as a feature</li>
                <li>• Beauty in the details</li>
                <li>• Privacy by default</li>
                <li>• Delight, always</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border bg-white shadow-sm dark:bg-[#101321]">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <Globe className="h-5 w-5 text-violet-500" />

                <h3 className="text-xl font-semibold">
                  Version
                </h3>
              </div>

              <p className="leading-7 text-muted-foreground">
                <span className="font-semibold">v1.0.0</span> • Built with
                React, Next.js, Tailwind CSS
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AboutPage