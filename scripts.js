const apiKey = "qguIWiR0OtGvsm9mX1TsAq5OGac45XyDyPhGLiFoRCuKlduU0BMvqobs";
let currentPage = 1; // Track the current page of images
const perPage = 45; // Number of images per page
let currentQuery = "food and black"; // Default query

document.addEventListener("DOMContentLoaded", () => {
  fetchImages();
  setupLoadMoreButton();
  setupSearchFunctionality();
});

async function fetchImages(page = 1, query = currentQuery) {
  try {
    const apiUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=${page}`;
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: apiKey,
      },
    });
    const data = await res.json();
    displayImages(data.photos);
    setupPreviewTriggers();
  } catch (err) {
    console.log(`Cannot fetch ${err}`);
  }
}

function displayImages(photos) {
  const galleryContent = document.querySelector(".gallery-content");
  if (currentPage === 1) galleryContent.innerHTML = "";
  photos.forEach((photo) => {
    const colImg = document.createElement("div");
    colImg.classList.add("col-img");

    const imgHoverContainer = document.createElement("div");
    imgHoverContainer.classList.add("img-hover-container", "preview-trigger");

    const imgHoverContent = document.createElement("div");
    imgHoverContent.classList.add("img-hover-content");

    const downloadButton = document.createElement("button");
    downloadButton.classList.add("download");
    downloadButton.type = "button";
    downloadButton.innerHTML = `<span class="download-text">Download</span><i class="fa-solid fa-download"></i>`;
    downloadButton.addEventListener("click", (event) => {
      event.stopPropagation();
      downloadImage(photo.src.original, `image-${photo.id}.jpg`);
    });

    imgHoverContent.appendChild(downloadButton);
    imgHoverContainer.appendChild(imgHoverContent);

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const imgElement = document.createElement("img");
    imgElement.src = photo.src.large2x;
    imgElement.alt = photo.alt;
    imgElement.dataset.previewSrc = photo.src.original;

    imgContainer.appendChild(imgElement);
    imgHoverContainer.appendChild(imgContainer);
    colImg.appendChild(imgHoverContainer);
    galleryContent.appendChild(colImg);
  });
}

function setupPreviewTriggers() {
  const previewContainer = document.getElementById("preview-container");
  const previewImg = document.getElementById("preview-img");
  const previewClose = document.getElementById("preview-close");
  const downloadPreviewButton = document.getElementById("download-preview");

  document.querySelectorAll(".preview-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const imgElement = trigger.querySelector("img");
      if (imgElement) {
        const previewSrc = imgElement.dataset.previewSrc;
        previewImg.src = previewSrc;
        downloadPreviewButton.href = previewSrc;
        downloadPreviewButton.setAttribute("download", "image-preview.jpg");
        previewContainer.style.display = "flex";
      }
    });
  });

  previewClose.addEventListener("click", () => {
    previewContainer.style.display = "none";
  });

  previewContainer.addEventListener("click", (event) => {
    if (event.target === previewContainer) {
      previewContainer.style.display = "none";
    }
  });
}

async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}

// function downloadImage(url, filename) {
//   fetch(url)
//     .then((response) => response.blob())
//     .then((blob) => {
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     })
//     .catch((error) => console.error("Error downloading image:", error));
// }

function setupLoadMoreButton() {
  const loadMoreBtn = document.getElementById("load-more-btn");

  loadMoreBtn.addEventListener("click", () => {
    currentPage += 1;
    fetchImages(currentPage, currentQuery);
  });
}

function setupSearchFunctionality() {
  const searchForm = document.querySelector(".form");
  const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      currentQuery = query;
      currentPage = 1; // Reset to the first page for a new search
      fetchImages(currentPage, currentQuery);
    }
  });
}
