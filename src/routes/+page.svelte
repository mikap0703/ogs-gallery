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

<div class="w-screen h-screen overflow-hidden bg-[#105569]">
    {#each galleryImages as image, i (image)}
        <div class="{i === currentIndex ? 'block' : 'hidden'} w-screen h-screen flex justify-center items-center">
            <img
                    src={image.img}
                    alt={`Image ${i + 1}`}
                    class="object-contain max-w-full max-h-full w-full h-auto mx-auto z-10"
                    transition:fly
            />
        </div>
    {/each}
</div>


