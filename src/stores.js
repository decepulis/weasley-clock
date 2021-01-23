import { writable } from "svelte/store";

const createPassword = () => {
  const { subscribe, set } = writable(
    localStorage?.getItem("password") ?? undefined
  );

  const localStorageSet = (value) => {
    localStorage.setItem("password", value);
    return set(value);
  };

  return {
    subscribe,
    set: localStorageSet,
  };
};
export const password = createPassword();

const createActiveRegionNames = () => {
  const { subscribe, update } = writable({});

  return {
    subscribe,
    updateRegionForTrackerId: (trackerId, region) =>
      update((activeRegionNames) => ({
        ...activeRegionNames,
        [trackerId]: region,
      })),
  };
};
export const activeRegionNames = createActiveRegionNames();
