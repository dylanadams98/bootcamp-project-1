const searchBtn = document.getElementById("search-button");

var chartContainer = document.getElementById("myChart");

async function DisplayStockData(stocksTicker, from, to) {
  var stockChart = document.createElement("canvas");

  const APIKEY = "79G4QU6AaADL93J2chBjRQKru3lIvD8z";
  const Aggregates = "https://api.polygon.io/v2/aggs/ticker";
  //const multiplier = 1;
  //const timespan = "day";

  var url = `${Aggregates}/${stocksTicker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${APIKEY}`;

  try {
    var response = await fetch(url);
    var data = await response.json();

    const labels = data.results.map((entry) => dayjs(entry.t).format("M/D"));
    const open = data.results.map((entry) => entry.o);
    const close = data.results.map((entry) => entry.c);

    new Chart(stockChart, {
      type: "line",
      data: {
        labels: labels,

        datasets: [
          {
            label: "close",
            data: close,
            borderWidth: 4,
          },
          {
            label: "open",
            data: open,
            borderWidth: 4,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    chartContainer.appendChild(stockChart);
  } catch (error) {
    console.log(`Error fetching stock : ${error}`);
  }
}

searchBtn.addEventListener("click", async function () {
  chartContainer.removeChild(chartContainer.firstChild);

  var stockName = document.getElementById("stock-input").value;
  var startDate = document.getElementById("start-date-input").value;
  var endDate = document.getElementById("end-date-input").value;

  DisplayStockData(stockName, startDate, endDate);
});
