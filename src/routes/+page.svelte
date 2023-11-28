<script>
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';

  function getDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  let galleryImages = [];
  let lastFetch = null;

  // Fetch data from the API endpoint
  async function fetchData() {
    try {
      const currentDate = getDate(); // Assuming getDate() retrieves the current date

      const response = await fetch("/api/current-images", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: getDate() })
      });

      if (response.ok) {
        const data = await response.json();
        galleryImages = data.gallery.sort((a, b) => a.order - b.order);
        lastFetch = getDate()
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  let currentIndex = -1;
  let doRotation = true;

  // Start the automatic rotation
  function startRotation() {
    async function nextImage() {
      if (lastFetch !== getDate()) {
        galleryImages = [];
        await fetchData();
      }

      if (!doRotation) {
        return;
      }

      currentIndex++
      if (currentIndex >= galleryImages.length) {
        currentIndex = 0;
      }

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


