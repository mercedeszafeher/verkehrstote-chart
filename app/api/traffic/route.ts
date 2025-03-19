import { NextResponse } from 'next/server';

interface RawTrafficData {
  Berichtsjahr: string;
  Monat_ID: string;
  Stunde_ID: string;
  Wochentag_ID: string;
  Bundesland_ID: string;
  Gebiet_ID: string;
  Verkehrsart_ID: string;
  AlterGr_ID: string;
  Geschlecht_ID: string;
  Ursache_ID: string;
  Getötete: string;
}

export interface TrafficData {
  Bundesland: string;
  Jahr: number;
  Getotete: number;
}

const bundeslandMapping: { [key: string]: string } = {
  '1': 'Burgenland',
  '2': 'Kärnten',
  '3': 'Niederösterreich',
  '4': 'Oberösterreich',
  '5': 'Salzburg',
  '6': 'Steiermark',
  '7': 'Tirol',
  '8': 'Vorarlberg',
  '9': 'Wien',
};

export async function GET() {
  const API_URL = 'https://dashboards.kfv.at/api/udm_verkehrstote/json';

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    let rawArray: RawTrafficData[] = [];
    if (data && typeof data === 'object' && Array.isArray(data.verkehrstote)) {
      rawArray = data.verkehrstote;
    }

    const result: TrafficData[] = rawArray.map((item) => ({
      Bundesland: bundeslandMapping[item.Bundesland_ID] || item.Bundesland_ID,
      Jahr: parseInt(item.Berichtsjahr, 10),
      Getotete: parseInt(item.Getötete, 10),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    return NextResponse.error();
  }
}
