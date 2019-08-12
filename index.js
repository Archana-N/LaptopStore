
/*
To start the application, type 'nodemon' in the Terminal
*/

const fileSystem = require('fs');
const http = require('http');
const url = require('url');

const jsonData = fileSystem.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(jsonData);
//console.log(laptopData);

const server = http.createServer((request, response) => {

    //const parsedString = url.parse(request.url, true);
    const pathName = url.parse(request.url, true).pathname;

    //const query = url.parse(request.url, true).query;

    const id = url.parse(request.url, true).query.id;

    // PRODUCTS OVERVIEW
    if(pathName === '/products' || pathName === '/') {
        response.writeHead(200, { 'Content-type': 'text/html'});
        //response.end('This is the PRODUCTS page!');

        fileSystem.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (error, overviewData) => {
                        
            let renderOverviewData = overviewData;
                
            fileSystem.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (error, cardData) => {

                const cardOutput = laptopData.map(element => replaceTemplate(cardData, element)).join('');
                
                renderOverviewData = overviewData.replace('{%CARDS%}', cardOutput);
                response.end(renderOverviewData);
            });                
        });
    }

    // LAPTOP DETAIL
    else if(pathName === '/laptop' && id < laptopData.length) {
        response.writeHead(200, { 'Content-type': 'text/html'});
        //response.end(`This is the LAPTOP page for laptop ${id}!`);

        fileSystem.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (error, data) => {
            
            const laptop = laptopData[id];            
            const output = replaceTemplate(data, laptop);

            response.end(output);
        });
    }

    // IMAGES ROUTING
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fileSystem.readFile(`${__dirname}/data/img${pathName}`, (error, imageData) => {
            response.writeHead(200, { 'Content-type' : 'text/html'});
            response.end(imageData);
        })
    }

    // URL NOT FOUND
    else {
        response.writeHead(404, { 'Content-type': 'text/html'});
        response.end('URL was not found on the server!');
    }
});

// URL to access the application- 127.0.0.1:1337
// URL of 'Products overview'- 127.0.0.1:1337/products
// URL of 'Laptop details'- 127.0.0.1:1337/laptop?id=1
server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});



const replaceTemplate = (originalHtml, laptop) => {    

    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}
