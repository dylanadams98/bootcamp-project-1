// to get the function to return something, i cannot use the fetch(url).then(response).then(data) approach,
// instead, i have to use async + await, otherwise nothing will return.
// basically, fetch(url) will return a promise that is yet to be fulfilled, and then await let you to wait for its fulfillment
async function getStockData(stocksTicker, from, to) {
  const APIKEY = "79G4QU6AaADL93J2chBjRQKru3lIvD8z";
  const Aggregates = "https://api.polygon.io/v2/aggs/ticker";
  const multiplier = 1;
  const timespan = "day"; //set the unit time to be 1 day

var= dayjs();

  var url = `${Aggregates}/${stocksTicker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${APIKEY}`;

  var response = await fetch(url);
  var data = await response.json();

  //study the structure of the response in https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to
  return data.results;
}

//this function can get information of the stock, for example icon
async function getStockInfo(stocksTicker) {
  const APIKEY = "79G4QU6AaADL93J2chBjRQKru3lIvD8z";
  const TicketDetails = "https://api.polygon.io/v3/reference/tickers";

  var url = `${TicketDetails}/${stocksTicker}?apiKey=${APIKEY}`;

  var response = await fetch(url);
  var data = await response.json();

  return data.results.branding.logo_url + `?apiKey=${APIKEY}`;
}

//this function can get news about a stock
async function getNews(stocksTicker, from, to) {
  const APIKEY = "3f365a6bc42242c98bd807aa869036d5";
  const Everything = "https://newsapi.org/v2/everything";

  var url = `${Everything}?q=${stocksTicker}&from=${from}&to=${to}&sortBy=publishedAt&apiKey=${APIKEY}&pageSize=5&language=en`;
  //language=en means only get news in english, sortBy=publishedAt means sort by the publish date, pageSize=5 means only get 5 news

  var response = await fetch(url);
  var data = await response.json();

  return data.articles;
}

const stockNameField = $("#stockInput");
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

searchBtn.on("click", async () => {
  stockPanel.empty(); //might be there are other information on display, makes the panel empty by clicking each the button
  newsPanel.empty();

  var stockName = stockNameField.val();
  var startDate = startDateField.val();
  var endDate = endDateField.val();

  var logoURL = await getStockInfo(stockName);
   name(params) {
  
 } getStockData(stockName, startDate, endDate).then(function (stockData) {
    var logoImg = $("<img>");
    logoImg.attr("src", logoURL);
    logoImg.css("height", "30px");
    logoImg.appendTo(stockPanel);

// for loop
    // for (var i = 0; i < stockData.length; i++) {
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
 seperate this into two different functions 
 get rid of the .then function
  getNews(stockName, startDate, endDate).then(function (newsData) {
 var logoImg = $("<img>");
  logoImg.attr("src", logoURL);
  logoImg.css("height", "30px");
  logoImg.appendTo(newsPanel);

  // for loop
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

// need to adjust variables in order to combine with HTML
