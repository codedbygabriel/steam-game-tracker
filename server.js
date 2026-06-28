const http = require("http");
const filesystem = require("fs");
const path = require("path");

function loadEnv() {
    const _path = path.join(__dirname, ".env");
    try {
        const datablock = filesystem.readFileSync(_path, "utf-8");
        const linedBlock = datablock.split("\n");
        linedBlock.forEach((line) => {
            const [k, v] = line.split("=");
            process.env[k] = v;
        });
    } catch (error) {
        console.warn("Failed to load/parse .env");
    }
}

loadEnv();

const app = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === "/" || req.url.includes(".js") || req.url.includes(".css")) {
        const filePath = req.url === "/" ? "index.html" : req.url.substring(1);

        const _path = path.join(__dirname, filePath);
        const content = filesystem.readFileSync(_path, "utf-8");

        const ext = path.extname(_path); // Get the file extension (I wanna learn more about that later.)
        const mimeTypes = {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
        };

        res.writeHead(200, { "Content-Type": mimeTypes[ext] });
        res.end(content);
        return;
    }

    if (req.url.includes("api/urlToId/")) {
        // This route should only be accessed by passing a URL to convert to ID;
        const userId = await urlToId(req.url);
        res.end(JSON.stringify(userId));
    }

    if (req.url.includes("api/idDetails/")) {
        const data = await idDetails(req.url);
        res.end(JSON.stringify(data));
    }

    if (req.url.includes("api/getIdGames/")) {
        const games = await getIdGames(req.url);
        res.end(JSON.stringify(games));
    }
});

app.listen(process.env.port, () => {
    console.log(`Server listening on port ${process.env.port}`);
});

const urlToId = async (url) => {
    const regex_id = /^7656119[0-9]{10}$/;
    const urlParts = url.split("/").filter(Boolean);
    const username = urlParts[urlParts.length - 1];

    if (regex_id.test(username)) return username;

    const URL = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.api_key}&vanityurl=${username}`;
    try {
        const response = await fetch(URL);
        const data = await response.json();

        switch (data.response.success) {
            case 1:
                return data.response.steamid;
                break;
            case 42:
            default:
                return false;
        }
    } catch (e) {
        console.error("LOG ERROR:", e);
    }
};
const idDetails = async (url) => {
    const idParts = url.split("/").filter(Boolean);
    const steamId = idParts[idParts.length - 1];
    const URL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.api_key}&steamids=${steamId}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        return data.response.players[0];
    } catch (e) {
        console.error(e);
    }
};
const getIdGames = async (url) => {
    const idParts = url.split("/").filter(Boolean);
    const steamId = idParts[idParts.length - 1];
    const URL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.api_key}&steamid=${steamId}&include_appinfo=true`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        console.log(data);
        return data.response.games;
    } catch (e) {
        console.error(e);
    }
};
