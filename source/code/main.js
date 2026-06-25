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

    SEARCH_INPUT.addEventListener("keydown", () => {
        if (!(event.key === "Enter")) return false;
        const isValidSteamId = Steam.validateSteamId(SEARCH_INPUT);

        if (!isValidSteamId) {
            SEARCH_INPUT.value = "Invalid Steam ID!!!";
            return false;
        }

        Steam.searchSteamIdProfile();
    });
}
