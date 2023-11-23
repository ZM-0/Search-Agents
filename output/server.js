import express from "express";
import path from "node:path";
import url from "node:url";
const HOST = "localhost";
const PORT = 8000;
const application = express();
application.use((request, response, next) => {
    console.log(`Received ${request.method} request for ${request.path}`);
    if ("PUT" === request.method || "POST" === request.method) {
        console.log("Request body:");
        console.log(request.body);
    }
    next();
});
application.get(/.+/, (request, response) => {
    const filePath = path.join(url.fileURLToPath(import.meta.url), "..", "/" === request.path ? "../source/client.html" :
        "/client.css" === request.path ? "../source/client.css" :
            request.path);
    console.log(`Sending file ${filePath}`);
    response.sendFile(filePath, (error) => {
        if (error)
            console.log(error);
        else
            console.log(`Sent file ${filePath}`);
    });
});
application.listen(PORT, HOST, () => console.log(`Server listening on ${HOST}:${PORT}...`));
