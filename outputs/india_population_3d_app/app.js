const india = {
  population2011: 1210854977,
  male: 623724248,
  female: 586469174,
  sexRatio: 943,
  rural: 833087662,
  urban: 377105760,
  population2024: 1450935791,
};

const states = [
  { name: "Uttar Pradesh", pop: 199812341, density: 828, sexRatio: 930, rural: 155111022, urban: 44470455, pop2024: 240468000 },
  { name: "Maharashtra", pop: 112374333, density: 365, sexRatio: 929, rural: 61545441, urban: 50827531, pop2024: 127360000 },
  { name: "Bihar", pop: 104099452, density: 1102, sexRatio: 918, rural: 92075028, urban: 11729609, pop2024: 128592000 },
  { name: "West Bengal", pop: 91276115, density: 1030, sexRatio: 950, rural: 62213676, urban: 29134060, pop2024: 100042000 },
  { name: "Madhya Pradesh", pop: 72626809, density: 236, sexRatio: 931, rural: 52537899, urban: 20059666, pop2024: 87610000 },
  { name: "Tamil Nadu", pop: 72147030, density: 555, sexRatio: 996, rural: 37189229, urban: 34949729, pop2024: 77317000 },
  { name: "Rajasthan", pop: 68548437, density: 201, sexRatio: 928, rural: 51540236, urban: 17080776, pop2024: 81897000 },
  { name: "Karnataka", pop: 61095297, density: 319, sexRatio: 973, rural: 37552529, urban: 23578175, pop2024: 68115000 },
  { name: "Gujarat", pop: 60439692, density: 308, sexRatio: 919, rural: 34670817, urban: 25712811, pop2024: 72367000 },
  { name: "Andhra Pradesh", pop: 49386799, density: 308, sexRatio: 996, rural: 34776389, urban: 14610410, pop2024: 53340000 },
  { name: "Odisha", pop: 41974218, density: 269, sexRatio: 979, rural: 34951234, urban: 6996124, pop2024: 46566000 },
  { name: "Telangana", pop: 35193978, density: 307, sexRatio: 988, rural: 21585313, urban: 13608665, pop2024: 38454000 },
  { name: "Kerala", pop: 33406061, density: 859, sexRatio: 1084, rural: 17445506, urban: 15932171, pop2024: 35920000 },
  { name: "Jharkhand", pop: 32988134, density: 414, sexRatio: 948, rural: 25036946, urban: 7929292, pop2024: 39963000 },
  { name: "Assam", pop: 31205576, density: 397, sexRatio: 958, rural: 26780526, urban: 4388756, pop2024: 36047000 },
  { name: "Punjab", pop: 27743338, density: 550, sexRatio: 895, rural: 17316800, urban: 10387436, pop2024: 30926000 },
  { name: "Chhattisgarh", pop: 25545198, density: 189, sexRatio: 991, rural: 19603658, urban: 5936538, pop2024: 30524000 },
  { name: "Haryana", pop: 25351462, density: 573, sexRatio: 879, rural: 16531493, urban: 8821588, pop2024: 30573000 },
  { name: "Delhi (UT)", pop: 16787941, density: 11297, sexRatio: 868, rural: 944727, urban: 12905780, pop2024: 21752000 },
  { name: "Jammu and Kashmir", pop: 12541302, density: 56, sexRatio: 889, rural: 9134820, urban: 3414106, pop2024: 13701000 },
  { name: "Uttarakhand", pop: 10086292, density: 189, sexRatio: 963, rural: 7025583, urban: 3091169, pop2024: 11874000 },
  { name: "Himachal Pradesh", pop: 6864602, density: 123, sexRatio: 972, rural: 6167805, urban: 688704, pop2024: 7505000 },
  { name: "Tripura", pop: 3673917, density: 350, sexRatio: 960, rural: 2710051, urban: 960981, pop2024: 4222000 },
  { name: "Meghalaya", pop: 2966889, density: 132, sexRatio: 989, rural: 2368971, urban: 595036, pop2024: 3379000 },
  { name: "Manipur", pop: 2855794, density: 128, sexRatio: 985, rural: 1899624, urban: 822132, pop2024: 3253000 },
  { name: "Nagaland", pop: 1978502, density: 119, sexRatio: 931, rural: 1406861, urban: 573741, pop2024: 2253000 },
  { name: "Goa", pop: 1458545, density: 394, sexRatio: 973, rural: 551414, urban: 906309, pop2024: 1583000 },
  { name: "Arunachal Pradesh", pop: 1383727, density: 17, sexRatio: 938, rural: 1069165, urban: 313446, pop2024: 1576000 },
  { name: "Puducherry (UT)", pop: 1247953, density: 2598, sexRatio: 1037, rural: 394341, urban: 850123, pop2024: 1391163 },
  { name: "Mizoram", pop: 1097206, density: 52, sexRatio: 976, rural: 529037, urban: 561997, pop2024: 1250000 },
  { name: "Chandigarh (UT)", pop: 1055450, density: 9252, sexRatio: 818, rural: 29004, urban: 1025682, pop2024: 1243000 },
  { name: "Sikkim", pop: 610577, density: 86, sexRatio: 890, rural: 455962, urban: 151726, pop2024: 695000 },
  { name: "Andaman and Nicobar Islands (UT)", pop: 380581, density: 46, sexRatio: 876, rural: 244411, urban: 135533, pop2024: 404000 },
  { name: "Dadra and Nagar Haveli (UT)", pop: 343709, density: 698, sexRatio: 774, rural: 183024, urban: 159829, pop2024: 657587 },
  { name: "Daman and Diu (UT)", pop: 243247, density: 2169, sexRatio: 618, rural: 60331, urban: 182580, pop2024: 657587 },
  { name: "Lakshadweep (UT)", pop: 64473, density: 2013, sexRatio: 946, rural: 14121, urban: 50308, pop2024: 69000 },
];

const colors = ["#4f95d1", "#e37a42", "#0e7c86", "#d7a83f", "#7c69b4", "#58a86b"];
const genderByState = {
  "Uttar Pradesh": [104480510, 95331831],
  "Maharashtra": [58243056, 54131277],
  "Bihar": [54278157, 49821295],
  "West Bengal": [46809027, 44467088],
  "Madhya Pradesh": [37612306, 35014503],
  "Tamil Nadu": [36137975, 36009055],
  "Rajasthan": [35550997, 32997440],
  "Karnataka": [30966657, 30128640],
  "Gujarat": [31491260, 28948432],
  "Andhra Pradesh": [24738068, 24648731],
  "Odisha": [21212136, 20762082],
  "Telangana": [17704078, 17489900],
  "Kerala": [16027412, 17378649],
  "Jharkhand": [16930315, 16057819],
  "Assam": [15939443, 15266133],
  "Punjab": [14639465, 13103873],
  "Chhattisgarh": [12832895, 12712303],
  "Haryana": [13494734, 11856728],
  "Delhi (UT)": [8887326, 7800615],
  "Jammu and Kashmir": [6640662, 5900640],
  "Uttarakhand": [5137773, 4948519],
  "Himachal Pradesh": [3481873, 3382729],
  "Tripura": [1874376, 1799541],
  "Meghalaya": [1491832, 1475057],
  "Manipur": [1438687, 1417107],
  "Nagaland": [1024649, 953853],
  "Goa": [739140, 719405],
  "Arunachal Pradesh": [713912, 669815],
  "Puducherry (UT)": [612511, 635442],
  "Mizoram": [555339, 541867],
  "Chandigarh (UT)": [580663, 474787],
  "Sikkim": [323070, 287507],
  "Andaman and Nicobar Islands (UT)": [202871, 177710],
  "Dadra and Nagar Haveli (UT)": [193760, 149949],
  "Daman and Diu (UT)": [150301, 92946],
  "Lakshadweep (UT)": [33123, 31350],
};

states.forEach((state) => {
  const gender = genderByState[state.name] || [0, 0];
  state.male = gender[0];
  state.female = gender[1];
});

const classifiedRuralUrban = india.rural + india.urban;
const pct = (value, total) => `${((value / total) * 100).toFixed(1)}%`;
const signed = (n) => `${n >= 0 ? "+" : "-"}${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;
const short = (name) => name
  .replace("Andaman and Nicobar Islands (UT)", "A&N Islands")
  .replace("Dadra and Nagar Haveli (UT)", "D&N Haveli")
  .replace("Daman and Diu (UT)", "Daman & Diu")
  .replace("Uttar Pradesh", "Uttar P.")
  .replace("Madhya Pradesh", "Madhya P.")
  .replace("Jammu and Kashmir", "J&K")
  .replace("Chandigarh (UT)", "Chandigarh")
  .replace("Puducherry (UT)", "Puducherry");

const compact = (n) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return `${Math.round(n / 1000)}K`;
};

function fillSummaryValues() {
  document.querySelector("#exactTotal").textContent = india.population2011.toLocaleString("en-IN");
  document.querySelector("#totalPopulation").textContent = compact(india.population2011);
  document.querySelector("#estimate2024").textContent = compact(india.population2024);
  document.querySelector("#sexRatio").textContent = india.sexRatio.toLocaleString("en-IN");
  document.querySelector("#urbanShare").textContent = pct(india.urban, classifiedRuralUrban);
  const growthDiff = india.population2024 - india.population2011;
  const genderDiff = india.male - india.female;
  const residenceDiff = india.rural - india.urban;
  document.querySelector("#nationalGrowthDiff").textContent = signed(growthDiff);
  document.querySelector("#nationalGrowthPct").textContent = `${pct(growthDiff, india.population2011)} estimated growth`;
  document.querySelector("#genderDiff").textContent = `${signed(genderDiff)} male`;
  document.querySelector("#ruralUrbanDiff").textContent = `${signed(residenceDiff)} rural`;
}

function build3DBars() {
  const target = document.querySelector("#population3d");
  const top = [...states].sort((a, b) => b.pop - a.pop).slice(0, 10);
  const max = top[0].pop;
  target.innerHTML = top.map((item, index) => {
    const height = Math.max(34, (item.pop / max) * 255);
    return `
      <div class="bar-wrap">
        <div class="bar3d" data-rank="${index + 1}" style="height:${height}px"></div>
        <div class="bar-value">${compact(item.pop)}</div>
        <div class="bar-label">${short(item.name)}</div>
      </div>
    `;
  }).join("");
}

function setupCanvas(id) {
  const canvas = document.getElementById(id);
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(Number(canvas.getAttribute("height")) * ratio);
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  return { canvas, ctx, width: rect.width, height: Number(canvas.getAttribute("height")) };
}

function drawLegend(ctx, labels, values, x, y, total) {
  labels.forEach((label, i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y + i * 24, 12, 12);
    ctx.fillStyle = "#102a2f";
    ctx.font = "13px Segoe UI";
    ctx.fillText(`${label} (${compact(values[i])}, ${pct(values[i], total)})`, x + 20, y + 11 + i * 24);
  });
}

function drawPie(id, labels, values, doughnut = true) {
  const { ctx, width, height } = setupCanvas(id);
  const total = values.reduce((a, b) => a + b, 0);
  const cx = width * 0.36;
  const cy = height * 0.5;
  const radius = Math.min(width, height) * 0.3;
  let start = -Math.PI / 2;

  values.forEach((value, i) => {
    const end = start + (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    start = end;
  });

  if (doughnut) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.54, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }

  ctx.fillStyle = "#102a2f";
  ctx.font = "700 17px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(compact(total), cx, cy + 5);
  ctx.textAlign = "left";
  drawLegend(ctx, labels, values, width * 0.58, height * 0.34, total);
}

function drawReadableRankChart(id, items, valueKey, options = {}) {
  const { ctx, width, height } = setupCanvas(id);
  const labelWidth = Math.min(210, Math.max(135, width * 0.34));
  const pad = { left: labelWidth, right: 72, top: 16, bottom: 22 };
  const rowH = (height - pad.top - pad.bottom) / items.length;
  const max = Math.max(...items.map((d) => d[valueKey]));
  ctx.clearRect(0, 0, width, height);
  ctx.font = "12px Segoe UI";

  items.forEach((item, i) => {
    const y = pad.top + i * rowH + rowH * 0.2;
    const barH = Math.max(10, rowH * 0.45);
    const w = ((width - pad.left - pad.right) * item[valueKey]) / max;
    ctx.fillStyle = i % 2 === 0 ? "rgba(14, 124, 134, 0.04)" : "transparent";
    ctx.fillRect(0, pad.top + i * rowH, width, rowH);
    ctx.fillStyle = "#102a2f";
    ctx.textAlign = "right";
    ctx.fillText(short(item.name), pad.left - 12, y + barH * 0.75);
    ctx.fillStyle = options.color || "#4f95d1";
    ctx.fillRect(pad.left, y, w, barH);
    ctx.fillStyle = "#61787a";
    ctx.textAlign = "left";
    let label;
    if (options.percent) label = `${(item[valueKey] * 100).toFixed(1)}%`;
    else if (options.compact) label = compact(item[valueKey]);
    else label = item[valueKey].toLocaleString("en-IN");
    ctx.fillText(label, pad.left + w + 8, y + barH * 0.75);
  });
  ctx.textAlign = "left";
}

function drawSimpleBar(id, labels, values, options = {}) {
  const { ctx, width, height } = setupCanvas(id);
  const pad = { left: 52, right: 26, top: 22, bottom: 52 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const max = Math.max(...values, 1);
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "#d7e4e0";
  ctx.fillStyle = "#61787a";
  ctx.font = "12px Segoe UI";
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + chartH - (chartH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(compact((max * i) / 4), 4, y + 4);
  }

  const gap = 24;
  const barW = Math.max(34, (chartW - gap * (values.length - 1)) / values.length);
  values.forEach((value, i) => {
    const x = pad.left + i * (barW + gap);
    const h = (value / max) * chartH;
    const y = pad.top + chartH - h;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y, barW, h);
    ctx.fillStyle = "#102a2f";
    ctx.font = "700 12px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(options.percent ? pct(value, values.reduce((a, b) => a + b, 0)) : compact(value), x + barW / 2, Math.max(14, y - 6));
    ctx.fillStyle = "#61787a";
    ctx.font = "12px Segoe UI";
    ctx.fillText(labels[i], x + barW / 2, height - 18);
  });
  ctx.textAlign = "left";
}

function drawMetricPair(id, state) {
  const { ctx, width, height } = setupCanvas(id);
  const metrics = [
    { label: "Density", value: state.density, color: "#e37a42", note: "per km2" },
    { label: "Sex ratio", value: state.sexRatio, color: "#0e7c86", note: "female/1000 male" },
  ];
  const max = Math.max(...metrics.map((m) => m.value));
  const pad = 34;
  const barArea = width - pad * 2;
  ctx.clearRect(0, 0, width, height);
  metrics.forEach((metric, i) => {
    const y = 54 + i * 82;
    const w = (barArea * metric.value) / max;
    ctx.fillStyle = "#eef6f3";
    ctx.fillRect(pad, y, barArea, 30);
    ctx.fillStyle = metric.color;
    ctx.fillRect(pad, y, w, 30);
    ctx.fillStyle = "#102a2f";
    ctx.font = "700 14px Segoe UI";
    ctx.fillText(metric.label, pad, y - 12);
    ctx.textAlign = "right";
    ctx.fillText(metric.value.toLocaleString("en-IN"), width - pad, y - 12);
    ctx.textAlign = "left";
    ctx.fillStyle = "#61787a";
    ctx.font = "12px Segoe UI";
    ctx.fillText(metric.note, pad, y + 50);
  });
}

function drawHorizontalBar(id, items, valueKey, options = {}) {
  const { ctx, width, height } = setupCanvas(id);
  const pad = { left: 150, right: 30, top: 16, bottom: 24 };
  const rowH = (height - pad.top - pad.bottom) / items.length;
  const max = Math.max(...items.map((d) => d[valueKey]));

  ctx.font = "12px Segoe UI";
  items.forEach((item, i) => {
    const y = pad.top + i * rowH + rowH * 0.23;
    const w = ((width - pad.left - pad.right) * item[valueKey]) / max;
    ctx.fillStyle = "#102a2f";
    ctx.textAlign = "right";
    ctx.fillText(short(item.name), pad.left - 12, y + 13);
    ctx.fillStyle = options.color || "#e37a42";
    ctx.fillRect(pad.left, y, w, rowH * 0.48);
    ctx.fillStyle = "#61787a";
    ctx.textAlign = "left";
    const label = options.percent ? `${(item[valueKey] * 100).toFixed(1)}%` : item[valueKey].toLocaleString("en-US");
    ctx.fillText(label, pad.left + w + 8, y + 13);
  });
}

function drawAllStatesChart() {
  const ranked = [...states].sort((a, b) => b.pop - a.pop);
  drawReadableRankChart("allStatesChart", ranked, "pop", { color: "#4f95d1", compact: true });
}

function populateStateSelect() {
  const select = document.querySelector("#stateSelect");
  if (select.options.length) return;
  states
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((state) => {
      const option = document.createElement("option");
      option.value = state.name;
      option.textContent = state.name;
      select.appendChild(option);
    });
  select.value = "Uttar Pradesh";
  select.addEventListener("change", () => drawStateExplorer(select.value));
}

function drawStateExplorer(stateName) {
  const state = states.find((item) => item.name === stateName) || states[0];
  const popDiff = state.pop2024 - state.pop;
  const nationalShare = state.pop / india.population2011;
  const summary = document.querySelector("#stateSummary");
  summary.innerHTML = `
    <article><span>2011 population</span><strong>${state.pop.toLocaleString("en-IN")}</strong><small>${pct(state.pop, india.population2011)} of India</small></article>
    <article><span>2024 estimate</span><strong>${state.pop2024.toLocaleString("en-IN")}</strong><small>${signed(popDiff)} difference</small></article>
    <article><span>Density</span><strong>${state.density.toLocaleString("en-IN")}</strong><small>People per km2</small></article>
    <article><span>Sex ratio</span><strong>${state.sexRatio.toLocaleString("en-IN")}</strong><small>Female per 1,000 male</small></article>
    <article><span>Population share</span><strong>${(nationalShare * 100).toFixed(2)}%</strong><small>2011 national share</small></article>
  `;

  drawSimpleBar("statePopChart", ["2011", "2024"], [state.pop, state.pop2024]);
  drawPie("stateResidenceChart", ["Rural", "Urban"], [state.rural, state.urban], true);
  drawSimpleBar("stateGenderChart", ["Male", "Female"], [state.male || 0, state.female || 0]);
  drawMetricPair("stateMetricChart", state);
}

function drawAllCharts() {
  const topDensity = [...states].sort((a, b) => b.density - a.density).slice(0, 10);
  const topUrban = [...states]
    .map((s) => ({ ...s, urbanShare: s.urban / (s.rural + s.urban) }))
    .sort((a, b) => b.urbanShare - a.urbanShare)
    .slice(0, 10);
  const topSexRatio = [...states].sort((a, b) => b.sexRatio - a.sexRatio).slice(0, 10);
  const topGrowth = [...states]
    .filter((s) => s.pop >= 10_000_000)
    .map((s) => ({ ...s, growth: (s.pop2024 - s.pop) / s.pop }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 10);

  fillSummaryValues();
  populateStateSelect();
  build3DBars();
  drawPie("ruralUrbanChart", ["Rural", "Urban"], [india.rural, india.urban], true);
  drawPie("genderChart", ["Male", "Female"], [india.male, india.female], true);
  drawReadableRankChart("densityChart", topDensity, "density", { color: "#e37a42" });
  drawReadableRankChart("urbanChart", topUrban, "urbanShare", { color: "#d7a83f", percent: true });
  drawHorizontalBar("sexRatioChart", topSexRatio, "sexRatio", { color: "#0e7c86" });
  drawHorizontalBar("growthChart", topGrowth, "growth", { color: "#7c69b4", percent: true });
  drawAllStatesChart();
  drawStateExplorer(document.querySelector("#stateSelect").value);
}

window.addEventListener("load", drawAllCharts);
window.addEventListener("resize", () => {
  clearTimeout(window.__chartResizeTimer);
  window.__chartResizeTimer = setTimeout(drawAllCharts, 150);
});
