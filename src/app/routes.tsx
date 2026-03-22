import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./layout/Layout";
import { UnifiedDashboard } from "./pages/UnifiedDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: UnifiedDashboard },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
