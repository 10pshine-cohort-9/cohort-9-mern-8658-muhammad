import { ArrowRight, StickyNote } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function RootNavbar() {
    
  return (  <header className="dark:bg-black bg-[#F9FAFE]">
        <div className="flex gap-4 justify-around items-center mx-7 pt-4 pb-3  ">
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
              href={"/#features"}
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
  )
}

export default RootNavbar