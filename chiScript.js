async function getStockData(stocksTicker, from, to) {
  const APIKEY = "79G4QU6AaADL93J2chBjRQKru3lIvD8z";
  const Aggregates = "https://api.polygon.io/v2/aggs/ticker";
  const multiplier = 1;
  const timespan = "day";

  var url = `${Aggregates}/${stocksTicker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${APIKEY}`;

  var response = await fetch(url);
  var data = await response.json();

  /*for (var i = 0; i < data.results.length; i++) {
    result = data.results[i];
    stockData.push({
      time: dayjs(result.t).format("YYYY-MM-DD"),
      open: result.o,
      close: result.c,
    });
  }*/

  return data.results;
}

function getStockInfo(stocksTicker) {
  const APIKEY = "79G4QU6AaADL93J2chBjRQKru3lIvD8z";
  const TicketDetails = "https://api.polygon.io/v3/reference/tickers";

  var url = `${TicketDetails}/${stocksTicker}?apiKey=${APIKEY}`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(`Company name is ${data.results.name}`);
      console.log(
        `The link of logo is ${
          data.results.branding.logo_url + `?apiKey=${APIKEY}`
        }.`
      );
      console.log(
        `The link of icon is ${
          data.results.branding.icon_url + `?apiKey=${APIKEY}`
        }.`
      );
    });
}

async function getNews(stocksTicker, from, to) {
  const APIKEY = "3f365a6bc42242c98bd807aa869036d5";
  const Everything = "https://newsapi.org/v2/everything";

  var url = `${Everything}?q=${stocksTicker}&from=${from}&to=${to}&sortBy=publishedAt&apiKey=${APIKEY}&pageSize=5&language=en`;

  var response = await fetch(url);
  var data = await response.json();

  /*fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i < data.articles.length; i++) {
        article = data.articles[i];
        console.log(article.publishedAt);
        console.log(`The title is ${article.title}.`);
        console.log(`The author is ${article.author}.`);
      }
    });*/

  return data.articles;
}

const stockNameField = $("#stockName");
const startDateField = $("#startDate");
const endDateField = $("#endDate");

const searchBtn = $("#search");

const mainBody = $("#mainBody");
mainBody.css("display", "flex");

const stockPanel = $("#stockPanel");
stockPanel.css("background-color", "lightBlue");
stockPanel.css("border-radius", "10pt");
stockPanel.css("padding", "10pt");
stockPanel.css("margin", "10pt");

const newsPanel = $("#newsPanel");
newsPanel.css("background-color", "lightBlue");
newsPanel.css("border-radius", "10pt");
newsPanel.css("padding", "10pt");
newsPanel.css("margin", "10pt");

searchBtn.on("click", () => {
  var stockName = stockNameField.val();
  var startDate = startDateField.val();
  var endDate = endDateField.val();

  getStockData(stockName, startDate, endDate).then(function (stockData) {
    for (var i = 0; i < stockData.length; i++) {
      var stockDate = $("<p></p>");
      stockDate.text(`On ${dayjs(stockData[i].t).format("YYYY-MM-DD")},`);
      var stockOpen = $("<p></p>");
      stockOpen.text(`open price is $${stockData[i].o},`);
      var stockClose = $("<p></p>");
      stockClose.text(`close price is $${stockData[i].c}.`);
      stockDate.appendTo(stockPanel);
      stockOpen.appendTo(stockPanel);
      stockClose.appendTo(stockPanel);
    }
  });

  getNews(stockName, startDate, endDate).then(function (newsData) {
    for (var i = 0; i < newsData.length; i++) {
      var newsDate = $("<p></p>");
      newsDate.text(`On ${newsData[i].publishedAt},`);
      var newsTitle = $("<p></p>");
      newsTitle.text(`the title is ${newsData[i].title},`);
      var newsURL = $("<a></a>");
      newsURL.text(newsData[i].url);
      newsURL.attr("href", newsData[i].url);
      newsDate.appendTo(newsPanel);
      newsTitle.appendTo(newsPanel);
      newsURL.appendTo(newsPanel);
    }
  });
});
