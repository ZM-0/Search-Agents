import express from "express";
import fileSystem from "node:fs/promises";
import path from "node:path";
import url from "node:url";


const HOST: string = "localhost";
const PORT: number = 8000;
const application: express.Application = express();


// Convert request bodies to text
application.use(express.text());


// Log server reqeusts
application.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log(`Received ${request.method} request for ${request.path}`);
    
    if ("PUT" === request.method || "POST" === request.method) {
        console.log("Request body:");
        console.log(request.body);
    }

    next();
});


// Handle requests for the list of maps
application.get("/maps", (request: express.Request, response: express.Response) => {
    const directory: string = path.join(url.fileURLToPath(import.meta.url), "../../maps");

    console.log(`Sending directory ${directory}`);

    fileSystem.readdir(directory).then((maps: string[]) => {
        response.send(maps.map((name: string) => `Map ${name.slice(3, -4)}`));
    });
});


// Handle requests to get a map
application.get("/maps/:mapId", (request: express.Request, response: express.Response) => {
    const mapPath: string = path.join(
        url.fileURLToPath(import.meta.url),
        `../../maps/map${request.params["mapId"]}.map`
    );

    console.log(`Sending map ${request.params["mapId"]}`);

    fileSystem.readFile(mapPath).then((mapFile: Buffer) => {
        response.send(mapFile.toString());
    });
});


// Handle requests to set a map
application.put("/maps/:mapId", (request: express.Request, response: express.Response) => {
    const mapPath: string = path.join(
        url.fileURLToPath(import.meta.url),
        `../../maps/map${request.params["mapId"]}.map`
    );

    console.log(`Saving map ${request.params["mapId"]}:`);
    const mapString: string = request.body;
    console.log(mapString);

    fileSystem.writeFile(mapPath, mapString).then(() => {
        console.log(`Saved map ${request.params["mapId"]}`);
        response.end();
    });
});


// Handle requests for files
application.get(/.+/, (request: express.Request, response: express.Response) => {
    const filePath: string = path.join(
        url.fileURLToPath(import.meta.url),
        "..",
        "/" === request.path ? "../source/client.html" :
        "/client.css" === request.path ? "../source/client.css" :
        request.path
    );

    console.log(`Sending file ${filePath}`);

    response.sendFile(filePath, (error: Error) => {
        if (error) console.log(error);
        else console.log(`Sent file ${filePath}`);
    });
});


application.listen(PORT, HOST, () => console.log(`Server listening on ${HOST}:${PORT}...`));