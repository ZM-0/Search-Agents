import express from "express";
import fileSystem from "node:fs/promises";
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
// Handle requests for the list of maps
application.get("/maps", (request, response) => {
    const directory = path.join(url.fileURLToPath(import.meta.url), "../../maps");
    console.log(`Sending directory ${directory}`);
    fileSystem.readdir(directory).then((maps) => {
        response.send(maps.map((name) => `Map ${name.slice(3, -4)}`));
    });
});
// Handle requests for a map
application.get("/maps/:mapId", (request, response) => {
    const mapPath = path.join(url.fileURLToPath(import.meta.url), `../../maps/map${request.params["mapId"]}.map`);
    console.log(`Sending map ${request.params["mapId"]}`);
    fileSystem.readFile(mapPath).then((mapFile) => {
        response.send(mapFile.toString());
    });
});
// Handle requests for files
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
