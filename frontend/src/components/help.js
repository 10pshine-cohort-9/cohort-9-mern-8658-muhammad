"use client";

import { BookOpen, MessageCircle, Mail, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";

const cards = [
  {
    title: "Guides",
    description: "Learn the basics and pro tricks.",
    icon: BookOpen,
  },
  {
    title: "Shortcuts",
    description: "Fly with the keyboard.",
    icon: Zap,
  },
  {
    title: "Community",
    description: "Ask, share, and inspire.",
    icon: MessageCircle,
  },
];

const faqs = [
  {
    question: "How is my data stored?",
    answer:
      "Your notes are stored in your NoteSphere account and can be accessed when you sign in. Data synchronization depends on your configured account and storage setup.",
  },
  {
    question: "Can I import from another app?",
    answer:
      "Yes — use Import on the dashboard to load a JSON export from another NoteSphere workspace.",
  },
  {
    question: "Does NoteSphere support markdown?",
    answer:
      "The editor is rich text, and the preview toggle renders your HTML content for a clean reading experience.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "NoteSphere is fully responsive and works beautifully on mobile browsers today.",
  },
];

function HelpPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Help Center</h1>

        <p className="mt-2 text-muted-foreground">
          Answers, guides, and support
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="rounded-3xl bg-[#FCFDFF] dark:bg-[#0D0F1D] shadow"
            >
              <CardContent className="px-5 py-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500">
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="mt-3 text-lg font-bold">{item.title}</h3>

                <p className="mt-1 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 rounded-3xl bg-[#FCFDFF] dark:bg-[#0D0F1D] shadow">
        <CardContent className="p-0">
          <Accordion type="single" collapsible={true} defaultValue="item-0">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="px-6"
              >
                <AccordionTrigger className="text-left dark:text-gray-300  font-semibold font-sans hover:no-underline">
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="pb-5 text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div
        className="
    mt-8
    flex flex-col gap-5
    rounded-3xl
    bg-gradient-to-r from-violet-500 to-sky-500
    p-5 sm:p-6
    text-white
    sm:flex-row sm:items-center sm:justify-between
  "
      >
        <div>
          <h2 className="text-lg font-bold">Still need help?</h2>

          <p className="mt-1 text-sm text-white/90">
            Our team responds within 24 hours.
          </p>
        </div>

        <Link
          href="mailto:mohsinnaveed196@gmail.com"
          className="
      flex w-full items-center justify-center
      rounded-full
      bg-white/15
      px-6 py-2.5
      text-white
      backdrop-blur
      hover:bg-white/25
      sm:w-auto
    "
        >
          <Mail className="mr-2 h-4 w-4 shrink-0" />
          Contact support
        </Link>
      </div>
    </div>
  );
}

export default HelpPage;
