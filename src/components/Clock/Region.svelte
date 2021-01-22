<script type="ts">
  import type { RegionType } from "../../types/region.type";

  import CirclePath from "../CirclePath.svelte";

  export let region: RegionType;
  export let viewBox: number;

  $: ({ name, angleDeg } = region);
  $: radius = viewBox / 2;
  $: offsetAngleDeg = angleDeg - 90;

  const innerRadiusScale = 0.8;
</script>

<g style={`transform-origin: center; transform: rotate(${offsetAngleDeg}deg);`}>
  <CirclePath id={name} r={radius * innerRadiusScale} cx={radius} cy={radius} />
  <text width="500" fill="currentColor">
    <textPath xlink:href={`#${name}`} text-anchor="middle" startOffset="50%">
      {name}
    </textPath>
  </text>
</g>
