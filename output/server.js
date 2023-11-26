import express from "express";
import fileSystem from "node:fs/promises";
import path from "node:path";
import url from "node:url";
const HOST = "localhost";
const PORT = 8000;
const application = express();
// Get the file path for a map
function getMapPath(mapId) {
    return path.join(url.fileURLToPath(import.meta.url), `../../maps/map${mapId}.map`);
}
// Convert request bodies to text
application.use(express.text());
// Log server reqeusts
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
    console.log(`Sending maps directory ${directory}...`);
    fileSystem.readdir(directory).then((maps) => {
        response.send(maps.map((name) => `Map ${name.slice(3, -4)}`));
        console.log("Sent maps directory");
    });
});
// Handle requests to get a map
application.get("/maps/:mapId", (request, response) => {
    console.log(`Sending map ${request.params["mapId"]}...`);
    fileSystem.readFile(getMapPath(request.params["mapId"])).then((mapFile) => {
        response.send(mapFile.toString());
        console.log(`Sent map ${request.params["mapId"]}`);
    });
});
// Handle requests to set a map
application.put("/maps/:mapId", (request, response) => {
    console.log(`Saving map ${request.params["mapId"]}...`);
    const mapString = request.body;
    console.log(mapString);
    fileSystem.writeFile(getMapPath(request.params["mapId"]), mapString).then(() => {
        console.log(`Saved map ${request.params["mapId"]}`);
        response.end();
    });
});
// Handle requests to delete a map
application.delete("/maps/:mapId", (request, response) => {
    console.log(`Deleting map ${request.params["mapId"]}...`);
    fileSystem.rm(getMapPath(request.params["mapId"])).then(() => {
        console.log(`Deleted map ${request.params["mapId"]}`);
        response.end();
    });
});
// Handle requests for files
application.get(/.+/, (request, response) => {
    const filePath = path.join(url.fileURLToPath(import.meta.url), "..", "/" === request.path ? "../source/client.html" :
        "/client.css" === request.path ? "../source/client.css" :
            request.path);
    console.log(`Sending file ${filePath}...`);
    response.sendFile(filePath, (error) => {
        if (error)
            console.log(error);
        else
            console.log(`Sent file ${filePath}`);
    });
});
application.listen(PORT, HOST, () => console.log(`Server listening on ${HOST}:${PORT}...`));
