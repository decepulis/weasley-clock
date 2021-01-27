<script lang="ts">
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";

  import { password, activeRegionNames } from "../../stores";

  import type { RegionType } from "../../types/region.type";
  import { getFrequencyForRegion, frequencyMs } from "./utils";

  import Eta from "./Eta.svelte";
  import Chime from "./Chime.svelte";

  export let trackerId: string;
  export let regions: RegionType[];
  export let viewBox: number;
  export let offset: number;

  // Aight let's calculate some layout stuff
  const center = viewBox / 2;
  const labelRadius = 24;

  const headLength = 0.66 * center;
  const tailLength = labelRadius;
  const offsetLength = labelRadius + offset * 2 * labelRadius;

  const endOfHead = center + offsetLength / 2 - headLength;
  const endOfTail = center + offsetLength + tailLength;

  $: activeRegionName = $activeRegionNames[trackerId];
  // TODO: chime when active region changes
  let activeRegionAngle = spring(0, { stiffness: 0.05, damping: 0.2 });

  $: activeRegion = regions.find((region) => region.name === activeRegionName);
  $: lostRegion = regions.find((region) => region.name === "Lost");
  $: activeRegionAngle.set(activeRegion?.angleDeg ?? lostRegion?.angleDeg);

  // Okay now let's do the API thing
  let timeout: number;
  let currentResponseString: string;
  let requestsWithSameResponse = 0;

  let etaLatitude: number;
  let etaLongitude: number;

  onMount(() => {
    const getLocationForTrackerId = async () => {
      let newActiveRegion: string;
      try {
        const response = await fetch(
          `/.netlify/functions/location?tid=${trackerId}`,
          {
            headers: new Headers({
              Authorization: `Basic ${btoa(`user:${$password}`)}`,
            }),
          }
        );
        if (!response.ok) {
          throw response;
        }
        const parsedResponse = await response.json();
        // Yay we have data!
        // Here's what we're going to do with it.
        // First, we determine if the location is new.
        const newResponseString = JSON.stringify(parsedResponse);
        if (newResponseString !== currentResponseString) {
          // Hey look fresh data!
          // Let's do something with it.
          currentResponseString = newResponseString;
          requestsWithSameResponse = 0;
          // Now what?
          // First, we check to see if owntracks has labeled the data with a region.
          let region = parsedResponse.inregions;
          if (Array.isArray(region)) {
            region = region[0];
          }
          if (typeof region !== "undefined") {
            // if so, simple! We just point the hand at that region
            newActiveRegion = region;
          } else {
            // otherwise, we assume we're in transit...
            newActiveRegion = "In Transit";
            // And we set a new latitude and longitude to calculate ETA!
            etaLatitude = parsedResponse.lat;
            etaLongitude = parsedResponse.lon;
          }
        } else {
          // If this number gets too high,
          // we reduce update frequency
          requestsWithSameResponse += 1;
        }
      } catch (error) {
        console.error(error);
        if (error.status === 403) {
          $password = undefined;
          return;
        }
        activeRegionNames.updateRegionForTrackerId(trackerId, "Lost");
      }
      if (typeof newActiveRegion !== "undefined") {
        activeRegionNames.updateRegionForTrackerId(trackerId, newActiveRegion);
      }
      // Now that we got the data and set the data,
      // let's schedule our next data fetch!
      const currentFrequency = getFrequencyForRegion(
        newActiveRegion ?? activeRegionName,
        $activeRegionNames,
        requestsWithSameResponse
      );
      timeout = setTimeout(
        () => getLocationForTrackerId(),
        frequencyMs[currentFrequency]
      );
    };

    getLocationForTrackerId();
    return () => clearTimeout(timeout);
  });
</script>

<g transform={`rotate(${$activeRegionAngle}, ${center}, ${center})`}>
  <line
    x1={center}
    y1={endOfTail}
    x2={center}
    y2={endOfHead}
    stroke="currentColor"
    stroke-width={8}
    stroke-linecap="round"
  />
  <circle fill="currentColor" r={labelRadius} cx={center} cy={endOfTail} />
  <text
    fill="black"
    x={center}
    y={endOfTail}
    text-anchor="middle"
    alignment-baseline="central"
  >
    {trackerId}
  </text>
  {#if activeRegionName === "In Transit" && requestsWithSameResponse <= 3}
    <Eta
      latitude={etaLatitude}
      longitude={etaLongitude}
      {offset}
      {viewBox}
      {trackerId}
    />
  {/if}
  <Chime {activeRegionName} />
</g>

<style>
  text {
    font-weight: 400;
    font-size: 24px;
  }
</style>
