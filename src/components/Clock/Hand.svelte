<script lang="ts">
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";

  import { password, activeRegionNames } from "../../stores";

  import type { RegionType } from "../../types/region.type";
  import { getFrequencyForRegion, frequencyMs } from "./utils";

  import Eta from "./Eta.svelte";

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
  let activeRegionAngle = spring(0, { stiffness: 0.05, damping: 0.2 });

  $: activeRegion = regions.find((region) => region.name === activeRegionName);
  $: lostRegion = regions.find((region) => region.name === "Lost");
  $: activeRegionAngle.set(activeRegion?.angleDeg ?? lostRegion?.angleDeg);

  // Okay now let's do the API thing
  let currentFrequency = "LOW";
  let timeout: number;
  let currentDocumentId: string;
  let requestsWithSameDocumentId = 0;

  let etaLatitude: number;
  let etaLongitude: number;

  onMount(() => {
    const getLocationForTrackerId = async () => {
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
        const document = parsedResponse?.data?.[0];
        const responseDocumentId = document?.["ref"]?.["@ref"]?.["id"];
        if (responseDocumentId !== currentDocumentId) {
          // Hey look a fresh document!
          // Let's do something with it.
          currentDocumentId = responseDocumentId;
          requestsWithSameDocumentId = 0;
          // Is there any data in the document?
          const data = document?.data;
          if (typeof data === "undefined") {
            // Huh. Nothing in this data.
            activeRegionNames.updateRegionForTrackerId(trackerId, "Lost");
          } else {
            // Yay there's data in the document!
            // Now what?
            // First, we check to see if owntracks has labeled the data with a region.
            const region = data.inregions?.[0];
            if (typeof region !== "undefined") {
              // if so, simple! We just point the hand at that region
              activeRegionNames.updateRegionForTrackerId(trackerId, region);
            } else {
              // otherwise, we assume we're in transit...
              activeRegionNames.updateRegionForTrackerId(
                trackerId,
                "In Transit"
              );
              // And we set a new latitude and longitude to calculate ETA!
              etaLatitude = data.lat;
              etaLongitude = data.lon;
            }
          }
        } else {
          // If this number gets too high,
          // we reduce update frequency
          requestsWithSameDocumentId += 1;
        }
      } catch (error) {
        console.error(error);
        if (error.status === 403) {
          $password = undefined;
          return;
        }
        activeRegionNames.updateRegionForTrackerId(trackerId, "Lost");
      }
      // Now that we got the data and set the data,
      // let's schedule our next data fetch!
      currentFrequency = getFrequencyForRegion(
        activeRegionName,
        $activeRegionNames,
        requestsWithSameDocumentId
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
    alignment-baseline="central">
    {trackerId}
  </text>
  {#if activeRegionName === "In Transit"}
    <Eta
      latitude={etaLatitude}
      longitude={etaLongitude}
      {offset}
      {viewBox}
      {trackerId}
    />
  {/if}
</g>

<style>
  text {
    font-weight: 400;
    font-size: 24px;
  }
</style>
