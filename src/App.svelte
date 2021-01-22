<script lang="ts">
  import Clock from "./components/Clock/index.svelte";
</script>

<Clock
  trackerIds={["dc", "kc"]}
  regionNames={[
    "Home",
    "In Transit",
    "Lost",
    "Work",
    "Mortal Peril",
    "Barn",
    "Holidays",
  ]}
/>

<style>
  :global(html) {
    box-sizing: border-box;
    font-size: 30px;
    font-family: "Fraunces", serif;
    font-weight: 700;
  }

  :global(*, *:before, *:after) {
    box-sizing: inherit;
  }

  :global(body) {
    margin: 0;
    padding: 0;

    width: 100vw;
    height: 100vh;
  }
</style>
