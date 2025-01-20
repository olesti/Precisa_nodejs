// Node.js program to read data from a serial port
const { SerialPort } = require("serialport");
const ReadlineParser = require("@serialport/parser-readline");
const express = require("express");
const cors = require("cors");
const { printReceipt } = require("./print.js");
var bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
const portApp = 5000;
let latestData = "";
const portName = "COM3";
const port = new SerialPort({
  baudRate: 9600, // Adjust the baud rate as needed
  autoOpen: true,
  path: "COM3",

});

function extractFirstFloat(str) {
  const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
  return match ? parseFloat(match[0]) : null;
}
port.setEncoding("ascii");

const parser = port.pipe(new ReadlineParser.ReadlineParser());
// Listen for data
parser.on("data", (data) => {
  latestData = data;
});
port.on("error", (err) => {
  console.error(`Error: ${err.message}`);
});

port.on("close", () => {
  console.log("Port closed.");
});

app.get("/Weight", (req, res) => {
  // res.status(200).send("0.0");
  if (latestData) {
    const floatNumbers = extractFirstFloat(latestData);

    res.status(200).send("0.0");
    // res.status(200).send(floatNumbers.toString());
  } else {
    res.status(500).json({ error: "No data available or not received yet" });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  // health check
  res.status(200).send("Tarti calisiyor");
});


// Printer'i calistirir
app.post("/print", async (req, res) => {
  const { orderId, count, weight, purity } = req.body;
console.log(req.query,req.body,req.params)
  if (!orderId || !count || !weight || !purity ) {
    return res.status(400).json({
      error: "Missing required parameters. Please provide orderId, count, weight, purity, and timestamp"
    });
  }

  try {
    const printData = {
      orderId,
      count,
      weight,
      purity,
      timestamp: new Date().toLocaleString()
    };

   await printReceipt(printData);
    res.status(200).json({ message: "Print job sent successfully" });
  } catch (error) {
    console.error("Print error:", error);
    res.status(500).json({ error: "Failed to print receipt" });
  }
});

app.listen(portApp, () => {
  console.log(`Example app listening on port ${portApp}`);
});