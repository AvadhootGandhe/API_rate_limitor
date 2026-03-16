import { createBrowserRouter } from "react-router";
import { Layout } from "./layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Campaigns } from "./pages/Campaigns";
import { Clients } from "./pages/Clients";
import { AdPerformance } from "./pages/AdPerformance";
import { LeadFunnel } from "./pages/LeadFunnel";
import { Tasks } from "./pages/Tasks";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "campaigns", Component: Campaigns },
      { path: "clients", Component: Clients },
      { path: "ad-performance", Component: AdPerformance },
      { path: "lead-funnel", Component: LeadFunnel },
      { path: "tasks", Component: Tasks },
    ],
  },
]);
