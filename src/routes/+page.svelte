<script>
  import {onMount} from 'svelte';
  import { fade } from 'svelte/transition';

  let galleryImages = [];

  // Fetch data from the API endpoint
  async function fetchData() {
    try {
      const response = await fetch("/api/current-images");
      if (response.ok) {
        const data = await response.json();
        galleryImages = data.gallery;
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  let currentImageIndex = 0;
  let timer;

  function startGallery() {
    if (timer) clearInterval(timer);

    timer = () => {
      setInterval(() => {
        if (currentImageIndex < galleryImages.length - 1) {
          currentImageIndex++;
        } else {
          currentImageIndex = 0;
        }
      }, galleryImages[currentImageIndex].duration * 1000); // Convert duration to milliseconds
    }

    timer()
  }

  // Call the API when the component is mounted
  onMount(async () => {
    await fetchData();
    startGallery();
  });
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    .gallery {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        position: relative;
        overflow: hidden;
    }

    .image-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .main-image {
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        object-fit: contain;
        z-index: 100;
    }

    .blurred-background {
        position: absolute;
        min-width: 100%;
        min-height: 100%;
        filter: blur(15px); /* Adjust the blur strength as needed */
        z-index: 0;
    }
</style>

<div class="gallery">
    {#if galleryImages.length > 0}
        {#key currentImageIndex}
            <div class="image-container" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
                <img class="main-image" src={galleryImages[currentImageIndex].img} alt="" />
                <img class="blurred-background" src={galleryImages[currentImageIndex].img} alt="" />
            </div>
        {/key}
    {/if}
</div>


