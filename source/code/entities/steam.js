"use strict";

export class Steam {
    R_STEAM_ID = /^7656119[0-9]{10}$/;
    STEAM_ID = null;

    validateSteamId(SEARCH_INPUT) {
        let IS_URL = false;
        let IS_SteamId = false;

        // TODO: Create a method to catch user ID via URL
        if (SEARCH_INPUT.value.includes("steamcommunity.com")) IS_URL = true;
        if (this.R_STEAM_ID.test(SEARCH_INPUT.value)) IS_SteamId = true;

        if (!(IS_URL || IS_SteamId)) {
            // TODO: Create a alert to inform the user that the input is not a valid Steam ID
            console.error(`${SEARCH_INPUT.value} is not a valid Steam ID`);
            return false;
        }

        if (IS_URL) console.warn(`${SEARCH_INPUT.value} is a valid Steam ID`);

        this.STEAM_ID = IS_URL
            ? this.#URLToSteamId(SEARCH_INPUT.value)
            : SEARCH_INPUT.value;

        return true;
    }

    #URLToSteamId(url) {
        const _url = url.split("/");

        // Sometimes, if the steam URl ends with "/" the algorithm may return a empty string.
        if (_url[_url.length - 1] === "") return _url[_url.length - 2];
        return _url[_url.length - 1];
    }

    async searchSteamIdProfile() {
        const VANITY_URL = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${this.STEAM_ID}`;
    }
}
