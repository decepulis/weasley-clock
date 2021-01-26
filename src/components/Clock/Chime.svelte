<script lang="ts">
  // must run Chrome with flag --autoplay-policy=no-user-gesture-required
  export let activeRegionName: string;

  let currentRegionName: string;

  let audioCurrentTime: number;
  let audioPaused: boolean;

  $: {
    if (activeRegionName !== currentRegionName) {
      audioCurrentTime = 0;
      audioPaused = false;
    }
    currentRegionName = activeRegionName;
  }
</script>

<audio
  src="/media/chime_2.mp3"
  preload="auto"
  controls={false}
  bind:currentTime={audioCurrentTime}
  bind:paused={audioPaused}
/>

<style>
  audio {
    display: none;
  }
</style>
