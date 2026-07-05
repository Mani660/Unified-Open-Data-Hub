const data = window.CRIME_DASHBOARD_DATA;
const state = {
  view: "overview",
  city: "All cities",
  domain: "All domains",
};

const palette = ["#4f83c4", "#d84a56", "#147d72", "#ff7a18", "#7c6bb2", "#7ba65b", "#54a9bd"];
const compact = (n) => {
  const value = Number(n) || 0;
  const abs = Math.abs(value);
  if (abs >= 10_000_000) return `${(value / 10_000_000).toFixed(2)} Cr`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString("en-IN");
};

const formatInt = (n) => Number(n || 0).toLocaleString("en-IN");

function setupCanvas(id) {
  const canvas = document.getElementById(id);
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const height = Number(canvas.getAttribute("height"));
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, rect.width, height);
  return { canvas, ctx, width: rect.width, height };
}

function fillFilters() {
  document.querySelector("#cityFilter").innerHTML = `<option>All cities</option>` + data.india.cities
    .map((city) => `<option>${city.city}</option>`)
    .join("");

  document.querySelector("#domainFilter").innerHTML = `<option>All domains</option>` + data.india.domains
    .map((domain) => `<option>${domain.name}</option>`)
    .join("");
}

function filteredCities() {
  return data.india.cities.filter((city) => state.city === "All cities" || city.city === state.city);
}

function updateKpis() {
  const city = state.city === "All cities" ? null : data.india.cities.find((item) => item.city === state.city);
  document.querySelector("#totalRecords").textContent = formatInt(data.meta.rows);
  document.querySelector("#indiaCases").textContent = city ? formatInt(city.cases) : formatInt(data.india.totalIncidents);
  document.querySelector("#closureKpi").textContent = `${(city ? city.closureRate : data.india.closureRate).toFixed(1)}%`;
  document.querySelector("#crimeIndexKpi").textContent = data.worldCrimeIndex.avgCrimeIndex.toFixed(1);
  document.querySelector("#cityName").textContent = city ? city.city : "All Indian cities";
  document.querySelector("#citySummary").textContent = city
    ? `${formatInt(city.cases)} incidents, ${city.closureRate.toFixed(1)}% closed, top domain: ${city.topDomain}.`
    : `Top city: ${data.india.cities[0].city} with ${formatInt(data.india.cities[0].cases)} incidents.`;
}

function renderCityCards() {
  document.querySelector("#cityCards").innerHTML = data.india.cities.slice(0, 7).map((city, index) => `
    <button class="city-card ${city.city === state.city ? "active" : ""}" data-city="${city.city}" type="button">
      <strong>${index + 1}. ${city.city}</strong>
      <span>${compact(city.cases)}</span>
      <small>${city.closureRate.toFixed(1)}% closed · ${city.topDomain}</small>
    </button>
  `).join("");

  document.querySelectorAll(".city-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.city = card.dataset.city;
      document.querySelector("#cityFilter").value = state.city;
      renderAll();
    });
  });
}

function drawCityMap() {
  const { canvas, ctx, width, height } = setupCanvas("cityMap");
  const cities = data.india.cities.slice(0, 10);
  const selected = state.city;
  const points = [
    [0.45, 0.19], [0.35, 0.58], [0.48, 0.73], [0.51, 0.64], [0.68, 0.52],
    [0.54, 0.79], [0.41, 0.66], [0.31, 0.46], [0.39, 0.33], [0.50, 0.35],
  ];

  ctx.save();
  ctx.translate(width * 0.5, height * 0.52);
  ctx.fillStyle = "#c9e0bd";
  ctx.strokeStyle = "#314643";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const outline = [
    [-62, -182], [-36, -166], [-6, -181], [29, -150], [47, -104], [88, -75],
    [79, -28], [108, 8], [77, 44], [67, 96], [33, 133], [18, 178],
    [-13, 155], [-31, 105], [-57, 72], [-47, 26], [-84, -6], [-70, -56],
    [-96, -100], [-73, -132],
  ];
  outline.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#6f7d83";
  ctx.font = "800 13px Inter, Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("INDIA", width * 0.5, height * 0.16);

  const max = Math.max(...cities.map((city) => city.cases));
  cities.forEach((city, index) => {
    const [px, py] = points[index];
    const x = width * px;
    const y = height * py;
    const active = selected === city.city;
    const radius = 7 + (city.cases / max) * 18;
    ctx.beginPath();
    ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
    ctx.fillStyle = active ? "rgba(255, 122, 24, 0.22)" : "rgba(20, 125, 114, 0.12)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = active ? "#ff7a18" : "#147d72";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#071b20";
    ctx.font = "700 12px Inter, Segoe UI";
    ctx.textAlign = x > width * 0.68 ? "right" : "left";
    ctx.fillText(city.city, x + (x > width * 0.68 ? -radius - 8 : radius + 8), y + 4);
  });

  canvas.onclick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = cities.find((city, index) => {
      const [px, py] = points[index];
      const dx = x - width * px;
      const dy = y - height * py;
      return Math.sqrt(dx * dx + dy * dy) < 28;
    });
    if (hit) {
      state.city = hit.city;
      document.querySelector("#cityFilter").value = state.city;
      renderAll();
    }
  };
}

function drawDonut(id, items) {
  const { ctx, width, height } = setupCanvas(id);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const cx = width * 0.34;
  const cy = height * 0.5;
  const radius = Math.min(width, height) * 0.32;
  let start = -Math.PI / 2;
  items.slice(0, 6).forEach((item, index) => {
    const end = start + (item.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = palette[index % palette.length];
    ctx.fill();
    start = end;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.57, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.fillStyle = "#071b20";
  ctx.font = "800 18px Inter, Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(compact(total), cx, cy + 6);
  ctx.textAlign = "left";

  items.slice(0, 6).forEach((item, index) => {
    const y = height * 0.2 + index * 28;
    ctx.fillStyle = palette[index % palette.length];
    ctx.fillRect(width * 0.58, y, 12, 12);
    ctx.fillStyle = "#071b20";
    ctx.font = "13px Inter, Segoe UI";
    ctx.fillText(`${item.name} (${compact(item.value)})`, width * 0.58 + 20, y + 11);
  });
}

function drawRankChart(id, items, options = {}) {
  const { ctx, width, height } = setupCanvas(id);
  const rows = items.slice(0, options.limit || 10);
  const max = Math.max(...rows.map((item) => item.value), 1);
  const pad = { left: options.left || 145, right: 62, top: 16, bottom: 18 };
  const rowH = (height - pad.top - pad.bottom) / rows.length;
  rows.forEach((item, index) => {
    const y = pad.top + index * rowH + rowH * 0.24;
    const barH = Math.max(9, rowH * 0.48);
    const w = ((width - pad.left - pad.right) * item.value) / max;
    ctx.fillStyle = index % 2 === 0 ? "rgba(20, 125, 114, 0.05)" : "transparent";
    ctx.fillRect(0, pad.top + index * rowH, width, rowH);
    ctx.fillStyle = "#071b20";
    ctx.font = "12px Inter, Segoe UI";
    ctx.textAlign = "right";
    ctx.fillText(item.name, pad.left - 10, y + barH * 0.75);
    ctx.fillStyle = palette[index % palette.length];
    ctx.fillRect(pad.left, y, w, barH);
    ctx.fillStyle = "#6f7d83";
    ctx.textAlign = "left";
    ctx.fillText(compact(item.value), pad.left + w + 8, y + barH * 0.75);
  });
  ctx.textAlign = "left";
}

function drawLine(id, rows) {
  const { ctx, width, height } = setupCanvas(id);
  const pad = { left: 72, right: 22, top: 20, bottom: 42 };
  const values = rows.map((row) => Number(row.value) || 0);
  const max = Math.max(...values) * 1.08;
  const min = Math.min(...values) * 0.9;
  const x = (i) => pad.left + (i / Math.max(1, rows.length - 1)) * (width - pad.left - pad.right);
  const y = (v) => pad.top + (1 - (v - min) / Math.max(1, max - min)) * (height - pad.top - pad.bottom);
  ctx.strokeStyle = "#dfe8ec";
  ctx.fillStyle = "#6f7d83";
  ctx.font = "12px Inter, Segoe UI";
  for (let i = 0; i <= 4; i++) {
    const gy = pad.top + ((height - pad.top - pad.bottom) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(width - pad.right, gy);
    ctx.stroke();
    ctx.fillText(compact(max - ((max - min) * i) / 4), 8, gy + 4);
  }
  ctx.beginPath();
  rows.forEach((row, i) => i ? ctx.lineTo(x(i), y(row.value)) : ctx.moveTo(x(i), y(row.value)));
  ctx.strokeStyle = "#147d72";
  ctx.lineWidth = 3;
  ctx.stroke();
  rows.forEach((row, i) => {
    ctx.fillStyle = i === rows.length - 1 ? "#ff7a18" : "#147d72";
    ctx.beginPath();
    ctx.arc(x(i), y(row.value), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6f7d83";
    ctx.font = "11px Inter, Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(row.name, x(i), height - 16);
  });
  ctx.textAlign = "left";
}

function drawScatter() {
  const { ctx, width, height } = setupCanvas("crimeScatterChart");
  const rows = data.worldCrimeIndex.cities.slice(0, 60);
  const pad = { left: 52, right: 24, top: 18, bottom: 42 };
  const x = (crime) => pad.left + (crime / 100) * (width - pad.left - pad.right);
  const y = (safety) => pad.top + (1 - safety / 100) * (height - pad.top - pad.bottom);
  ctx.strokeStyle = "#dfe8ec";
  for (let i = 0; i <= 4; i++) {
    const gx = pad.left + ((width - pad.left - pad.right) * i) / 4;
    const gy = pad.top + ((height - pad.top - pad.bottom) * i) / 4;
    ctx.beginPath(); ctx.moveTo(gx, pad.top); ctx.lineTo(gx, height - pad.bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(width - pad.right, gy); ctx.stroke();
  }
  rows.forEach((row, index) => {
    ctx.fillStyle = index < 8 ? "rgba(255, 122, 24, 0.78)" : "rgba(20, 125, 114, 0.5)";
    ctx.beginPath();
    ctx.arc(x(row.crimeIndex), y(row.safetyIndex), index < 8 ? 7 : 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#6f7d83";
  ctx.font = "12px Inter, Segoe UI";
  ctx.fillText("Crime index ->", width - 112, height - 12);
  ctx.save();
  ctx.translate(13, 104);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Safety index ->", 0, 0);
  ctx.restore();
}

function renderTable() {
  document.querySelector("#detailRows").innerHTML = filteredCities().map((city) => `
    <tr>
      <td>${city.city}</td>
      <td>${formatInt(city.cases)}</td>
      <td>${city.closureRate.toFixed(1)}%</td>
      <td>${city.topDomain}</td>
    </tr>
  `).join("");
}

function renderCharts() {
  drawCityMap();
  drawDonut("domainChart", data.meta.sources);
  drawLine("drugTrendChart", data.drugOffences.byYear);
  drawRankChart("violentRegionChart", data.drugOffences.byRegion, { limit: 5, left: 110 });
  drawScatter();
}

function renderAll() {
  updateKpis();
  renderCityCards();
  renderCharts();
  renderTable();
}

function init() {
  fillFilters();
  document.querySelector("#viewFilter").addEventListener("change", (event) => {
    state.view = event.target.value;
    renderAll();
  });
  document.querySelector("#cityFilter").addEventListener("change", (event) => {
    state.city = event.target.value;
    renderAll();
  });
  document.querySelector("#domainFilter").addEventListener("change", (event) => {
    state.domain = event.target.value;
    renderAll();
  });
  document.querySelector("#resetButton").addEventListener("click", () => {
    state.view = "overview";
    state.city = "All cities";
    state.domain = "All domains";
    document.querySelector("#viewFilter").value = state.view;
    document.querySelector("#cityFilter").value = state.city;
    document.querySelector("#domainFilter").value = state.domain;
    renderAll();
  });
  renderAll();
}

window.addEventListener("load", init);
window.addEventListener("resize", () => {
  clearTimeout(window.__resizeTimer);
  window.__resizeTimer = setTimeout(renderAll, 150);
});
