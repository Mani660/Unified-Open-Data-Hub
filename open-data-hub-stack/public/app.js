const fallbackDatasets = [
  {
    id: 1,
    name: "National Air Quality Index by City",
    description: "Daily AQI readings for major Indian cities.",
    domain: "Pollution",
    format: "CSV",
    year: 2025,
    state: "All India",
    source: "CPCB",
    file_size: "18 MB",
    downloads: 24810
  },
  {
    id: 2,
    name: "NFHS District Health Indicators",
    description: "Health, nutrition, sanitation, and household indicators.",
    domain: "Health",
    format: "XLSX",
    year: 2024,
    state: "All India",
    source: "NFHS",
    file_size: "42 MB",
    downloads: 31420
  },
  {
    id: 3,
    name: "School Infrastructure and Enrollment",
    description: "School facilities, enrollment, and literacy signals.",
    domain: "Education",
    format: "JSON",
    year: 2025,
    state: "Karnataka",
    source: "data.gov.in",
    file_size: "9 MB",
    downloads: 12930
  }
];

async function getDatasets() {
  const params = new URLSearchParams({
    q: document.querySelector("#searchInput")?.value || "",
    domain: document.querySelector("#domainInput")?.value || "",
    format: document.querySelector("#formatInput")?.value || "",
    year: document.querySelector("#yearInput")?.value || "",
    state: document.querySelector("#stateInput")?.value || ""
  });

  try {
    const response = await fetch(`/api/datasets?${params.toString()}`);
    if (!response.ok) throw new Error("API unavailable");
    return response.json();
  } catch {
    return fallbackDatasets;
  }
}

function datasetCard(dataset) {
  return `
    <div class="col-lg-4">
      <article class="dataset-card">
        <div class="d-flex justify-content-between gap-3">
          <h3 class="h5 fw-black">${dataset.name}</h3>
          <span class="badge text-bg-info align-self-start">${dataset.format}</span>
        </div>
        <p class="text-secondary-emphasis mt-3">${dataset.description}</p>
        <div class="dataset-meta mt-4">
          <span>${dataset.domain}</span>
          <span>${dataset.year}</span>
          <span>${dataset.state}</span>
          <span>${dataset.source}</span>
          <span>${dataset.file_size}</span>
          <span>${Number(dataset.downloads || 0).toLocaleString("en-IN")} downloads</span>
        </div>
        <button class="btn btn-outline-light w-100 mt-4" onclick="trackDownload(${dataset.id})">Preview & Download</button>
      </article>
    </div>
  `;
}

async function loadDatasets() {
  const datasets = await getDatasets();
  document.querySelector("#datasetGrid").innerHTML = datasets.map(datasetCard).join("");
  document.querySelector("#heroCards").innerHTML = datasets.slice(0, 2).map((dataset) => `
    <div class="dataset-card">
      <div class="d-flex justify-content-between">
        <strong>${dataset.name}</strong>
        <span class="badge text-bg-info">${dataset.format}</span>
      </div>
      <small class="text-secondary">${dataset.source} | ${dataset.file_size}</small>
    </div>
  `).join("");
}

async function trackDownload(id) {
  try {
    const response = await fetch(`/api/datasets/${id}/download`, { method: "POST" });
    const result = await response.json();
    window.location.href = result.downloadUrl || "#";
  } catch {
    alert("Download tracked in demo mode.");
  }
}

function loadStats() {
  const stats = [
    ["10,000+", "Datasets indexed"],
    ["100,000+", "Downloads tracked"],
    ["28", "States covered"],
    ["5", "Source portals"]
  ];

  document.querySelector("#statsGrid").innerHTML = stats.map(([value, label]) => `
    <div class="col-sm-6">
      <div class="info-card">
        <div class="display-6 fw-black">${value}</div>
        <div class="text-secondary">${label}</div>
      </div>
    </div>
  `).join("");
}

for (const id of ["domainInput", "formatInput", "yearInput", "stateInput"]) {
  document.addEventListener("input", (event) => {
    if (event.target.id === id) loadDatasets();
  });
}

loadDatasets();
loadStats();

