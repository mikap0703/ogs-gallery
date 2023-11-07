<script>
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';

  let galleryImages = [];

  // Fetch data from the API endpoint
  async function fetchData() {
    try {
      const response = await fetch("/api/current-images");
      if (response.ok) {
        const data = await response.json();
        galleryImages = data.gallery.sort((a, b) => a.order - b.order);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  let currentIndex = 0;
  let doRotation = true;

  // Start the automatic rotation
  function startRotation() {
    function nextImage() {
      if (!doRotation) {
        return;
      }
      currentIndex = (currentIndex + 1) % galleryImages.length;
      setTimeout(nextImage, galleryImages[currentIndex].duration * 1000);
    }

    nextImage();
  }

  // Stop the automatic rotation
  function stopRotation() {
    doRotation = false;
  }

  // Start the rotation when the component is mounted
  onMount(async () => {
    await fetchData();
    startRotation();
  });

  // Stop the rotation when the component is unmounted
  onDestroy(() => {
    stopRotation();
  });
</script>

<style>
    .image-carousel {
        display: flex;
        overflow: hidden;
        max-height: 100vh;
    }

    .image-carousel img {
        flex: 0 0 auto;
        max-width: 100vw;
        max-height: 100vh;
        width: auto;
        height: auto;
        display: none;
    }

    .image-carousel img.active {
        display: block;
        animation: fade 1s ease-in-out;
    }

    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

<div class="image-carousel">
    {#each galleryImages as image, i (image)}
        <img
            src={image.img}
            alt={`Image ${i + 1}`}
            class="{i === currentIndex ? 'active' : ''}"
            transition:fly
        />
    {/each}
</div>
