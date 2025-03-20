# Verkehrstote Dashboard

A modern, responsive dashboard built with Next.js, TypeScript, SCSS, and Chart.js (via react-chartjs-2) that visualizes traffic fatality data in Austria. The dashboard dynamically switches between a multi-year line chart and a single-year bar chart based on user-selected filters.

## Overview

This dashboard presents traffic fatality data sourced from an external REST API (hidden behind an internal API route). When multiple years are available, a line chart displays trends over time. When a single year is selected, a bar chart shows side-by-side columns representing the total fatalities per region with their respective counts. The dashboard lets users filter by:

- **Bundesland** (Region)
- **Jahr** (Year)
- **Geschlecht** (Gender)
- **Gebiet** (Area)
- **Altergruppe** (Age Group)

Additionally, when a single year is selected, a **"Statistik nach:"** dropdown lets the user choose how to group the data (e.g. by Bundesland, Jahr, Monat, Geschlecht, Gebiet, or Alter). If no Bundesland is chosen for a given year, the system automatically groups by Bundesland so that each bar represents one region.

## Features

- **Dynamic Data Visualization:**
  - **Multi-Year Line Chart:** Shows trends over multiple years grouped by Bundesland.
  - **Single-Year Bar Chart:** When a specific year is selected, displays a bar chart grouped by the chosen dimension. If no Bundesland is selected, the dashboard defaults to grouping by Bundesland.
- **Advanced Filtering:**  
  Users can filter data by Bundesland, Jahr, Geschlecht, Gebiet, and Altergruppe.
- **Custom Grouping Options:**  
  An extra “Statistik nach:” dropdown allows grouping of the single-year data by Monat, Geschlecht, Gebiet, Alter, Bundesland, or Jahr.
- **Data Transformation:**  
  An internal API route converts raw API values into human‑readable formats:
  - Bundesland, Gebiet mappings.
  - `AlterGr_ID` is mapped as follows: IDs 1–16 map to age ranges (e.g. "0-4", "5-9", …, "70-74", with ID 16 being "75+"), ID 17 becomes “nicht geboren”, and ID 18 becomes “unbekannt.”
- **Consistent and Randomized Colors:**  
  The dashboard uses a fixed color map for line charts and a separate utility for generating random blue shades for bar charts.
- **Responsive Design:**  
  Uses SCSS Modules with media queries to ensure the layout adapts to mobile, tablet, desktop, and larger screens.


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

- Use the dropdown menus at the top to filter by Bundesland, Jahr, Geschlecht, Gebiet and/or Altergruppe.
- Multi-Year View: With no specific year selected, a line chart displays trends over the years.
- Single-Year View: When a single year is selected, a bar chart displays each Bundesland’s total fatality count as individual columns.
- Statistik nach: (Displayed only in single-year mode) Choose the dimension for grouping the bar chart (e.g., by Bundesland, Monat, Geschlecht, Gebiet, Alter, or Jahr).

### Chart Display:
- With no year selected, a multi‑year line chart shows trends by Bundesland.
- With a year selected and no Bundesland chosen, the system groups by Bundesland (one bar per region) showing total fatalities for that year.
- If both a year and a specific Bundesland are chosen, you can change the grouping dimension to view the data in different ways (e.g., by month).

## Responsive Layout:

The design automatically adjusts to different screen sizes—from mobile to large desktop displays—using SCSS media queries.

## Screenshots

### Home Page (Multi-Year Line Chart)
![Screenshot 2025-03-20 at 16 12 53](https://github.com/user-attachments/assets/dc3456a4-1f80-4872-91aa-d20d31d52207)

### Bundesland (Multi-Year Line Chart)
![Screenshot 2025-03-20 at 16 13 21](https://github.com/user-attachments/assets/e1299092-a7ee-4e68-b79f-50ae042e8317)


### Single-Year View (Bar Chart for all Bundesland)
![Screenshot 2025-03-20 at 17 34 46](https://github.com/user-attachments/assets/302fde8e-2954-456c-be41-66f4ed23130c)


### Single-Year View (Bar Chart for only one Bundesland)
![Screenshot 2025-03-20 at 17 36 26](https://github.com/user-attachments/assets/d9431661-a846-4dfd-bb5b-279f71da42bc)

### Monthly-View for given Year (Bar Chart  for only one Bundesland )
![Screenshot 2025-03-20 at 17 36 59](https://github.com/user-attachments/assets/1ea0315c-1840-49e0-8584-fe6ec2b325d2)

Contact

For questions or feedback, please contact:

Mercedesz Alexandra Feher
[GitHub Profile](https://github.com/mercedeszafeher)
[LinkedIn Profile](www.linkedin.com/in/mercedesz-a-feher)

