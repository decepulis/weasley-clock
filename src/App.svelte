<script lang="ts">
  import Clock from "./components/Clock/index.svelte";
  import PasswordPrompt from "./components/PasswordPrompt.svelte";

  import { password } from "./stores";
</script>

{#if !!$password}
  <Clock
    trackerIds={["dc", "kc"]}
    regionNames={[
      "Home",
      "In Transit",
      "Lost",
      "Work",
      "Mortal Peril",
      "Gym",
      "Barn",
      "Holidays",
    ]}
  />
{:else}
  <PasswordPrompt />
{/if}

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
