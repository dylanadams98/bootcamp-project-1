const searchBtn = document.getElementById("search-button");
const clearBtn = document.getElementById("clear-button");

var chartContainer = document.getElementById("myChart");
var newsPanel = document.getElementById("newsPanel");
var historyPanel = document.getElementById("historyPanel");

async function DisplayStockData(stocksTicker, from, to) {
  while (chartContainer.firstChild) {
    chartContainer.removeChild(chartContainer.firstChild);
  }

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
  } catch (error) {
    console.log(`Error fetching stock : ${error}`);
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
}

function DisplayHistory(stockNameArr, startDateArr, endDateArr) {
  while (historyPanel.firstChild) {
    historyPanel.removeChild(historyPanel.firstChild);
  }

  for (var i = 0; i < stockNameArr.length; i++) {
    var historyBtn = document.createElement("button");
    historyBtn.setAttribute("class", "news-box");

    var stockName = document.createElement("h3");
    stockName.textContent = stockNameArr[i];

    var period = document.createElement("p");
    period.textContent = `from ${startDateArr[i]} to ${endDateArr[i]}`;

    historyBtn.appendChild(stockName);
    historyBtn.appendChild(period);

    historyBtn.setAttribute("style", "border-radius: 10px; width: 95%");

    historyBtn.addEventListener("click", function () {
      DisplayStockData(stockNameArr[i], startDateArr[i], endDateArr[i]);
      DisplayNews(stockNameArr[i], startDateArr[i], endDateArr[i]);
    });

    historyPanel.appendChild(historyBtn);
    historyPanel.setAttribute("style", "height: 80vh; overflow: auto;");
  }
}

clearBtn.addEventListener("click", function () {
  localStorage.removeItem("stockName");
  localStorage.removeItem("startDate");
  localStorage.removeItem("endDate");
});

searchBtn.addEventListener("click", async function () {
  //chikin's code, make localStorage stores array of search history.
  var stockNameArr = [];
  if (localStorage.getItem("stockName")) {
    stockNameArr = JSON.parse(localStorage.getItem("stockName"));
  }

  var startDateArr = [];
  if (localStorage.getItem("startDate")) {
    startDateArr = JSON.parse(localStorage.getItem("startDate"));
  }

  var endDateArr = [];
  if (localStorage.getItem("endDate")) {
    endDateArr = JSON.parse(localStorage.getItem("endDate"));
  }

  //hasan's code
  var stockName = document.getElementById("stock-input").value;
  var startDate = document.getElementById("start-date-input").value;
  var endDate = document.getElementById("end-date-input").value;

  stockNameArr.push(stockName);
  startDateArr.push(startDate);
  endDateArr.push(endDate);

  localStorage.setItem("stockName", JSON.stringify(stockNameArr));
  localStorage.setItem("startDate", JSON.stringify(startDateArr));
  localStorage.setItem("endDate", JSON.stringify(endDateArr));

  DisplayHistory(stockNameArr, startDateArr, endDateArr);
  DisplayStockData(stockName, startDate, endDate);
  DisplayNews(stockName, startDate, endDate);
});

window.addEventListener("load", function () {
  var stockNameArr = [];
  if (localStorage.getItem("stockName")) {
    stockNameArr = JSON.parse(localStorage.getItem("stockName"));
  }

  var startDateArr = [];
  if (localStorage.getItem("startDate")) {
    startDateArr = JSON.parse(localStorage.getItem("startDate"));
  }

  var endDateArr = [];
  if (localStorage.getItem("endDate")) {
    endDateArr = JSON.parse(localStorage.getItem("endDate"));
  }

  DisplayHistory(stockNameArr, startDateArr, endDateArr);
});
