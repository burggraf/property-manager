<!-- svelte-ignore slot_element_deprecated -->
<script lang="ts">
  // No script needed
</script>

<main class="flex-grow overflow-y-auto h-[calc(100vh-64px)]">
  <div class="container mx-auto mt-11">
    <slot />
  </div>
</main>

<style>
  main {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar) var(--scrollbar-bg);
  }

  main::-webkit-scrollbar {
    width: 8px;
  }

  main::-webkit-scrollbar-track {
    background: var(--scrollbar-bg);
  }

  main::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar);
    border-radius: 4px;
  }
</style>
