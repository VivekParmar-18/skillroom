// Example: ~60-second TECHNICAL / TEAM cut for a fictional API gateway.
// Use: cp examples/technical-60s.story.ts <promoDir>/src/story.ts
// In a real run: stages come from a request/CI state machine, stats are counted from the repo.
import type { Story } from "./types";

export const STORY: Story = {
  brand: {
    name: "Relay",
    tagline: "The API gateway that ships itself",
    url: "relay.example",
    palette: { primary: "#8B5CF6", gradient: ["#A78BFA", "#F472B6"], info: "#38BDF8" },
  },
  scenes: [
    { type: "title" },
    {
      type: "chaos",
      problem: ["Every service speaks", "differently."],
      answer: "One gateway.",
      sub: "Auth, limits, routing and caching in one place.",
      chips: [
        { label: "REST", icon: "code" },
        { label: "gRPC", icon: "cpu" },
        { label: "Webhooks", icon: "zap" },
        { label: "Auth tokens", icon: "key" },
        { label: "Rate limits", icon: "bars" },
        { label: "Retries", icon: "history" },
        { label: "Caches", icon: "database" },
        { label: "Logs", icon: "terminal" },
        { label: "Regions", icon: "globe" },
      ],
    },
    {
      type: "journey",
      eyebrow: "Life of a request",
      title: ["From edge", "to response."],
      stages: [
        { title: "Received", status: "EDGE · ACCEPTED", icon: "globe", tone: "info" },
        { title: "Authenticated", status: "JWT · VERIFIED", icon: "key" },
        { title: "Rate-checked", status: "QUOTA · OK", icon: "bars", tone: "warn" },
        { title: "Routed", icon: "git", tone: "info", badges: ["v1", "v2", "canary"] },
        { title: "Cached", status: "HIT · 4 ms", icon: "database", tone: "violet" },
        { title: "Responded", status: "200 · OK", icon: "check", tone: "primary" },
      ],
    },
    {
      type: "stats",
      eyebrow: "Under the hood",
      title: ["Built to", "scale."],
      stats: [
        { value: 142, label: "Endpoints" },
        { value: 1180, label: "Automated tests", suffix: "+" },
        { value: 18, label: "Plugins" },
        { value: 4, label: "Regions" },
        { value: 38, label: "Migrations" },
        { value: 9, label: "Integrations" },
      ],
      tags: ["Go", "gRPC", "PostgreSQL", "Redis", "Kubernetes", "Terraform"],
    },
    {
      type: "orbit",
      eyebrow: "Plugs into everything",
      nodes: [
        { label: "Postgres", icon: "database" },
        { label: "Redis", icon: "zap" },
        { label: "Kafka", icon: "layers" },
        { label: "S3", icon: "cloud" },
        { label: "Slack", icon: "message" },
        { label: "Grafana", icon: "chart" },
      ],
      caption: ["9 integrations.", "Zero glue code."],
    },
    {
      type: "trust",
      eyebrow: "Secure by default",
      title: ["Zero trust,", "zero drama."],
      features: [
        { icon: "key", title: "JWT & OAuth 2.0", sub: "Short-lived tokens, rotating keys" },
        { icon: "lock", title: "mTLS between services", sub: "Encrypted east-west traffic" },
        { icon: "history", title: "Immutable audit log", sub: "Every config change recorded" },
        { icon: "shield", title: "Per-route RBAC", sub: "Policies as code" },
        { icon: "eye", title: "Secret scanning", sub: "Blocks leaks in CI" },
      ],
    },
    {
      type: "dashboard",
      eyebrow: "Observability",
      title: ["Every request.", "Visible."],
      sidebar: ["chart", "server", "git", "terminal", "bell", "cog"],
      kpis: [
        { label: "Requests / s", value: 48200 },
        { label: "p99 latency", value: 38, suffix: " ms" },
        { label: "Cache hit", value: 91, suffix: "%" },
        { label: "Error rate", value: 0.02, decimals: 2, suffix: "%" },
      ],
      barsTitle: "Traffic by hour",
      lineTitle: "Latency (p99)",
      toasts: [
        { icon: "rocket", title: "Deploy v2.14", sub: "Canary at 10%" },
        { icon: "check", title: "Canary healthy", sub: "Promoted to 100%" },
        { icon: "zap", title: "Autoscaled", sub: "+3 pods in eu-west" },
      ],
      scanCard: { title: "Anomaly detector", done: "ALL CLEAR" },
    },
    { type: "outro" },
  ],
};
