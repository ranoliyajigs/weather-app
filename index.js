const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceval = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp-273.15).toFixed(2));
    temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min-273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max-273.15).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('http://api.openweathermap.org/data/2.5/weather?q=AHMEDABAD,IN&APPID=37756c34904ec705acb45ed871bfe1bd')
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0].main.temp);   
                const reatTimeData = arrData
                    .map((val) => replaceval(homeFile, val))
                    .join("");
                // console.log(val.main);
                res.write(reatTimeData);
                // console.log(reatTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
                // console.log('end');
            });

    }
});
server.listen(3000, "127.0.0.1");