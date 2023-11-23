import express from "express";
import path from "node:path";
import url from "node:url";


const HOST: string = "localhost";
const PORT: number = 8000;
const application: express.Application = express();


application.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log(`Received ${request.method} request for ${request.path}`);
    
    if ("PUT" === request.method || "POST" === request.method) {
        console.log("Request body:");
        console.log(request.body);
    }

    next();
});


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