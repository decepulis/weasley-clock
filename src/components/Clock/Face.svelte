<script lang="ts">
  export let viewBox: number;

  const strokeWidth = 8;
  const circleRadius = viewBox / 2 - strokeWidth / 2;
</script>

<svg viewBox={`0 0 ${viewBox} ${viewBox}`}>
  <circle
    r={circleRadius}
    cx={viewBox / 2}
    cy={viewBox / 2}
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
  <slot />
  <circle
    r={8}
    cx={viewBox / 2}
    cy={viewBox / 2}
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
</svg>

<style>
  svg {
    width: min(100vw, 100vh);
    height: min(100vw, 100vh);
  }
</style>
