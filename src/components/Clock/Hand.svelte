<script lang="ts">
  import type { RegionType } from "../../types/region.type";

  export let trackerId: string;
  // export let regions: RegionType[];
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
</script>

<g>
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
    alignment-baseline="middle">
    {trackerId}
  </text>
</g>

<style>
  text {
    font-style: italic;
    font-weight: 400;
    font-size: 24px;
  }
</style>
