// Node.js program to read data from a serial port and expose printing endpoints

// --- Module Imports ---
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { printReceipt } = require("./print-pos.js");
const { printAppraisal } = require("./appraisal/print");
const { getPrinters } = require("pdf-to-printer");
const settings = require("./settings.json");

// --- Express App Setup ---
const app = express();
const portApp = 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// --- Serial Port Setup ---
const serialPortPath = "COM3";
let latestData = "";

const serialPort = new SerialPort({
  path: serialPortPath,
  baudRate: 9600,
  autoOpen: true,
});

serialPort.setEncoding("ascii");

const parser = serialPort.pipe(new ReadlineParser());
parser.on("data", (data) => {
  latestData = data;
});

serialPort.on("error", (err) => {
  console.error(`Serial port error: ${err.message}`);
});

serialPort.on("close", () => {
  console.log("Serial port closed.");
});

// --- Utility Function ---
const extractFirstFloat = (str) => {
  const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
  return match ? parseFloat(match[0]) : null;
};

// --- Endpoints ---

// GET /Weight: Returns weight data
app.get("/Weight", (req, res) => {
  if (latestData) {
    const weight = extractFirstFloat(latestData);
    return res.status(200).send(weight.toString());
  } else {
    return res.status(500).json({ error: "No data available or not received yet" });
  }
});

// POST /print: Endpoint to print a receipt
app.post("/print", async (req, res) => {
  const { orderId, count, weight, purity } = req.body;
  if (!orderId || !count || !weight || !purity) {
    return res.status(400).json({
      error: "Missing required parameters. Please provide orderId, count, weight, and purity.",
    });
  }

  try {
    const printData = {
      orderId,
      count,
      weight,
      purity,
      timestamp: new Date().toLocaleString(),
    };

    await printReceipt(printData);
    return res.status(200).json({ message: "Print job sent successfully" });
  } catch (error) {
    console.error("Print error:", error);
    return res.status(500).json({ error: "Failed to print receipt" });
  }
});

// POST /print-appraisal: Endpoint to print an appraisal
app.post("/print-appraisal", async (req, res) => {
  // List of required fields for appraisal printing
  const requiredFields = [
    "preparedForName",
    "appraisalDate",
    "certificateNumber",
    "itemDescription",
    "gemstoneType",
    "caratWeight",
    "centerGemstoneDescription",
    "material",
    "metalColor",
    "totalCaratWeight",
    "itemWeight",
    "estimatedValue",
    "productImageUrl",
  ];

  // Check if any required field is missing
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length) {
    return res.status(400).json({
      error: `Missing required parameter(s): ${missingFields.join(", ")}`
    });
  }

  try {
    await printAppraisal(req.body);
    return res.status(200).json({ message: "Appraisal printed successfully" });
  } catch (error) {
    console.error("Print appraisal error:", error);
    return res.status(500).json({ error: "Failed to print appraisal" });
  }
});

// GET /: Health check endpoint that also returns system printer info
app.get("/", async (req, res) => {
  let systemPrinters = [];
  try {
    systemPrinters = await getPrinters();
  } catch (error) {
    console.error("Error getting printers:", error);
  }
  return res.status(200).json({
    systemPrinters,
    selectedPrinter: settings.AppraisalPrinterName,
  });
});


// --- Start the Server ---
app.listen(portApp, () => {
  console.log(`Server is running on port ${portApp}`);
});
