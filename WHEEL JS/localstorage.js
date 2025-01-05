const resultsList = document.getElementById('results-list');
const clearResultsBtn = document.getElementById('clear-results-btn');
const backBtn = document.getElementById('back-btn');

// Function to display stored results
const displayStoredResults = () => {
  let results = JSON.parse(localStorage.getItem('results')) || [];
  resultsList.innerHTML = '';
  results.forEach((result, index) => {
    const li = document.createElement('li');
    li.textContent = result;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      results.splice(index, 1);
      localStorage.setItem('results', JSON.stringify(results));
      displayStoredResults();
    });
    li.appendChild(deleteBtn);
    resultsList.appendChild(li);
  });
};

// Function to clear all stored results
const clearStoredResults = () => {
  localStorage.removeItem('results');
  displayStoredResults();
};

// Event listener for clearing results
clearResultsBtn.addEventListener('click', clearStoredResults);

// Event listener for navigating back to the main page
backBtn.addEventListener('click', () => {
  window.location.href = 'index.html'; // Change 'index.html' to the name of your main page
});

// Display stored results on page load
window.onload = displayStoredResults;