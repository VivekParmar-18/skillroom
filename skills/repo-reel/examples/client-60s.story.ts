// Example: 60-second CLIENT / PRODUCT cut for a fictional logistics SaaS.
// Use: cp examples/client-60s.story.ts <promoDir>/src/story.ts
// Every value here is invented — in a real run each label is sourced from the target repo.
import type { Story } from "./types";

export const STORY: Story = {
  brand: {
    name: "Northwind",
    tagline: "Operations software for modern logistics teams",
    url: "northwind.example",
    palette: { primary: "#3B82F6", gradient: ["#60A5FA", "#22D3EE"] },
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
      title: ["From booking", "to doorstep."],
      stages: [
        { title: "Booked", status: "SHIPMENT · BOOKED", icon: "clipboard", tone: "info" },
        { title: "Picked", status: "SHIPMENT · PICKED", icon: "package" },
        { title: "Packed", status: "SHIPMENT · PACKED", icon: "layers", tone: "warn" },
        { title: "In Transit", icon: "truck", tone: "info", badges: ["AIR", "SEA", "ROAD"] },
        { title: "Delivered", status: "PROOF CAPTURED", icon: "check", tone: "primary" },
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
          { label: "PARTIAL", tone: "warn" },
          { label: "PAID", tone: "primary" },
        ],
        stamp: "PAID",
        methods: [
          { icon: "card", label: "Card" },
          { icon: "bank", label: "Bank transfer" },
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
        { label: "Carriers", icon: "globe" },
      ],
      caption: ["6 roles.", "One source of truth."],
      sub: "Everyone sees exactly what they need.",
    },
    {
      type: "dashboard",
      eyebrow: "Real-time visibility",
      title: ["See everything.", "As it happens."],
      kpis: [
        { label: "Shipments", value: 1284 },
        { label: "On time", value: 97, suffix: "%" },
        { label: "Invoices paid", value: 3410 },
        { label: "Active routes", value: 318 },
      ],
      barsTitle: "Shipments by week",
      lineTitle: "On-time trend",
      toasts: [
        { icon: "truck", title: "Shipment departed", sub: "Live tracking started" },
        { icon: "check", title: "Delivered", sub: "Proof of delivery captured" },
        { icon: "receipt", title: "Invoice paid", sub: "Card payment received" },
        { icon: "bell", title: "Reminder sent", sub: "Automated follow-up" },
      ],
      scanCard: { title: "Route optimizer", done: "OPTIMIZED" },
    },
    {
      type: "trust",
      eyebrow: "Built on trust",
      title: ["Secure at", "every step."],
      code: { label: "Two-factor sign-in", meta: "EMAIL · SMS", digits: "482917" },
      features: [
        { icon: "lock", title: "Encrypted data", sub: "In transit and at rest" },
        { icon: "history", title: "Full audit trail", sub: "Every change recorded" },
        { icon: "shield", title: "Role-based access", sub: "Least privilege by default" },
      ],
    },
    {
      type: "showcase",
      title: ["One platform.", "Everywhere."],
      cards: [
        { wordmark: "Web", tagline: "The full control tower for dispatch and finance", url: "app.northwind.example" },
        { wordmark: "Mobile", tagline: "Driver app with scans, photos and signatures", tone: "info" },
        { wordmark: "API", tagline: "Plug shipments into any ERP or storefront", url: "docs.northwind.example", tone: "violet" },
      ],
      sub: "Same data, every surface.",
    },
    { type: "outro" },
  ],
};
