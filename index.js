
const wheel = document.getElementById("wheel"),
  spinBtn = document.getElementById("spin-btn"),
  finalValue = document.getElementById("final-value");

// Values of min and max angle for each slice
const rotationValues = [
  { minDegree: 0, maxDegree: 60, value: 2 },
  { minDegree: 61, maxDegree: 120, value: 6 },
  { minDegree: 121, maxDegree: 180, value: 5 },
  { minDegree: 181, maxDegree: 240, value: 4 },
  { minDegree: 241, maxDegree: 300, value: 3 },
  { minDegree: 301, maxDegree: 360, value: 2 },
];

// Pie chart data
const data = [6, 16, 16, 16, 16, 16];

// Background color of slices
const pieColors = [
  "#ff6188",
  "#fc9867",
  "#ffd866",
  "#a9dc76",
  "#78dce8",
  "#ab9df2",
];

// Pie chart for the wheel (6 slices)
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: [1, 2, 3, 4, 5, 6], // Labels showing numbers
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#000",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 30 },
      },
    },
  },
});

// Restricted range for "1" (we rig it to avoid landing on 1)
const restrictedFrom = 61;
const restrictedTo = 120;

// Function to get a safe random degree that won't land on the "1" sector
const getSafeRandomDegree = () => {
  let degree;
  // We will loop until we find a degree that is not in the restricted range (for "1")
  do {
    degree = Math.floor(Math.random() * 360);
  } while (degree >= restrictedFrom && degree <= restrictedTo); // Keep looping if it lands within the restricted range
  return degree;
};

// Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;

  let randomDegree = getSafeRandomDegree(); // Get a valid random degree

  // Spinner Count
  let count = 0;
  let resultValue = 101;

  // Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();

    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue = Math.max(resultValue - 5, 1); // Prevent negative values
      myChart.options.rotation %= 360; // Keep rotation within 0-359
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
      spinBtn.disabled = false; // Re-enable the spin button
    }
  }, 5);
});

// Simulation Test to Verify Rigging (Runs Automatically)
let testSpins = 1000; // Number of test spins
let landedOnOne = 0; // This should remain 0 since value "1" is removed

for (let i = 0; i < testSpins; i++) {
  let randomDegree = Math.floor(Math.random() * 360);

  // Check if it landed on "1" (which no longer exists)
  for (let range of rotationValues) {
    if (randomDegree >= range.minDegree && randomDegree <= range.maxDegree) {
      if (range.value === 1) {
        landedOnOne++;
      }
      break;
    }
  }
}

// Log results
console.log(`Total test spins: ${testSpins}`);
console.log(`Times landed on 1: ${landedOnOne}`);
console.log(`Probability of landing on 1: ${(landedOnOne / testSpins) * 100}%`);
