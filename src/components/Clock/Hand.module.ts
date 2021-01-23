const lowFreqRegions = ['Home', "Holidays", "Lost"]
const medFreqRegions = ['Work', 'Gym', 'Barn']
const hiFreqRegions = ['In Transit']

export const frequencyMs = {
    LOW: 10 * 60 * 1000,
    MED: 5 * 60 * 1000,
    HI: 2 * 60 * 1000,
  };

export const getFrequencyForRegion = (region: string, activeRegionNames: Object, requestsWithSameLocation: number): string => {
    const allTrackersAway = Object.values(activeRegionNames).every(region => region !== 'Home')

    if (lowFreqRegions.includes(region) || allTrackersAway) {
        return "LOW"
    } else if (medFreqRegions.includes(region) || requestsWithSameLocation >= 3) {
        return "MED"
    } else if (hiFreqRegions.includes(region)) {
        return "HI"
    } else {
        return "LOW"
    }
}