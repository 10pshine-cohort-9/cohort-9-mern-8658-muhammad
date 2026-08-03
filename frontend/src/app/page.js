import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Cloud,
  Lock,
  Search,
  Sparkles,
  SparklesIcon,
  Star,
  StickyNote,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Rich text editor",
      description:
        "Format, structure, and style your notes with a powerful WYSIWYG editor.",
      icon: Sparkles,
    },
    {
      title: "Instant search",
      description:
        "Find any note across titles, tags, and content in milliseconds.",
      icon: Search,
    },
    {
      title: "Favorites & pinning",
      description: "Keep what matters at the top with pinning and favorites.",
      icon: Star,
    },
    {
      title: "Everywhere access",
      description: "Sync across devices with a cloud-native architecture.",
      icon: Cloud,
    },
    {
      title: "Private by default",
      description: "Your notes are yours — encrypted and never shared.",
      icon: Lock,
    },
    {
      title: "Lightning fast",
      description: "Optimized for keyboard-first workflows and speed.",
      icon: Zap,
    },
  ];

  return (
    <div className=" dark:bg-[#070811] bg-[#F9FAFE]  min-h-screen">
      <header className="">
        <div className="flex gap-4 justify-around items-center mx-7 mt-4 mb-3  ">
          <div className="flex items-center gap-3">
            <div className="rounded-full flex h-10 w-10 justify-center items-center bg-gradient-to-br from-violet-500 to-sky-500">
              <StickyNote className="size-4.5 font-bold text-white " />
            </div>
            <h2 className="text-lg font-sans text-gray-900 dark:text-white font-bold">
              NoteSphere
            </h2>
          </div>

          <nav className="space-x-3 text-center flex-1">
            <Link
              href={"#features"}
              className="text-muted-foreground hover:text-gray-950 dark:hover:text-white transition-all duration-200"
            >
              Features
            </Link>
            <Link
              className="text-muted-foreground hover:text-gray-950 dark:hover:text-white transition-all duration-200"
              href={"/about"}
            >
              About
            </Link>
            <Link
              className="text-muted-foreground hover:text-gray-950 dark:hover:text-white transition-all duration-200"
              href={"/help"}
            >
              Help
            </Link>
          </nav>

          <div className=" flex gap-2">
            <Link
              href={"/auth/login"}
              className="text-nowrap  hover:bg-violet-100 rounded-xl px-4 transition-all duration-300 py-3 text-black dark:text-white dark:hover:bg-slate-800/70"
            >
              Sign in
            </Link>

            <Link href={"/auth/signup"} className=" flex w-full items-center  gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className=" max-w-7xl px-6 pb-16 pt-10 mx-auto md:pb-24 md:pt-20  ">
        <div className="mx-auto bg-white border border-gray-300 flex justify-center items-center gap-2 w-fit rounded-2xl text-gray-600 font-semibold font-sans px-3 py-0.5 text-xs">
          <SparklesIcon className="size-4 text-violet-600" />
          New — Rich text editor with markdown preview
        </div>

        <div className="mx-auto max-w-3xl text-center mt-7">
          <h2 className="text-4xl  font-extrabold   md:text-6xl ">
            Your ideas,
            <span
              className="bg-[linear-gradient(135deg,#8B3DFF,#3F7BFF)]
    dark:bg-[linear-gradient(135deg,#A56CFF,#5A8EFF)]
    bg-clip-text
    text-transparent
"
            >
              beautifully organized
            </span>
          </h2>

          <p className="text-muted-foreground mt-5  text-base max-w-xl mx-auto md:text-lg ">
            NoteSphere is a modern, premium notes workspace built for people who
            care about the details — with a stunning editor, powerful search,
            and a delightful UI.
          </p>

          <div className="flex gap-4 items-center justify-center mt-5">
            <Link href={'/auth/signup'} className=" flex items-center  gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>

           <Link href={"/auth/login"}>  <Button variant="outline"  className={"px-4 py-5 rounded-2xl"}>
              Explore Dashboard
            </Button></Link>
          </div>
        </div>

        <Card
          className="mx-auto max-w-5xl  mt-16 transition-all duration-300 bg-[##FCFEFF]  backdrop-blur-xl
    backdrop-saturate-150 bg-transparent
      shadow-[0_10px_35px_rgba(139,92,246,0.4)]
      hover:ring-violet-300 group
      dark:bg-[#0D0F1D]
      dark:border-b-gray-800
      border-b-gray-100 p-3  rounded-4xl ring-0 "
        >
          <CardContent className={"p-0 "}>
            <Card className={" rounded-3xl dark:bg-[#101321]"}>
              <CardContent className={"p-6"}>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#F4F5FD] dark:bg-gradient-to-br from-[#080A13] to-[#1C1F2E] rounded-2xl px-5 py-4">
                    <h2 className="text-4xl text-violet-500 tracking-tight font-extrabold ">
                      128
                    </h2>
                    <p className="mt-2 text-muted-foreground"> Notes</p>
                  </div>

                  <div className="bg-[#F4F5FD] rounded-2xl dark:bg-gradient-to-br from-[#080A13] to-[#1C1F2E] px-5 py-4">
                    <h2 className="text-4xl text-violet-500 tracking-tight font-extrabold ">
                      24
                    </h2>
                    <p className="mt-2 text-muted-foreground"> Favorites</p>
                  </div>

                  <div className="bg-[#F4F5FD] rounded-2xl dark:bg-gradient-to-br from-[#080A13] to-[#1C1F2E] px-5 py-4">
                    <h2 className="text-4xl text-violet-500 tracking-tight font-extrabold ">
                      9
                    </h2>
                    <p className="mt-2 text-muted-foreground"> Categories</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card className={"gap-2 dark:bg-[#101321]"}>
                    <CardHeader>
                      <CardTitle>
                        <h2 className="mt-3 text-xl">Quarterly review</h2>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className=" flex flex-col  ">
                      <p className="line-clamp-3 text-gray-600 dark:text-gray-400">
                        Highlights from Q3 planning across product, design and
                        engineering.
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <div className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold text-gray-700 dark:bg-[#2B2654] dark:text-gray-200">
                          #planning
                        </div>

                        <div className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold text-gray-700 dark:bg-[#2B2654] dark:text-gray-200">
                          #work
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={"gap-2 dark:bg-[#101321]"}>
                    <CardHeader>
                      <CardTitle>
                        <h2 className="mt-3 text-xl">Book notes: Shape Up</h2>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className=" flex flex-col">
                      <p className="line-clamp-3 text-gray-600 dark:text-gray-400">
                        Six-week cycles, appetite, and shaping vs building.
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <div className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold text-gray-700 dark:bg-[#2B2654] dark:text-gray-200">
                          #reading
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      <div id="features" className="mx-auto max-w-3xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Everything you need. Nothing you don't.
        </h1>

        <p className="mt-5 text-xl text-muted-foreground">
          Thoughtfully designed features that stay out of your way.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl mb-10 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card
              key={feature.title}
              className="rounded-3xl  bg-white shadow-sm transition-all duration-300 border-0  hover:shadow-[0_10px_35px_rgba(139,92,246,0.4)]
      hover:ring-violet-300 group
      dark:bg-[#101321] dark:ring-gray-800
      dark:border-b-gray-800 ring-gray-200 hover:border-violet-300 hover: dark:bg-[#101321]"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <h2 className="text-lg font-semibold">{feature.title}</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

<footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} NoteSphere. Crafted with care.</div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/help" className="hover:text-foreground">Help</Link>
            <Link href="/auth/login" className="hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
