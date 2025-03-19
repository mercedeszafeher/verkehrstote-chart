'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import styles from '../styles/Home.module.scss';
import { TrafficData } from './api/traffic/route';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const API_URL = '/api/traffic';

const colorMap: Record<string, string> = {
  Burgenland: '#f94144',
  Kärnten: '#f3722c',
  Niederösterreich: '#f8961e',
  Oberösterreich: '#f9844a',
  Salzburg: '#f9c74f',
  Steiermark: '#90be6d',
  Tirol: '#43aa8b',
  Vorarlberg: '#4d908e',
  Wien: '#577590',
};

function getRegionColor(region: string): string {
  return colorMap[region] || '#999999';
}

export default function HomePage() {
  const [rawData, setRawData] = useState<TrafficData[]>([]);
  const [bundeslandFilter, setBundeslandFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [allYears, setAllYears] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        const dataArray: TrafficData[] = Array.isArray(json) ? json : [];
        setRawData(dataArray);

        const years = Array.from(new Set(dataArray.map((d) => d.Jahr))).sort(
          (a, b) => a - b,
        );
        setAllYears(years);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const filteredData = rawData.filter((item) => {
    if (bundeslandFilter && item.Bundesland !== bundeslandFilter) return false;
    if (yearFilter && item.Jahr !== parseInt(yearFilter, 10)) return false;
    return true;
  });

  const isBarChart = Boolean(yearFilter);

  function getBarChartData(): ChartData<'bar', number[], unknown> {
    const regions = Array.from(new Set(filteredData.map((d) => d.Bundesland)));
    const labels: string[] = regions;
    const dataPoints: number[] = regions.map((region) =>
      filteredData.reduce(
        (sum, item) => (item.Bundesland === region ? sum + item.Getotete : sum),
        0,
      ),
    );
    const backgroundColors = regions.map((region) => getRegionColor(region));
    return {
      labels,
      datasets: [
        {
          label: `Verkehrstote im Jahr ${yearFilter}`,
          data: dataPoints,
          backgroundColor: backgroundColors,
        },
      ],
    };
  }

  function getLineChartData(): ChartData<'line', number[], unknown> {
    const years = Array.from(new Set(filteredData.map((d) => d.Jahr))).sort(
      (a, b) => a - b,
    );
    const regions = Array.from(new Set(filteredData.map((d) => d.Bundesland)));
    const datasets = regions.map((region) => {
      const dataPoints = years.map((year) =>
        filteredData.reduce(
          (sum, item) =>
            item.Bundesland === region && item.Jahr === year
              ? sum + item.Getotete
              : sum,
          0,
        ),
      );
      return {
        label: region,
        data: dataPoints,
        borderColor: getRegionColor(region),
        backgroundColor: getRegionColor(region),
        borderWidth: 2,
        fill: false,
      };
    });
    return {
      labels: years,
      datasets,
    };
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Verkehrstote pro Jahr und Bundesland',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Anzahl Getötete' },
      },
      x: {
        title: { display: true, text: 'Jahr' },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Verkehrstote im Jahr ${yearFilter}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Anzahl Getötete' },
      },
      x: {
        title: { display: true, text: 'Bundesland' },
      },
    },
  };

  return (
    <main className={styles.container}>
      <h1>Verkehrstote in Österreich</h1>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Bundesland:</label>
          <select
            value={bundeslandFilter}
            onChange={(e) => setBundeslandFilter(e.target.value)}
          >
            <option value="">Alle</option>
            <option value="Burgenland">Burgenland</option>
            <option value="Kärnten">Kärnten</option>
            <option value="Niederösterreich">Niederösterreich</option>
            <option value="Oberösterreich">Oberösterreich</option>
            <option value="Salzburg">Salzburg</option>
            <option value="Steiermark">Steiermark</option>
            <option value="Tirol">Tirol</option>
            <option value="Vorarlberg">Vorarlberg</option>
            <option value="Wien">Wien</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Jahr:</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">Alle</option>
            {allYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.chartContainer}>
        {isBarChart ? (
          <Bar data={getBarChartData()} options={barOptions} />
        ) : (
          <Line data={getLineChartData()} options={lineOptions} />
        )}
      </div>
    </main>
  );
}
