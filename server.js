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

    if (
        req.url === "/" ||
        req.url.includes(".js") ||
        req.url.includes(".css")
    ) {
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

    if (req.url.includes("api/steamId/")) {
        // DOC: This route is used to search for a Steam profile ID by vanity endpoint, returns the profile (an id) or false.
        const id = returnId(req.url);
        const PROFILE_ID = await searchSteamIdProfile(id);

        res.end(JSON.stringify(PROFILE_ID));
    }

    if (req.url.includes("api/steamIdOwnedGames/")) {
        const id = returnId(req.url);
        const GAMES = await getSteamIdOwnedGames(id);

        res.end("meows meows, " + id);
    }
});

app.listen(process.env.port, () => {
    console.log(`Server listening on port ${process.env.port}`);
});

async function searchSteamIdProfile(steamId) {
    const VANITY_URL = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.api_key}&vanityurl=${steamId}`;
    const response = await fetch(VANITY_URL);
    const data = await response.json();

    console.warn(data.response.steamid);
    console.warn(data.response.success);

    if (data.response.success === 42) return false;
    return data.response.steamid;
}

async function getSteamIdOwnedGames(steamId) {}

const returnId = (url) => {
    const steam_url = url.split("/");
    const id = steam_url[steam_url.length - 1];

    return id;
};
