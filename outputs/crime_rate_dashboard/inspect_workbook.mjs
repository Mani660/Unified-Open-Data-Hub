import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Manish/OneDrive/Desktop/All_Data_Consolidated.xlsx";
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const summary = await workbook.inspect({
  kind: "workbook,sheet,table,region",
  maxChars: 18000,
  tableMaxRows: 10,
  tableMaxCols: 14,
  tableMaxCellChars: 120,
});

console.log(summary.ndjson);
