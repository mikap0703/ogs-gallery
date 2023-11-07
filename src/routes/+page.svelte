<script>
  import {onMount} from 'svelte';

  let galleryImages = [];

  // Fetch data from the API endpoint
  async function fetchData() {
    try {
      const response = await fetch("/api/current-images");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        galleryImages = data.gallery;
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Call the API when the component is mounted
  onMount(() => {
    fetchData();
  });
</script>

<main>
    {#if galleryImages.length > 0}
        <div class="gallery">
            {#each galleryImages as image}
                <img src={image.img} alt="Gallery" />
            {/each}
        </div>
    {:else}
        <p>Loading...</p>
    {/if}
</main>

<style>
    .gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    img {
        max-width: 100%;
        height: auto;
    }
</style>
