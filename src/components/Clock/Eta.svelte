<script lang="ts">
  import { fly } from "svelte/transition";
  import { password } from "../../stores";

  import CirclePath from "../CirclePath.svelte";
  import { getEtaForCoordinates } from "./utils";

  import type { EtaType } from "../../types/eta.type";

  export let latitude: number;
  export let longitude: number;
  export let offset: number;
  export let viewBox: number;
  export let trackerId: string;

  $: radius = viewBox / 2;
  const innerRadiusScale = 0.72;

  const idToName = {
    kc: "Kristin",
    dc: "Darius",
  };
  $: name = idToName[trackerId];
  let eta: EtaType = { text: "..." };
  $: {
    try {
      getEtaForCoordinates(latitude, longitude, $password).then((response) => {
        // TODO: if value > 5400, set region to Holidays
        eta = response;
      });
    } catch (error) {
      error.text().then((errorText) => {
        console.error(errorText);
        if (error.status === 403) {
          $password = undefined;
        }
      });
    }
  }
</script>

<g transition:fly={{ y: 120 }}>
  <CirclePath
    id={`${latitude},${longitude}`}
    r={radius * innerRadiusScale - offset * 12}
    cx={radius}
    cy={radius}
  />
  <text width="500" fill="currentColor">
    <textPath
      xlink:href={`#${latitude},${longitude}`}
      text-anchor="middle"
      startOffset="25%">
      {name} will be home in {eta.text}
    </textPath>
  </text>
</g>

<style>
  text {
    font-weight: 400;
    font-size: 12px;
  }
</style>
