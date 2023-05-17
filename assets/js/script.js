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

  async function getStockData(stocksTicker, from, to) {
    const APIKEY = "79G4QU6AaADL93J2chBjRQKru3lIvD8z";
    const Aggregates = "https://api.polygon.io/v2/aggs/ticker";
    const multiplier = 1;
    const timespan = "day"; //set the unit time to be 1 day
  
    var url = `${Aggregates}/${stocksTicker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${APIKEY}`;
  
    var response = await fetch(url);
    var data = await response.json();
  
    //study the structure of the response in https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to
    return data.results;
  }