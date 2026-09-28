import type { Story } from "./types";

/**
 * EXAMPLE STORY — replace every value with facts read from the target repo.
 * (Fictional product; no logo, so the wordmark + monogram fallbacks are used.)
 *
 * Rules: every label must be traceable to the repo (enum names, route names, README claims,
 * package manifests). Invented numbers only in scenes marked `illustrative`.
 */
export const STORY: Story = {
  brand: {
    name: "Northwind",
    tagline: "Operations software for modern logistics teams",
    url: "northwind.example",
    // logo: "brand/logo.png", logoAspect: 4.2,   // copy the repo's light-on-dark logo into public/brand/
    // icon: "brand/icon.png",
    palette: {
      primary: "#3B82F6",
      gradient: ["#60A5FA", "#22D3EE"],
    },
  },
  scenes: [
    { type: "title", lines: ["Operations software", "for modern logistics"] },
    {
      type: "chaos",
      problem: ["Running logistics is", "chaotic."],
      answer: "One workspace.",
      sub: "Every shipment. Every team. Every invoice.",
      chips: [
        { label: "Shipments", icon: "truck" },
        { label: "Warehouses", icon: "building" },
        { label: "Drivers", icon: "user" },
        { label: "Customers", icon: "users" },
        { label: "Invoices", icon: "receipt" },
        { label: "Routes", icon: "map" },
        { label: "Inventory", icon: "package" },
        { label: "Alerts", icon: "bell" },
      ],
    },
    {
      type: "journey",
      eyebrow: "The shipment lifecycle",
      title: ["From booking", "to delivery."],
      stages: [
        { title: "Booked", status: "STATUS · BOOKED", icon: "clipboard", tone: "info" },
        { title: "Picked", status: "STATUS · PICKED", icon: "package" },
        { title: "In Transit", icon: "truck", tone: "info", badges: ["AIR", "SEA", "ROAD"] },
        { title: "Delivered", status: "PROOF CAPTURED", icon: "check" },
      ],
    },
    {
      type: "flow",
      eyebrow: "Billing, automated",
      title: ["Invoices.", "Payments.", "Payouts."],
      doc: {
        kicker: "INVOICE",
        id: "#NW-1042",
        items: ["$1,200.00", "$640.00", "$380.00"],
        totalLabel: "Total due",
        total: 2220,
        prefix: "$",
        states: [
          { label: "OPEN", tone: "danger" },
          { label: "PAID", tone: "primary" },
        ],
        stamp: "PAID",
        methods: [
          { icon: "card", label: "Card" },
          { icon: "bank", label: "Bank" },
        ],
      },
      flowLabel: "Payouts split automatically",
      destinations: [
        { label: "Carrier", sub: "Carrier payout", amount: 1700, badge: "SENT" },
        { label: "Platform", sub: "Service fee", amount: 520, badge: "SENT", tone: "violet" },
      ],
    },
    {
      type: "orbit",
      eyebrow: "Everyone connected",
      nodes: [
        { label: "Dispatchers", icon: "users" },
        { label: "Drivers", icon: "truck" },
        { label: "Customers", icon: "user" },
        { label: "Finance", icon: "coins" },
        { label: "Warehouses", icon: "building" },
      ],
      caption: ["5 roles.", "One source of truth."],
      sub: "Everyone sees exactly what they need.",
    },
    {
      type: "stats",
      eyebrow: "Under the hood",
      title: ["Built to", "scale."],
      stats: [
        { value: 120, label: "API endpoints" },
        { value: 480, label: "Automated tests", suffix: "+" },
        { value: 12, label: "Integrations" },
      ],
      tags: ["TypeScript", "React", "PostgreSQL", "Docker"],
    },
    {
      type: "trust",
      eyebrow: "Built on trust",
      title: ["Secure at", "every step."],
      features: [
        { icon: "lock", title: "Encrypted data", sub: "In transit and at rest" },
        { icon: "history", title: "Audit trail", sub: "Every change recorded" },
        { icon: "shield", title: "Role-based access", sub: "Least privilege by default" },
      ],
    },
    { type: "outro" },
  ],
};
