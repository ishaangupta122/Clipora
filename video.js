const apiKey = "qguIWiR0OtGvsm9mX1TsAq5OGac45XyDyPhGLiFoRCuKlduU0BMvqobs"; // Replace with your Pexels API key
let currentPage = 1; // Track the current page of videos
const perPage = 30; // Number of videos per page
let currentQuery = "cars"; // Default query

document.addEventListener("DOMContentLoaded", () => {
  fetchVideos();
  setupLoadMoreButton();
  setupSearchFunctionality();
});

async function fetchVideos(page = 1, query = currentQuery) {
  const apiUrl = `https://api.pexels.com/videos/search?query=${query}&per_page=${perPage}&page=${page}`;
  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: apiKey,
      },
    });
    const data = await res.json();
    displayVideos(data.videos);
    setupPreviewTriggers(); // Set up preview triggers after displaying videos
  } catch (error) {
    console.log(`Cannot fetch ${error}`);
  }
}

function displayVideos(videos) {
  const galleryContent = document.querySelector(".gallery-content");
  if (currentPage === 1) galleryContent.innerHTML = ""; // Clear previous videos only on a new search
  videos.forEach((video) => {
    const colVid = document.createElement("div");
    colVid.classList.add("col-img");

    const vidHoverContainer = document.createElement("div");
    vidHoverContainer.classList.add("img-hover-container", "preview-trigger");

    const vidHoverContent = document.createElement("div");
    vidHoverContent.classList.add("img-hover-content");

    const downloadButton = document.createElement("button");
    downloadButton.classList.add("download");
    downloadButton.type = "button";
    downloadButton.innerHTML = `<span class="download-text">Download</span><i class="fa-solid fa-download"></i>`;
    downloadButton.addEventListener("click", (event) => {
      event.stopPropagation();
      downloadVideo(video.video_files[0].link, `video-${video.id}.mp4`);
    });

    vidHoverContent.appendChild(downloadButton);
    vidHoverContainer.appendChild(vidHoverContent);

    const vidContainer = document.createElement("div");
    vidContainer.classList.add("img-container");

    const vidElement = document.createElement("video");
    vidElement.src = video.video_files[0].link;
    vidElement.alt = video.alt;
    vidElement.dataset.previewSrc = video.video_files[0].link;
    vidElement.autoplay = true;
    vidElement.muted = true;
    vidElement.loop = true;
    vidContainer.appendChild(vidElement);
    vidHoverContainer.appendChild(vidContainer);
    colVid.appendChild(vidHoverContainer);
    galleryContent.appendChild(colVid);
  });
}

function setupPreviewTriggers() {
  const previewContainer = document.getElementById("preview-container");
  const previewVid = document.getElementById("preview-img");
  const previewClose = document.getElementById("preview-close");
  const downloadPreviewButton = document.getElementById("download-preview");

  document.querySelectorAll(".preview-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const vidElement = trigger.querySelector("video");
      if (vidElement) {
        const previewSrc = vidElement.dataset.previewSrc;
        previewVid.src = previewSrc;
        previewVid.autoplay = true;
        previewVid.controls = true;
        previewVid.muted = true;
        previewVid.loop = true;
        downloadPreviewButton.href = previewSrc;
        downloadPreviewButton.setAttribute("download", "video-preview.mp4");
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

function downloadVideo(url, filename) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => console.error("Error downloading video:", error));
}

function setupLoadMoreButton() {
  const loadMoreBtn = document.getElementById("load-more-btn");

  loadMoreBtn.addEventListener("click", () => {
    currentPage += 1;
    fetchVideos(currentPage, currentQuery);
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
      fetchVideos(currentPage, currentQuery);
    }
  });
}
