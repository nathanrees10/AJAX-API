const http = require("http");
const fs = require("fs");

function routing(req, res) {
    // Move data array inside routing function
    const data = [
        "Siamese", "Persian", "Maine Coon", "Bengal", "Scottish Fold",
        "British Shorthair", "Sphynx", "Abyssinian", "American Shorthair",
        "Russian Blue", "Ragdoll", "Devon Rex", "Birman", "Siberian",
        "Manx", "Exotic Shorthair", "Burmese", "Tonkinese", "Savannah", "Himalayan"
    ];

    const url = req.url;
    const method = req.method;

    if (url === "/data") {
        if (method === "GET") {
            // Respond with the list of cats in JSON format
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(data));
        } else if (method === "POST") {
            let body = '';

            // Collect the incoming data
            req.on("data", chunk => {
                body += chunk;
            });

            // Process the data once received
            req.on("end", () => {
                try {
                    const catData = JSON.parse(body);
                    if (catData.cat) {
                        data.push(catData.cat); // Add new cat breed to the data array
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "Cat added successfully", data }));
                    } else {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Invalid data format" }));
                    }
                } catch (error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid JSON format" }));
                }
            });
        }
    } else if (url === "/login") {
        if (method === "POST") {
            res.write("Login");
            res.end();
        }
    } else if (url === "/client") {
        if (method === "GET") {
            const filename = "client.html";
            fs.readFile(filename, "binary", (err, file) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ error: err }));
                    res.end();
                    return;
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(file, "binary");
                res.end();
            });
        }
    } else {
        res.write("No matching page");
        res.end();
    }
}

http.createServer(routing).listen(3000, () => {
    console.log("Server started at port 3000");
});
