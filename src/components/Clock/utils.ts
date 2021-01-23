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
