const searchBtn = document.getElementById("search-button");
var chartContainer = document.getElementById("myChart");
var stockChart;
var tickerHistory = [];

async function DisplayStockData(stocksTicker, from, to) {
  stockChart = document.createElement("canvas");

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
            borderColor: '#4C5CA2',
          },
          {
            label: "Open",
            data: open,
            borderWidth: 2,
            borderColor: '#8A6FC4',
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

var newsPanel = $("#newsPanel");

async function getNews(stocksTicker, from, to) {
  const APIKEY = "3f365a6bc42242c98bd807aa869036d5";
  const Everything = "https://newsapi.org/v2/everything";

  var url = `${Everything}?q=${stocksTicker}&from=${from}&to=${to}&sortBy=publishedAt&apiKey=${APIKEY}&pageSize=5&language=en`;
  //language=en means only get news in english, sortBy=publishedAt means sort by the publish date, pageSize=5 means only get 5 news

  var response = await fetch(url);
  var data = await response.json();

  return data.articles;
}

searchBtn.addEventListener("click", async function () {
  newsPanel.empty()
  chartContainer.removeChild(chartContainer.firstChild);

  var stockName = document.getElementById("stock-input").value;
  var startDate = document.getElementById("start-date-input").value;
  var endDate = document.getElementById("end-date-input").value;

  localStorage.setItem("stockName", stockName);
  localStorage.setItem("startDate", startDate);
  localStorage.setItem("endDate", endDate);

  DisplayStockData(stockName, startDate, endDate);

  getNews(stockName, startDate, endDate).then(function (newsData) {

    for (var i = 0; i < newsData.length; i++) {
      var newsDate = $("<h3></h3>");
      newsDate.text(`${newsData[i].publishedAt.slice(0, 10)}`);
      var newsTitle = $("<p></p>");
      newsTitle.text(`${newsData[i].title},`);
      var newsURL = $("<a></a>");
      newsURL.text(newsData[i].url);
      newsURL.attr("href", newsData[i].url);
      newsDate.appendTo(newsPanel);
      newsTitle.appendTo(newsPanel);
      newsURL.appendTo(newsPanel);
    }
  });
});

window.addEventListener("load", function() {
  var strdStockName = localStorage.getItem("stockName");
  var strdStartDate = localStorage.getItem("startDate");
  var strdEndDate = localStorage.getItem("endDate");

  if (strdStockName && strdStartDate && strdEndDate){
    document.getElementById("stock-input").value = strdStockName;
    document.getElementById("start-date-input").value = strdStartDate;
    document.getElementById("end-date-input").value = strdEndDate;

    DisplayStockData(strdStockName, strdStartDate, strdEndDate);

    getNews(strdStockName, strdStartDate, strdEndDate).then(function (newsData) {

      for (var i = 0; i < newsData.length; i++) {
        var newsDate = $("<h3></h3>");
        newsDate.text(`${newsData[i].publishedAt.slice(0, 10)}`);
        var newsTitle = $("<p></p>");
        newsTitle.text(`${newsData[i].title},`);
        var newsURL = $("<a></a>");
        newsURL.text(newsData[i].url);
        newsURL.attr("href", newsData[i].url);
        newsDate.appendTo(newsPanel);
        newsTitle.appendTo(newsPanel);
        newsURL.appendTo(newsPanel);

    }
    console.log(newsTitle)
  });

  }
});