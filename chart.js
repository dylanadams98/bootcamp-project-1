// //this function can get news about a stock
// async function getNews(stocksTicker, from, to) {
//     const APIKEY = "3f365a6bc42242c98bd807aa869036d5";
//     const Everything = "https://newsapi.org/v2/everything";
  
//     var url = `${Everything}?q=${stocksTicker}&from=${from}&to=${to}&sortBy=publishedAt&apiKey=${APIKEY}&pageSize=5&language=en`;
//     //language=en means only get news in english, sortBy=publishedAt means sort by the publish date, pageSize=5 means only get 5 news
  
//     var response = await fetch(url);
//     var data = await response.json();
  
//     return data.articles;
//   }

var ctx = document.getElementById("myChart").getContext('2d');

// messing with chart js
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Tokyo",	"Mumbai",	"Mexico City",	"Shanghai",	"Sao Paulo",	"New York",	"Karachi","Buenos Aires",	"Delhi","Moscow"],
        datasets: [{
            label: 'Series 1', // Name the series
            data: [500,	50,	2424,	14040,	14141,	4111,	4544,	47,	5555, 6811], // Specify the data values array
            fill: false,
            borderColor: '#2196f3', // Add custom color border (Line)
            backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
            borderWidth: 1 // Specify bar border width
        }]},
    options: {
      responsive: true, // Instruct chart js to respond nicely.
      maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
    }
});
  