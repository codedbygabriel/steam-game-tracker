"use strict";

export class Steam {
    R_STEAM_ID = /^7656119[0-9]{10}$/;
    STEAM_ID = false;

    async validateSteamId(SEARCH_INPUT) {
        let IS_URL = false;
        let IS_SteamId = false;

        // DONE: Create a method to catch user ID via URL
        if (SEARCH_INPUT.value.includes("steamcommunity.com")) IS_URL = true;
        if (this.R_STEAM_ID.test(SEARCH_INPUT.value)) IS_SteamId = true;

        if (!(IS_URL || IS_SteamId)) {
            // TODO: Create a alert to inform the user that the input is not a valid Steam ID
            console.error(`${SEARCH_INPUT.value} is not a valid Steam ID`);
            return false;
        }

        if (IS_URL || IS_SteamId)
            console.warn(
                `${SEARCH_INPUT.value} is about to be converted to a Steam ID / tested.`,
            );

        this.STEAM_ID = IS_URL
            ? await this.#URLToSteamId(SEARCH_INPUT.value)
            : SEARCH_INPUT.value;

        if (this.STEAM_ID === false) return false;
        return true;
    }

    async #URLToSteamId(url) {
        const _url = url.split("/");

        // Sometimes, if the steam URl ends with "/" the algorithm may return a empty string.
        let steamId;
        if (_url[_url.length - 1] === "") steamId = _url[_url.length - 2];
        else steamId = _url[_url.length - 1];

        const response = await fetch(
            `http://localhost:3030/api/steamId/${steamId}`,
        );

        const data = await response.json();
        if (data !== 42) return data;

        return false;
    }

    async getSteamIdOwnedGames() {}

    get steamId() {
        return this.STEAM_ID;
    }
}
