// Import API Key and Spreadsheet ID from config.js
import { API_KEY, SHEET_ID } from './config.js';

const RANGE = 'Sheet1'; // Specify the range or sheet name as needed
const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

let wordData = [];
let currentFontClass = "open-sans-regular"; // Default font class

// Fetch data from Google Sheets
fetch(SHEET_URL)
  .then(response => response.json())
  .then(data => {
    console.log("Fetched data:", data); // Log data to check if it's being fetched
    if (data && data.values) {
      wordData = data.values.flat(); // Flatten array if data is nested in rows
      updateWordCloud(); // Initialize the word cloud with fetched data
    } else {
      console.error("No data found in the specified Google Sheets range.");
    }
  })
  .catch(error => console.error('Error fetching data:', error));

// Set up SVG for the word cloud
const width = 600;
const height = 300;
const svg = d3.select("#wordCloud").append("svg")
              .attr("width", width)
              .attr("height", height)
              .style("border", "1px solid #ccc");

// Function to update and draw the word cloud
function updateWordCloud() {
  svg.selectAll("*").remove(); // Clear any existing words

  d3.layout.cloud()
    .size([width, height])
    .words(wordData.map(word => ({ text: word, size: 20 + Math.random() * 30 })))
    .padding(5)
    .fontSize(d => d.size)
    .rotate(() => 0)
    .on("end", draw)
    .start();
}

// Draw function to render words with the selected font class
function draw(words) {
  svg.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .attr("class", currentFontClass) // Apply the selected font class
    .style("font-family", "Arial, sans-serif") // Fallback font in case class fails
    .style("font-size", d => `${d.size}px`)
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
    .text(d => d.text);
}

// Event listener for font selection dropdown
document.getElementById("fontSelector").addEventListener("change", (event) => {
  currentFontClass = event.target.value; // Get selected font class

  // Update font class of the word cloud dynamically
  document.getElementById("wordCloud").className = currentFontClass; // Apply selected font to container
  updateWordCloud(); // Re-render word cloud with new font
});

// Event listeners for sliders (if they need to trigger an update)
document.getElementById("slider1").addEventListener("input", updateWordCloud);
document.getElementById("slider2").addEventListener("input", updateWordCloud);
document.getElementById("slider3").addEventListener("input", updateWordCloud);
