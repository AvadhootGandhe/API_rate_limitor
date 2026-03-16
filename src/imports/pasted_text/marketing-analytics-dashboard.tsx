Create a **professional SaaS-style frontend web application using React** for a **Marketing Analytics Platform**.

Important:
This project should include **frontend only**.
Assume that data will be retrieved from **external REST APIs**, but **do not implement any backend**.

Tech Stack:

* React (Vite)
* TailwindCSS
* React Router
* Axios for API requests
* Recharts for analytics charts
* Lucide React icons

Design Style:

* Modern SaaS dashboard design
* Clean UI similar to Stripe, Hubspot, or Notion
* Minimalistic and professional
* Soft neutral color palette
* Avoid yellow colors
* Smooth hover effects and transitions
* Card-based layouts
* Fully responsive

Application Layout:

Sidebar Navigation

* Dashboard
* Campaigns
* Clients
* Ad Performance
* Lead Funnel
* Tasks

Top Navigation Bar

* Search bar
* Notifications icon
* User profile avatar

Pages to Build:

1. Dashboard
   Show high-level analytics metrics in cards:

* Total Clients
* Active Campaigns
* Total Leads
* Conversion Rate
* Total Revenue

Charts:

* Leads over time (Line Chart)
* Revenue by campaign (Bar Chart)
* Channel performance (Pie Chart)
* Conversion funnel visualization

2. Campaign Management Page

Data table displaying:

* Campaign Name
* Client
* Campaign Status
* Budget
* Leads Generated
* Conversions
* ROI

Features:

* Search campaigns
* Status filters
* Pagination
* Status badges (Active / Paused / Completed)

3. Client Insights Page

Display client analytics:

Client Information Card:

* Company Name
* Industry
* Total Campaigns
* Total Revenue Generated

Charts:

* Campaign performance over time
* Channel distribution

4. Ad Performance Page

Analytics for advertisements:

Metrics:

* Impressions
* Clicks
* CTR
* CPC
* Conversions

Charts:

* CTR trend
* CPC trend
* Conversions per campaign

5. Lead Funnel Page

Visual funnel stages:

Lead → Qualified → Opportunity → Converted

Display:

* Stage counts
* Funnel visualization chart

6. Employee Tasks Page

Task management board:

Columns:

* Pending
* In Progress
* Completed

Tasks show:

* Task name
* Assigned employee
* Campaign
* Deadline

API Integration:

Use Axios to fetch data from endpoints such as:

GET /api/dashboard
GET /api/campaigns
GET /api/clients
GET /api/ads
GET /api/leads
GET /api/tasks
GET /api/performance

Include:

* Loading states
* Error handling
* Mock data fallback if API unavailable

Component Requirements:

Reusable components:

* Sidebar
* Navbar
* Metric cards
* Data tables
* Chart components
* Filters
* Status badges
* Modal dialogs

Folder Structure:

src/
components/
pages/
charts/
services/
hooks/
layout/
utils/

Code Quality:

* Use React hooks
* Create reusable UI components
* Use a clean folder structure
* Separate API service logic
* Maintain scalable architecture

Goal:

The final UI should look like a **real marketing analytics SaaS platform used by marketing agencies to monitor campaign performance and business growth.**
