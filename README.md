# Verkehrstote Dashboard

A modern, responsive dashboard built with Next.js, TypeScript, SCSS, and Chart.js (via react-chartjs-2) that visualizes traffic fatality data in Austria. The dashboard dynamically switches between a multi-year line chart and a single-year bar chart based on user-selected filters.

## Overview

This dashboard presents traffic fatality data sourced from an external REST API (hidden behind an internal API route). Users can filter the data by Bundesland (region) and Jahr (year). When multiple years are available, a line chart displays trends over time. When a single year is selected, a bar chart shows side-by-side columns representing the total fatalities per region with their respective counts.

## Features

- **Dynamic Data Visualization:**
  - **Line Chart:** Shows the evolution of traffic fatalities across multiple years.
  - **Bar Chart:** Displays a breakdown by Bundesland for a selected year, with each region's fatality count.
- **Responsive Design:**
  - Built with SCSS modules and media queries for optimal display on mobile, tablet, desktop, and larger screens.
- **Consistent Branding:**
  - Each Bundesland is assigned a fixed color for consistency.
- **Secure Data Access:**
  - An internal API route acts as a proxy to hide the external API endpoint from end users.

## Technologies Used

- **Next.js 13 (App Router)**
- **TypeScript**
- **SCSS Modules**
- **Chart.js** & **react-chartjs-2**
- **pnpm** (for package management)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/verkehrstote-dashboard.git
   cd verkehrstote-dashboard
   ```

### Install Dependencies:

pnpm install

### Run the Development Server:

- pnpm dev

- Open your browser at http://localhost:3000 to view the dashboard.

## Usage

### Filtering Data:

- Use the dropdown menus at the top to filter by Bundesland and/or Jahr.
- Multi-Year View: With no specific year selected, a line chart displays trends over the years.
- Single-Year View: When a single year is selected, a bar chart displays each Bundesland’s total fatality count as individual columns.

## Responsive Layout:

The design automatically adjusts to different screen sizes—from mobile to large desktop displays—using SCSS media queries.

## Screenshots

### Home Page (Multi-Year Line Chart)

### Single-Year View (Bar Chart)
