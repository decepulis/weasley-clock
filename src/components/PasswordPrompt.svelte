<script lang="ts">
  import { password } from "../stores";

  let inputValue: string;
</script>

<form
  on:submit|preventDefault={() => {
    $password = inputValue;
  }}
>
  <label for="password">Enter Password</label>
  <input
    type="password"
    id="password"
    placeholder="password"
    bind:value={inputValue}
  />
  <button>Submit</button>
</form>

<style>
  form {
    width: 100%;
    height: 100%;
    background-color: black;
    color: white;

    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }
</style>
