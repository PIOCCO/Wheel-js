const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const customTextInput = document.getElementById('custom-text');
const addTextBtn = document.getElementById('add-text-btn');
const updateTextBtn = document.getElementById('update-text-btn');
const deleteTextBtn = document.getElementById('delete-text-btn');
const labelIndexInput = document.getElementById('label-index');
const resultsList = document.getElementById('results-list');

const ROTATION_VALUES = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
];

let labels = [];
let data = [];
let pieColors = [];
let rotation = 0;

const myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: labels,
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
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

const updateChart = () => {
  myChart.data.labels = labels;
  myChart.data.datasets[0].data = data;
  myChart.data.datasets[0].backgroundColor = pieColors;
  myChart.update();
};

const valueGenerator = (angleValue) => {
  let currentLabel = "";
  for (let i = 0; i < ROTATION_VALUES.length; i++) {
    if (angleValue >= ROTATION_VALUES[i].minDegree && angleValue <= ROTATION_VALUES[i].maxDegree) {
      currentLabel = labels[i] || "No Label";
      break;
    }
  }
  finalValue.innerHTML = `<p>Result: ${currentLabel}</p>`;
  spinBtn.disabled = false;

  // Store the result in local storage
  let results = JSON.parse(localStorage.getItem('results')) || [];
  results.push(currentLabel);
  localStorage.setItem('results', JSON.stringify(results));

  // Update the displayed results
  displayStoredResults();
};

const spinWheel = () => {
  if (labels.length === 0) {
    finalValue.innerHTML = `<p>Please add labels before spinning the wheel.</p>`;
    return;
  }

  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;

  const randomDegree = Math.floor(Math.random() * 360) + 360 * 5; // Spin at least 5 times
  rotation += randomDegree;
  wheel.style.transition = 'transform 5s ease-out';
  wheel.style.transform = `rotate(${rotation}deg)`;

  setTimeout(() => {
    const finalAngle = rotation % 360;
    const segmentAngle = 360 / labels.length;
    const winningIndex = Math.floor(finalAngle / segmentAngle);
    valueGenerator(finalAngle);
    spinBtn.disabled = false;
  }, 5000);
};

const addLabel = () => {
  const customText = customTextInput.value.trim();
  if (customText) {
    labels.push(customText);
    data.push(16);
    pieColors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
    updateChart();
    customTextInput.value = '';
  }
};

const updateLabel = () => {
  const index = parseInt(labelIndexInput.value);
  const customText = customTextInput.value.trim();
  if (!isNaN(index) && index >= 0 && index < labels.length && customText) {
    labels[index] = customText;
    updateChart();
    customTextInput.value = '';
    labelIndexInput.value = '';
  }
};

const deleteLabel = () => {
  const index = parseInt(labelIndexInput.value);
  if (!isNaN(index) && index >= 0 && index < labels.length) {
    labels.splice(index, 1);
    data.splice(index, 1);
    pieColors.splice(index, 1);
    updateChart();
    labelIndexInput.value = '';
  }
};

const displayStoredResults = () => {
  let results = JSON.parse(localStorage.getItem('results')) || [];
  resultsList.innerHTML = '';
  results.forEach(result => {
    const li = document.createElement('li');
    li.textContent = result;
    resultsList.appendChild(li);
  });
};

spinBtn.addEventListener("click", spinWheel);
addTextBtn.addEventListener('click', addLabel);
updateTextBtn.addEventListener('click', updateLabel);
deleteTextBtn.addEventListener('click', deleteLabel);

// Display stored results on page load
window.onload = displayStoredResults;