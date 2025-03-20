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
  Jahr: number;
  Monat: number;
  Geschlecht: string;
  Bundesland: string;
  Gebiet: string;
  AlterGr: string;
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

const gebietMapping: Record<string, string> = {
  '0': 'Freiland',
  '1': 'Autobahn',
  '2': 'Autobahn',
};

const alterGroupMapping: Record<string, string> = {
  '1': '0-4',
  '2': '5-9',
  '3': '10-14',
  '4': '15-19',
  '5': '20-24',
  '6': '25-29',
  '7': '30-34',
  '8': '35-39',
  '9': '40-44',
  '10': '45-49',
  '11': '50-54',
  '12': '55-59',
  '13': '60-64',
  '14': '65-69',
  '15': '70-74',
  '16': '75+',
  '17': 'nicht geboren',
  '18': 'unbekannt',
};

function mapGeschlecht(id: string): string {
  return id === '1' ? 'Männlich' : id === '2' ? 'Weiblich' : 'Unbekannt';
}

function mapAlterGroup(id: string): string {
  return alterGroupMapping[id] || 'Unbekannt';
}

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
      Jahr: parseInt(item.Berichtsjahr, 10),
      Monat: parseInt(item.Monat_ID, 10),
      Geschlecht: mapGeschlecht(item.Geschlecht_ID),
      Bundesland: bundeslandMapping[item.Bundesland_ID] || item.Bundesland_ID,
      Gebiet: gebietMapping[item.Gebiet_ID] || item.Gebiet_ID,
      AlterGr: mapAlterGroup(item.AlterGr_ID),
      Getotete: parseInt(item.Getötete, 10),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    return NextResponse.error();
  }
}
