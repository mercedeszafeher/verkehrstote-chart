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
import { getRandomBlueShade } from '../src/utils/colors';
import styles from '../styles/Home.module.scss';
import { TrafficData } from './api/traffic/route';

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

const displayDimensions = [
  'Bundesland',
  'Jahr',
  'Monat',
  'Geschlecht',
  'Gebiet',
  'Alter',
];

export default function HomePage() {
  const [rawData, setRawData] = useState<TrafficData[]>([]);
  const [bundeslandFilter, setBundeslandFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [allYears, setAllYears] = useState<number[]>([]);
  const [geschlechtFilter, setGeschlechtFilter] = useState<string>('');
  const [gebietFilter, setGebietFilter] = useState<string>('');
  const [alterGrFilter, setAlterGrFilter] = useState<string>('');
  const [displayDimension, setDisplayDimension] =
    useState<string>('Bundesland');

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
    if (geschlechtFilter && item.Geschlecht !== geschlechtFilter) return false;
    if (gebietFilter && item.Gebiet !== gebietFilter) return false;
    if (alterGrFilter && item.AlterGr !== alterGrFilter) return false;
    return true;
  });

  const isBarChart = Boolean(yearFilter);

  let finalDimension = displayDimension;
  if (yearFilter && !bundeslandFilter) {
    finalDimension = 'Bundesland';
  }

  function getGroupValue(
    item: TrafficData,
    dimension: string,
  ): string | number {
    switch (dimension) {
      case 'Bundesland':
        return item.Bundesland;
      case 'Jahr':
        return item.Jahr;
      case 'Monat':
        return item.Monat;
      case 'Geschlecht':
        return item.Geschlecht;
      case 'Gebiet':
        return item.Gebiet;
      case 'Alter':
        return item.AlterGr;
      default:
        return '';
    }
  }

  function getBarChartDataByDimension(): ChartData<'bar', number[], unknown> {
    let groups = Array.from(
      new Set(filteredData.map((item) => getGroupValue(item, finalDimension))),
    );

    if (finalDimension === 'Monat' || finalDimension === 'Jahr') {
      groups = groups.sort((a, b) => (a as number) - (b as number));
    } else {
      groups = groups.sort();
    }

    const labels =
      finalDimension === 'Monat' || finalDimension === 'Jahr'
        ? groups.map((m) => {
            if (finalDimension === 'Monat') {
              const date = new Date(0, Number(m) - 1);
              return date.toLocaleString('de-DE', { month: 'short' });
            }
            return String(m);
          })
        : (groups as string[]);

    const dataPoints = groups.map((grp) =>
      filteredData.reduce((sum, item) => {
        return getGroupValue(item, displayDimension) === grp
          ? sum + item.Getotete
          : sum;
      }, 0),
    );

    const backgroundColors = groups.map(() => getRandomBlueShade());

    return {
      labels,
      datasets: [
        {
          label: `Verkehrstote im Jahr ${yearFilter} (nach ${displayDimension})`,
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

  const barChartData: ChartData<'bar', number[], unknown> =
    getBarChartDataByDimension();
  const lineChartData: ChartData<'line', number[], unknown> =
    getLineChartData();

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
        text: `Verkehrstote im Jahr ${yearFilter} nach ${displayDimension}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Anzahl Getötete' },
      },
      x: {
        title: { display: true, text: displayDimension },
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
        <div className={styles.filterGroup}>
          <label>Geschlecht:</label>
          <select
            value={geschlechtFilter}
            onChange={(e) => setGeschlechtFilter(e.target.value)}
          >
            <option value="">Alle</option>
            <option value="Männlich">Männlich</option>
            <option value="Weiblich">Weiblich</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Gebiet:</label>
          <select
            value={gebietFilter}
            onChange={(e) => setGebietFilter(e.target.value)}
          >
            <option value="">Alle</option>
            <option value="Freiland">Freiland</option>
            <option value="Autobahn">Autobahn</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Altergruppe:</label>
          <select
            value={alterGrFilter}
            onChange={(e) => setAlterGrFilter(e.target.value)}
          >
            <option value="">Alle</option>
            <option value="0-4">0-4</option>
            <option value="5-9">5-9</option>
            <option value="10-14">10-14</option>
            <option value="15-19">15-19</option>
            <option value="20-24">20-24</option>
            <option value="25-29">25-29</option>
            <option value="30-34">30-34</option>
            <option value="35-39">35-39</option>
            <option value="40-44">40-44</option>
            <option value="45-49">45-49</option>
            <option value="50-54">50-54</option>
            <option value="55-59">55-59</option>
            <option value="60-64">60-64</option>
            <option value="65-69">65-69</option>
            <option value="70-74">70-74</option>
            <option value="75+">75+</option>
            <option value="nicht geboren">nicht geboren</option>
            <option value="unbekannt">unbekannt</option>
          </select>
        </div>
        {isBarChart && (
          <div className={styles.filterGroup}>
            <label>Statistik nach:</label>
            <select
              value={displayDimension}
              onChange={(e) => setDisplayDimension(e.target.value)}
            >
              {displayDimensions.map((dim) => (
                <option key={dim} value={dim}>
                  {dim}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className={styles.chartContainer}>
        {isBarChart ? (
          <Bar data={barChartData} options={barOptions} />
        ) : (
          <Line data={lineChartData} options={lineOptions} />
        )}
      </div>
    </main>
  );
}
