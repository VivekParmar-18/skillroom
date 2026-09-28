// Example: ~30-second TEASER (4 scenes) for a fictional clinic-scheduling app.
// Use: cp examples/teaser-30s.story.ts <promoDir>/src/story.ts
import type { Story } from "./types";

export const STORY: Story = {
  brand: {
    name: "Calmly",
    tagline: "Scheduling that patients actually enjoy",
    url: "calmly.example",
    palette: { primary: "#10B981", gradient: ["#34D399", "#2DD4BF"] },
  },
  scenes: [
    { type: "title" },
    {
      type: "chaos",
      problem: ["Clinic scheduling is", "a mess."],
      answer: "Calmly.",
      chips: [
        { label: "Appointments", icon: "calendar" },
        { label: "Reminders", icon: "bell" },
        { label: "Patients", icon: "users" },
        { label: "Providers", icon: "user" },
        { label: "Forms", icon: "form" },
        { label: "Payments", icon: "card" },
      ],
    },
    {
      type: "journey",
      dur: 480,
      eyebrow: "The visit",
      title: ["Booked in seconds,", "remembered for you."],
      stages: [
        { title: "Booked", status: "VISIT · BOOKED", icon: "calendar", tone: "info" },
        { title: "Reminded", status: "SMS · SENT", icon: "bell", tone: "warn" },
        { title: "Checked in", status: "FORMS · DONE", icon: "clipboard" },
        { title: "Completed", status: "VISIT · DONE", icon: "check", tone: "primary" },
      ],
    },
    { type: "outro", dur: 330 },
  ],
};
