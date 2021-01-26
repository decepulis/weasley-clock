<script lang="ts">
  import { onDestroy } from "svelte";
  import { formatSeconds, getSecondsElapsedSince } from "./Clock/utils";

  export let seconds: number;

  let displayValue: number;
  let displayValueSetTime: Date;
  // Any time seconds is updated, displayValue is set to it
  $: {
    displayValue = seconds;
    displayValueSetTime = new Date();
  }

  // And then every seconds, we update that value
  const interval = setInterval(() => {
    const isValidDateObject =
      typeof displayValueSetTime?.getTime === "function";
    if (isValidDateObject) {
      const secondsElapsed = getSecondsElapsedSince(displayValueSetTime);
      displayValue = seconds - secondsElapsed;
    }
  }, 1000);
  onDestroy(() => clearInterval(interval));

  // And from that updated value, we calculate a string
  let displayStr = "...";
  $: {
    if (typeof displayValue === "number") {
      if (displayValue <= 120) {
        displayStr = "soon!";
      } else {
        const displayTimeStr = formatSeconds(displayValue);
        displayStr = `in ${displayTimeStr}.`;
      }
    }
  }
</script>

<tspan>
  {displayStr}
</tspan>
