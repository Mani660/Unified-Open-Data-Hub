import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Manish/OneDrive/Desktop/2011 Population of India.xlsx";
const outputDir = "C:/Users/Manish/OneDrive/ドキュメント/New project/outputs/india_population_dashboard";
const outputPath = `${outputDir}/2011 Population of India - Dashboard.xlsx`;

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[,\s]/g, "").replace(/[−–]/g, "-");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function shortName(name) {
  return String(name)
    .replace("Andaman and Nicobar Islands (UT)", "A&N Islands")
    .replace("Dadra and Nagar Haveli (UT)", "D&N Haveli")
    .replace("Puducherry (UT)", "Puducherry")
    .replace("Chhattisgarh", "Chhattis.")
    .replace("Jammu and Kashmir", "J&K")
    .replace("Himachal Pradesh", "Himachal")
    .replace("Madhya Pradesh", "Madhya P.")
    .replace("Uttar Pradesh", "Uttar P.")
    .replace("West Bengal", "West Bengal");
}

function fmtMillions(n) {
  return n == null ? "" : `${(n / 1_000_000).toFixed(1)}M`;
}

function fmtBig(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  return fmtMillions(n);
}

await fs.mkdir(outputDir, { recursive: true });

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const source = workbook.worksheets.getItem("Population of India");
const values = source.getRange("A1:T38").values;
const headers = values[0].map(String);

const col = (name) => headers.indexOf(name);
const rows = values.slice(1).map((row) => ({
  slNo: row[col("Sl No")],
  state: row[col("State/UT")],
  population2011: toNumber(row[col("Population (2011)")]),
  percent: toNumber(row[col("Percent (%)")]),
  male: toNumber(row[col("Male")]),
  female: toNumber(row[col("Female")]),
  sexRatio: toNumber(row[col("Sex ratio")]),
  rural: toNumber(row[col("Rural")]),
  urban: toNumber(row[col("Urban")]),
  area: toNumber(row[col("Area (km2)")]),
  density: toNumber(row[col("Density (per km2)")]),
  population2024: toNumber(row[col("Population (2024)")]),
  growth2012to2024: toNumber(row[col("% Variation (2012-2024)")]),
}));

const total = rows.find((r) => String(r.state).startsWith("Total"));
const states = rows.filter((r) => !String(r.state).startsWith("Total"));
const topPopulation = [...states].sort((a, b) => b.population2011 - a.population2011).slice(0, 10);
const topDensity = [...states].sort((a, b) => b.density - a.density).slice(0, 10);
const topUrbanShare = [...states]
  .map((r) => ({ ...r, urbanShare: r.urban / (r.rural + r.urban) }))
  .sort((a, b) => b.urbanShare - a.urbanShare)
  .slice(0, 10);
const bestSexRatio = [...states].sort((a, b) => b.sexRatio - a.sexRatio).slice(0, 4);

const dashboard = workbook.worksheets.getOrAdd("Dashboard");
dashboard.deleteAllDrawings();
dashboard.showGridLines = false;
dashboard.getRange("A1:V55").clear({ applyTo: "all" });

const helper = workbook.worksheets.getOrAdd("Dashboard Data");
helper.deleteAllDrawings();
helper.showGridLines = false;
helper.getRange("A1:Z80").clear({ applyTo: "all" });

const theme = {
  bg: "#EEF6F3",
  title: "#173B3F",
  title2: "#2E6F68",
  card: "#FFFFFF",
  cardSoft: "#F7FBF9",
  accent: "#0E7C86",
  accent2: "#E27D48",
  gold: "#D7A83F",
  text: "#183136",
  muted: "#5F7274",
  border: "#C8DDD8",
};

dashboard.getRange("A1:V55").format = { fill: theme.bg, font: { name: "Aptos", color: theme.text } };
dashboard.getRange("A1:V1").format.rowHeightPx = 10;
for (const width of [
  ["A:A", 18], ["B:B", 110], ["C:C", 110], ["D:D", 110], ["E:E", 110], ["F:F", 18],
  ["G:G", 115], ["H:H", 115], ["I:I", 115], ["J:J", 115], ["K:K", 18],
  ["L:L", 115], ["M:M", 115], ["N:N", 115], ["O:O", 115], ["P:P", 18],
  ["Q:Q", 110], ["R:R", 110], ["S:S", 110], ["T:T", 110], ["U:U", 110], ["V:V", 18],
]) {
  dashboard.getRange(width[0]).format.columnWidthPx = width[1];
}

dashboard.getRange("B2:U4").merge();
dashboard.getRange("B2").values = [["India Population Dashboard"]];
dashboard.getRange("B2:U4").format = {
  fill: theme.title,
  font: { bold: true, size: 24, color: "#FFFFFF", name: "Aptos Display" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
dashboard.getRange("B5:U5").merge();
dashboard.getRange("B5").values = [["Census 2011 state and union territory profile with 2024 estimate highlights"]];
dashboard.getRange("B5:U5").format = {
  fill: theme.title2,
  font: { size: 11, color: "#EAF7F5" },
  horizontalAlignment: "center",
};

const kpis = [
  ["Total population", fmtBig(total.population2011), `${total.population2011.toLocaleString("en-US")} in 2011`, "#0E7C86"],
  ["Male population", fmtMillions(total.male), `${((total.male / total.population2011) * 100).toFixed(1)}% share`, "#2E6F68"],
  ["Female population", fmtMillions(total.female), `${((total.female / total.population2011) * 100).toFixed(1)}% share`, "#E27D48"],
  ["Sex ratio", total.sexRatio, "Females per 1,000 males", "#D7A83F"],
  ["2024 estimate", fmtBig(total.population2024), `${((total.population2024 / total.population2011 - 1) * 100).toFixed(1)}% vs 2011`, "#526D82"],
];
const cardRanges = ["B7:E11", "G7:J11", "L7:O11", "Q7:T11", "B13:E17"];
for (let i = 0; i < kpis.length; i++) {
  const [label, metric, note, color] = kpis[i];
  const range = cardRanges[i];
  dashboard.getRange(range).format = { fill: theme.card, font: { color: theme.text } };
  dashboard.getRange(range).format.borders = { color: theme.border, style: "continuous", weight: "thin" };
  const topLeft = range.split(":")[0];
  const [colLetters, rowNumber] = topLeft.match(/[A-Z]+|\d+/g);
  const r = Number(rowNumber);
  const cardCols = range.match(/[A-Z]+/g);
  dashboard.getRange(`${cardCols[0]}${r}:${cardCols[1]}${r}`).merge();
  dashboard.getRange(`${cardCols[0]}${r + 1}:${cardCols[1]}${r + 2}`).merge();
  dashboard.getRange(`${cardCols[0]}${r + 3}:${cardCols[1]}${r + 3}`).merge();
  dashboard.getRange(`${colLetters}${r}`).values = [[label]];
  dashboard.getRange(`${colLetters}${r}`).format = { font: { bold: true, size: 10, color }, fill: theme.card };
  dashboard.getRange(`${colLetters}${r + 1}`).values = [[metric]];
  dashboard.getRange(`${colLetters}${r + 1}`).format = { font: { bold: true, size: 18, color: theme.text }, fill: theme.card, verticalAlignment: "center" };
  dashboard.getRange(`${colLetters}${r + 3}`).values = [[note]];
  dashboard.getRange(`${colLetters}${r + 3}`).format = { font: { size: 9, color: theme.muted }, fill: theme.card };
}

dashboard.getRange("G13:J17").format = { fill: theme.cardSoft, font: { color: theme.text } };
dashboard.getRange("G13:J13").merge();
dashboard.getRange("G13").values = [["Rural vs Urban Split"]];
dashboard.getRange("G13").format = { font: { bold: true, color: theme.accent }, fill: theme.cardSoft };
dashboard.getRange("G15:H15").values = [["Rural", total.rural]];
dashboard.getRange("G16:H16").values = [["Urban", total.urban]];
dashboard.getRange("H15:H16").format.numberFormat = "#,##0";
dashboard.getRange("I15:J15").merge();
dashboard.getRange("I16:J16").merge();
dashboard.getRange("I15").values = [[`${((total.rural / (total.rural + total.urban)) * 100).toFixed(1)}%`]];
dashboard.getRange("I16").values = [[`${((total.urban / (total.rural + total.urban)) * 100).toFixed(1)}%`]];
dashboard.getRange("G13:J17").format.borders = { color: theme.border, style: "continuous", weight: "thin" };

dashboard.getRange("L13:T17").format = { fill: theme.cardSoft, font: { color: theme.text } };
dashboard.getRange("L13:T13").merge();
dashboard.getRange("L13").values = [["Highest sex ratio states/UTs"]];
dashboard.getRange("L13").format = { font: { bold: true, color: theme.accent2 }, fill: theme.cardSoft };
for (const block of ["L15:M16", "N15:O16", "Q15:R16", "S15:T16"]) {
  dashboard.getRange(block).merge(true);
  dashboard.getRange(block).format = { horizontalAlignment: "center", fill: theme.cardSoft, font: { size: 9, color: theme.text } };
}
const sexRatioBlocks = ["L", "N", "Q", "S"];
for (let i = 0; i < bestSexRatio.length; i++) {
  const startCol = sexRatioBlocks[i];
  dashboard.getRange(`${startCol}15`).values = [[shortName(bestSexRatio[i].state)]];
  dashboard.getRange(`${startCol}16`).values = [[bestSexRatio[i].sexRatio]];
  dashboard.getRange(`${startCol}16`).format.numberFormat = "0";
}
dashboard.getRange("L13:T17").format.borders = { color: theme.border, style: "continuous", weight: "thin" };

helper.getRange("A1:C11").values = [
  ["State/UT", "Population 2011", "Population 2024"],
  ...topPopulation.map((r) => [shortName(r.state), r.population2011, r.population2024]),
];
helper.getRange("E1:F11").values = [
  ["State/UT", "Density / km2"],
  ...topDensity.map((r) => [shortName(r.state), r.density]),
];
helper.getRange("H1:I11").values = [
  ["State/UT", "Urban share"],
  ...topUrbanShare.map((r) => [shortName(r.state), r.urbanShare]),
];
helper.getRange("K1:L3").values = [
  ["Area", "Population"],
  ["Rural", total.rural],
  ["Urban", total.urban],
];
helper.getRange("A1:L1").format = { fill: theme.title2, font: { bold: true, color: "#FFFFFF" } };
helper.getRange("B2:C11").format.numberFormat = "#,##0";
helper.getRange("F2:F11").format.numberFormat = "#,##0";
helper.getRange("I2:I11").format.numberFormat = "0.0%";
helper.getRange("L2:L3").format.numberFormat = "#,##0";

dashboard.getRange("B20:J21").merge();
dashboard.getRange("B20").values = [["Top 10 States by Population"]];
dashboard.getRange("B20:J21").format = { fill: theme.title2, font: { bold: true, size: 13, color: "#FFFFFF" }, horizontalAlignment: "center" };
const popChart = dashboard.charts.add("bar", helper.getRange("A1:B11"));
popChart.title = "Population 2011";
popChart.hasLegend = false;
popChart.xAxis = { axisType: "textAxis" };
popChart.yAxis = { numberFormatCode: "#,##0,," };
popChart.setPosition("B22", "J39");

dashboard.getRange("L20:T21").merge();
dashboard.getRange("L20").values = [["Top 10 by Population Density"]];
dashboard.getRange("L20:T21").format = { fill: theme.accent2, font: { bold: true, size: 13, color: "#FFFFFF" }, horizontalAlignment: "center" };
const densityChart = dashboard.charts.add("bar", helper.getRange("E1:F11"));
densityChart.title = "People per km2";
densityChart.hasLegend = false;
densityChart.xAxis = { axisType: "textAxis" };
densityChart.yAxis = { numberFormatCode: "#,##0" };
densityChart.setPosition("L22", "T39");

dashboard.getRange("B42:J43").merge();
dashboard.getRange("B42").values = [["Most Urbanized States/UTs"]];
dashboard.getRange("B42:J43").format = { fill: theme.gold, font: { bold: true, size: 13, color: "#FFFFFF" }, horizontalAlignment: "center" };
const urbanChart = dashboard.charts.add("bar", helper.getRange("H1:I11"));
urbanChart.title = "Urban population share";
urbanChart.hasLegend = false;
urbanChart.xAxis = { axisType: "textAxis" };
urbanChart.yAxis = { numberFormatCode: "0%" };
urbanChart.setPosition("B44", "J55");

dashboard.getRange("L42:T43").merge();
dashboard.getRange("L42").values = [["Rural / Urban Population"]];
dashboard.getRange("L42:T43").format = { fill: theme.title, font: { bold: true, size: 13, color: "#FFFFFF" }, horizontalAlignment: "center" };
const splitChart = dashboard.charts.add("doughnut", helper.getRange("K1:L3"));
splitChart.title = "India split";
splitChart.hasLegend = true;
splitChart.setPosition("L44", "T55");

source.showGridLines = false;
source.getRange("A1:T1").format = { fill: theme.title, font: { bold: true, color: "#FFFFFF" } };
source.getRange("A2:T38").format = { font: { color: theme.text } };
source.getRange("C2:F38").format.numberFormat = "#,##0";
source.getRange("I2:K38").format.numberFormat = "#,##0";
source.getRange("L2:L38").format.numberFormat = "#,##0";
source.getRange("D2:D38").format.numberFormat = "0.00";
source.getRange("O2:O38").format.numberFormat = "0.000";
source.getRange("T2:T38").format.numberFormat = "0.0%";
source.freezePanes.freezeRows(1);

const preview = await workbook.render({
  sheetName: "Dashboard",
  range: "A1:V55",
  scale: 1,
  format: "png",
});
await fs.writeFile(`${outputDir}/dashboard_preview.png`, new Uint8Array(await preview.arrayBuffer()));

const inspect = await workbook.inspect({
  kind: "table,drawing",
  range: "Dashboard!A1:T17",
  include: "values,formulas",
  tableMaxRows: 18,
  tableMaxCols: 20,
  maxChars: 7000,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 200 },
  summary: "final formula error scan",
  maxChars: 3000,
});
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
