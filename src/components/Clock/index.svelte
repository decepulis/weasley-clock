<script lang="ts">
  import Face from "./Face.svelte";
  import Region from "./Region.svelte";
  import Hand from "./Hand.svelte";

  export let trackerIds: string[];
  export let regionNames: string[];

  $: regions = regionNames.map((regionName, regionIndex) => ({
    name: regionName,
    angleDeg: (360 * regionIndex) / regionNames.length,
  }));

  const viewBox = 500;
</script>

<main>
  <Face {viewBox}>
    {#each regions as region}
      <Region {region} {viewBox} />
    {/each}
    {#each trackerIds as trackerId, index}
      <Hand
        {trackerId}
        {regions}
        {viewBox}
        offset={trackerIds.length - index - 1}
      />
    {/each}
  </Face>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    background-color: black;
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
