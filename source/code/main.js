"use strict";

import { Steam } from "./entities/steam.js";

(() => {
    const _Steam = new Steam();
    catchInputChange(_Steam);
})();

function catchInputChange(Steam) {
    const SEARCH_INPUT = document.querySelector(
        'input[name="search-steam-id"]',
    );

    SEARCH_INPUT.addEventListener("keydown", async () => {
        if (!(event.key === "Enter")) return false;
        await Steam.validateSteamId(SEARCH_INPUT);
        console.log(Steam.steamId);
    });
}
