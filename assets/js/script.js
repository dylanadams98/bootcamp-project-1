const searchBtn = document.getElementById("search-button");
const clearBtn = document.getElementById("clear-button");

var chartContainer = document.getElementById("myChart");
var newsPanel = document.getElementById("newsPanel");
var historyPanel = document.getElementById("historyPanel");

var stockSuccess = true;
var newsSuccess = true;

function CreateChart(labels, close, open) {
  var stockChart = document.createElement("canvas");

  new Chart(stockChart, {
    type: "line",
    data: {
      labels: labels,

      datasets: [
        {
          label: "Close",
          data: close,
          borderWidth: 2,
          borderColor: "#4C5CA2",
        },
        {
          label: "Open",
          data: open,
          borderWidth: 2,
          borderColor: "#8A6FC4",
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
}

async function DisplayStockData(stocksTicker, from, to) {
  while (chartContainer.firstChild) {
    chartContainer.removeChild(chartContainer.firstChild);
  }

  const APIKEY = "79G4QU6AaADL93J2chBjRQKru3lIvD8z";
  const Aggregates = "https://api.polygon.io/v2/aggs/ticker";

  var url = `${Aggregates}/${stocksTicker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${APIKEY}`;

  try {
    var response = await fetch(url);
    var data = await response.json();

    const labels = data.results.map((entry) => dayjs(entry.t).format("M/D"));
    const open = data.results.map((entry) => entry.o);
    const close = data.results.map((entry) => entry.c);

    var chartTitle = document.createElement("h2");
    chartTitle.textContent = `${stocksTicker} (${from} to ${to})`;

    chartContainer.appendChild(chartTitle);
    CreateChart(labels, close, open);

    stockSuccess = true;
  } catch (error) {
    var errorMsg = document.createElement("h1");
    errorMsg.textContent = `Error fetching stock : ${error}`;
    chartContainer.appendChild(errorMsg);
    stockSuccess = false;
  }
}

async function getNews(stocksTicker, from, to) {
  const APIKEY = "3f365a6bc42242c98bd807aa869036d5";
  const Everything = "https://newsapi.org/v2/everything";

  var url = `${Everything}?q=${stocksTicker}&from=${from}&to=${to}&sortBy=publishedAt&apiKey=${APIKEY}&language=en`;

  var response = await fetch(url);
  var data = await response.json();

  return data.articles;
}

async function DisplayNews(stocksTicker, from, to) {
  while (newsPanel.firstChild) {
    newsPanel.removeChild(newsPanel.firstChild);
  }

  try {
    const newsData = await getNews(stocksTicker, from, to);

    for (var i = 0; i < newsData.length; i++) {
      var newsBox = document.createElement("div");
      newsBox.setAttribute("class", "news-box");

      var newsDate = document.createElement("h3");
      newsDate.textContent = `${newsData[i].publishedAt.slice(0, 10)}`;

      var newsTitle = document.createElement("p");
      newsTitle.textContent = `${newsData[i].title}`;

      var newsURL = document.createElement("a");
      newsURL.textContent = "Link to the news";
      newsURL.setAttribute("href", newsData[i].url);

      newsBox.appendChild(newsDate);
      newsBox.appendChild(newsTitle);
      newsBox.appendChild(newsURL);

      newsBox.setAttribute("style", "border-radius: 10px");

      newsPanel.appendChild(newsBox);
      newsPanel.setAttribute("style", "height: 80vh; overflow: auto;");
    }
    newsSuccess = true;
  } catch (error) {
    var errorMsg = document.createElement("h1");
    errorMsg.textContent = `Error fetching news : ${error}`;
    chartContainer.appendChild(errorMsg);
    newsSuccess = false;
  }
}

function updateTickerHistory(tickerHistory) {
  while (historyPanel.firstChild) {
    historyPanel.removeChild(historyPanel.firstChild);
  }

  for (var i = tickerHistory.length - 1; i >= 0; i--) {
    var historyBox = document.createElement("button");
    historyBox.setAttribute("class", "history-box");

    var stockName = document.createElement("h3");
    stockName.textContent = tickerHistory[i];

    historyBox.appendChild(stockName);

    historyBox.setAttribute("data-stock", tickerHistory[i]);

    historyBox.setAttribute("style", "border-radius: 10px; width: 95%");

    historyBox.addEventListener("click", function () {
      const stockName = this.dataset.stock;

      const startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
      const endDate = dayjs().format("YYYY-MM-DD");

      DisplayStockData(stockName, startDate, endDate);
      DisplayNews(stockName, startDate, endDate);
    });

    historyPanel.appendChild(historyBox);
    historyPanel.setAttribute("style", "height: 80vh; overflow: auto;");
  }
}

clearBtn.addEventListener("click", function () {
  localStorage.removeItem("tickerHistory");
  updateTickerHistory([]);
});

searchBtn.addEventListener("click", async function () {
  stockSuccess = true;
  newsSuccess = true;

  var tickerHistory = [];
  if (localStorage.getItem("tickerHistory")) {
    tickerHistory = JSON.parse(localStorage.getItem("tickerHistory"));
  }

  var stockName = document.getElementById("stock-input").value;
  var startDate = document.getElementById("start-date-input").value;
  tickerHistory;
  var endDate = document.getElementById("end-date-input").value;

  await DisplayStockData(stockName, startDate, endDate);
  await DisplayNews(stockName, startDate, endDate);

  if (stockSuccess && newsSuccess && !tickerHistory.includes(stockName)) {
    tickerHistory.push(stockName);
    localStorage.setItem("tickerHistory", JSON.stringify(tickerHistory));
    updateTickerHistory(tickerHistory);
  }
});

window.addEventListener("DOMContentLoaded", function () {
  stockSuccess = true;
  newsSuccess = true;

  var tickerHistory = [];
  if (localStorage.getItem("tickerHistory")) {
    tickerHistory = JSON.parse(localStorage.getItem("tickerHistory"));
  }

  if (tickerHistory.length > 0) {
    const stockName = tickerHistory[tickerHistory.length - 1];
    const startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
    const endDate = dayjs().format("YYYY-MM-DD");

    document.getElementById("stock-input").value = stockName;
    document.getElementById("start-date-input").value = startDate;
    document.getElementById("end-date-input").value = endDate;

    DisplayStockData(stockName, startDate, endDate);

    DisplayNews(stockName, startDate, endDate);

    updateTickerHistory(tickerHistory);
  } else {
    const startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
    const endDate = dayjs().format("YYYY-MM-DD");

    DisplayStockData("AAPL", startDate, endDate);
    DisplayNews("AAPL", startDate, endDate);
  }
});
