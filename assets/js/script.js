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
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });

  chartContainer.appendChild(stockChart);
}

async function getStockData(stocksTicker, from, to) {
  const APIKEY = "79G4QU6AaADL93J2chBjRQKru3lIvD8z";
  const Aggregates = "https://api.polygon.io/v2/aggs/ticker";

  var url = `${Aggregates}/${stocksTicker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${APIKEY}`;

  var response = await fetch(url);

  if (response.status == 200) {
    var data = await response.json();

    return {
      code: response.status,
      arr: data.results,
    };
  } else {
    return {
      code: response.status,
      arr: [],
    };
  }
}

async function DisplayStockData(stocksTicker, from, to) {
  while (chartContainer.firstChild) {
    chartContainer.removeChild(chartContainer.firstChild);
  }

  const dataObj = await getStockData(stocksTicker, from, to);

  if (dataObj.code == 200 && dataObj.arr) {
    data = dataObj.arr;
    if (data.length > 1) {
      const labels = data.map((entry) => dayjs(entry.t).format("M/D"));
      const open = data.map((entry) => entry.o);
      const close = data.map((entry) => entry.c);

      var chartTitle = document.createElement("h2");
      chartTitle.textContent = `${stocksTicker} (${from} to ${to})`;

      chartContainer.appendChild(chartTitle);
      CreateChart(labels, close, open);

      stockSuccess = true;
    } else {
      var errorMsg = document.createElement("h1");
      errorMsg.textContent = "Chart cannot be created";
      chartContainer.appendChild(errorMsg);
      stockSuccess = false;
    }
  } else {
    var errorMsg = document.createElement("h1");
    errorMsg.textContent =
      "There is an error fetching stock. Check if the stock name is correct, and the start date and end date are reasonable.";
    chartContainer.appendChild(errorMsg);
    stockSuccess = false;
  }
}

async function getNews(stocksTicker, from, to) {
  const APIKEY = "3f365a6bc42242c98bd807aa869036d5";
  const Everything = "https://newsapi.org/v2/everything";

  var url = `${Everything}?q=${stocksTicker}%stock&from=${from}&to=${to}&sortBy=publishedAt&apiKey=${APIKEY}&language=en`;

  var response = await fetch(url);

  if (response.status == 200) {
    var data = await response.json();

    return {
      code: response.status,
      arr: data.articles,
    };
  } else {
    return {
      code: response.status,
      arr: [],
    };
  }
}

function createNewsBox(data) {
  var dates = [];
  var index = [];

  for (var i = 0; i < data.length; i++) {
    var date = data[i].publishedAt.slice(0, 10);
    if (!dates.includes(date)) {
      dates.push(date);
      index.push(i);
    }
  }

  for (var i = 0; i < data.length; i++) {
    var newsBox = document.createElement("div");
    newsBox.setAttribute("class", "news-box");

    if (index.includes(i)) {
      var newsDate = document.createElement("h3");
      newsDate.textContent = `${data[i].publishedAt.slice(0, 10)}`;
      newsPanel.appendChild(newsDate);
    }

    var newsTitle = document.createElement("h4");
    newsTitle.textContent = `${data[i].title}`;

    var newsURL = document.createElement("a");
    newsURL.textContent = "Link to the news";
    newsURL.setAttribute("href", data[i].url);
    newsURL.setAttribute("target", "_blank");

    newsBox.appendChild(newsTitle);
    newsBox.appendChild(newsURL);

    newsBox.setAttribute("style", "border-radius: 10px");

    newsPanel.appendChild(newsBox);
    newsPanel.setAttribute("style", "height: 80vh; overflow: auto;");
  }
}

async function DisplayNews(stocksTicker, from, to) {
  while (newsPanel.firstChild) {
    newsPanel.removeChild(newsPanel.firstChild);
  }

  const newsObj = await getNews(stocksTicker, from, to);

  if (newsObj.code == 200 && newsObj.arr && stockSuccess) {
    data = newsObj.arr;
    if (data.length > 0) {
      createNewsBox(data);
      newsSuccess = true;
    } else {
      var errorMsg = document.createElement("h1");
      errorMsg.textContent = "No news can be fetched";
      newsPanel.appendChild(errorMsg);
      newsSuccess = false;
    }
  } else {
    var errorMsg = document.createElement("h1");
    errorMsg.textContent =
      "There is an error fetching news. Check if the stock name is correct, and the start date and end date are reasonable.";
    newsPanel.appendChild(errorMsg);
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

    historyBox.textContent = tickerHistory[i];

    historyBox.setAttribute("data-stock", tickerHistory[i]);

    historyBox.setAttribute("style", "border-radius: 10px; width: 95%;");

    historyBox.addEventListener("click", async function () {
      const stockName = this.dataset.stock;

      const startDate = dayjs().subtract(14, "day").format("YYYY-MM-DD");
      const endDate = dayjs().format("YYYY-MM-DD");

      await DisplayStockData(stockName, startDate, endDate);
      await DisplayNews(stockName, startDate, endDate);
    });

    historyPanel.appendChild(historyBox);
    historyPanel.setAttribute("style", "overflow: auto;");
  }
}

clearBtn.addEventListener("click", function () {
  localStorage.removeItem("tickerHistory");
  updateTickerHistory([]);
});

function errorWithoutInput() {
  while (chartContainer.firstChild) {
    chartContainer.removeChild(chartContainer.firstChild);
  }

  while (newsPanel.firstChild) {
    newsPanel.removeChild(newsPanel.firstChild);
  }

  var errorMsg = document.createElement("h1");
  errorMsg.textContent =
    "Check if you have entered the stock name and selected the start date and end date.";

  chartContainer.appendChild(errorMsg);
}

searchBtn.addEventListener("click", async function () {
  stockSuccess = true;
  newsSuccess = true;

  var tickerHistory = [];
  if (localStorage.getItem("tickerHistory")) {
    tickerHistory = JSON.parse(localStorage.getItem("tickerHistory"));
  }

  var stockName = document.getElementById("stock-input").value;
  var startDate = document.getElementById("start-date-input").value;
  var endDate = document.getElementById("end-date-input").value;

  document.getElementById("stock-input").value = "";
  document.getElementById("start-date-input").value = "";
  document.getElementById("end-date-input").value = "";

  if (stockName && startDate && endDate) {
    await DisplayStockData(stockName, startDate, endDate);
    await DisplayNews(stockName, startDate, endDate);

    if (stockSuccess && newsSuccess && !tickerHistory.includes(stockName)) {
      tickerHistory.push(stockName);
      localStorage.setItem("tickerHistory", JSON.stringify(tickerHistory));
      updateTickerHistory(tickerHistory);
    }
  } else {
    errorWithoutInput();
  }
});

window.addEventListener("DOMContentLoaded", async function () {
  stockSuccess = true;
  newsSuccess = true;

  var tickerHistory = [];
  if (localStorage.getItem("tickerHistory")) {
    tickerHistory = JSON.parse(localStorage.getItem("tickerHistory"));
  }

  if (tickerHistory.length > 0) {
    const stockName = tickerHistory[tickerHistory.length - 1];
    const startDate = dayjs().subtract(14, "day").format("YYYY-MM-DD");
    const endDate = dayjs().format("YYYY-MM-DD");

    await DisplayStockData(stockName, startDate, endDate);
    await DisplayNews(stockName, startDate, endDate);

    updateTickerHistory(tickerHistory);
  } else {
    const startDate = dayjs().subtract(14, "day").format("YYYY-MM-DD");
    const endDate = dayjs().format("YYYY-MM-DD");

    await DisplayStockData("AAPL", startDate, endDate);
    await DisplayNews("AAPL", startDate, endDate);
  }
});
