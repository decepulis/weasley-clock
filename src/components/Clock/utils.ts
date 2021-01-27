import type { EtaType } from "../../types/eta.type";

const lowFreqRegions = ["Home", "Holidays", "Lost"];
const medFreqRegions = ["Work", "Gym", "Barn"];
const hiFreqRegions = ["In Transit"];

export const frequencyMs = {
  LOW: 10 * 60 * 1000,
  MED: 5 * 60 * 1000,
  HI: 2 * 60 * 1000,
};

export const getFrequencyForRegion = (
  region: string,
  activeRegionNames: Object,
  requestsWithSameLocation: number
): string => {
  const allTrackersAway = Object.values(activeRegionNames).every(
    (region) => region !== "Home"
  );

  if (lowFreqRegions.includes(region) || allTrackersAway) {
    return "LOW";
  } else if (medFreqRegions.includes(region) || requestsWithSameLocation >= 3) {
    return "MED";
  } else if (hiFreqRegions.includes(region)) {
    return "HI";
  } else {
    return "LOW";
  }
};

export const getEtaForCoordinates = async (
  latitude: number,
  longitude: number,
  password: string
): Promise<EtaType> => {
  const response = await fetch(
    `/.netlify/functions/eta?lat=${latitude}&lng=${longitude}`,
    {
      headers: new Headers({
        Authorization: `Basic ${btoa(`user:${password}`)}`,
      }),
    }
  );
  if (!response.ok) {
    throw response;
  }
  const parsedResponse = await response.json();
  return parsedResponse.routes?.[0]?.legs?.[0]?.duration;
};

export const getSecondsElapsedSince = (since: Date): number => {
  const now = new Date();
  const msElapsed = now.getTime() - since.getTime();
  return msElapsed / 1000;
};

export const formatSeconds = (seconds: number): string => {
  const date = new Date(0);
  date.setSeconds(seconds);

  const timeString = date.toISOString(); // yyyy-mm-ddThh:mm:ss...

  if (seconds >= 3600) {
    // hh:mm:ss
    return timeString.substr(11, 8);
  } else if (seconds >= 60) {
    // mm:ss
    return timeString.substr(14, 5);
  } else {
    // ss
    return timeString.substr(17, 2);
  }
};
