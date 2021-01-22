<script lang="ts">
  export let id: string;
  export let cx: number;
  export let cy: number;
  export let r: number;
</script>

<path
  {id}
  d={`
    M ${cx} ${cy}
    m -${r}, 0
    a ${r},${r} 0 1,1 ${r * 2},0
    a ${r},${r} 0 1,1 -${r * 2},0`}
  fill="transparent"
/>
