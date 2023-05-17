const chartContainer = document.getElementById('MyChart');

// API
async function getStockData(stocksTicker, from, to) {
  const APIKEY = '79G4QU6AaADL93J2chBjRQKru3lIvD8z';
  const apiUrl = "https://api.polygon.io/v2/aggs/ticker";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const results = data. results;

    const labels = data.map(entry => entry.date);
    const values = data.map(entry => entry.price);

    // the chart
    const chart = new Chart(chartContainer, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Stock Price',
          data: values,
          borderColor: 'blue',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
}

getStockData('AAPL', '2023-01-01', '2023-05-01');

