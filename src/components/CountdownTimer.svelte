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
    const isDefinedValue = typeof displayValue !== "undefined";
    if (isValidDateObject && isDefinedValue) {
      const secondsElapsed = getSecondsElapsedSince(displayValueSetTime);
      displayValue = seconds - secondsElapsed;
    }
  }, 1000);
  onDestroy(() => clearInterval(interval));

  // And from that updated value, we calculate a string
  let displayStr = "...";
  $: {
    if (typeof displayValue === "number" && !isNaN(displayValue)) {
      if (displayValue <= 120) {
        displayStr = "nearby!";
      } else {
        const displayTimeStr = formatSeconds(displayValue);
        displayStr = `${displayTimeStr} away.`;
      }
    }
  }
</script>

<tspan>
  {displayStr}
</tspan>
