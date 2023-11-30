const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

///////////////////////////////////////////////////////
// fs module

// Blocking sync way
// const text = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);

// const textOut = `This is what We know about this: ${text}. \n created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);

// console.log("changes made");

// non blocking async way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile("./txt/read-this.txt", "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2} \n ${data3}`,
//         "utf-8",
//         (err) => {
//           console.log(err);
//         }
//       );
//     });
//   });

//   console.log("File written 🥱");
// });

// console.log("Hello bhau");

/////////////////////////////////////////////////////////
// HTTP server

//executed only once. So no need of async version

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  // console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(404, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    // console.log(cardsHtml);

    const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page Not Found<h1/>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
