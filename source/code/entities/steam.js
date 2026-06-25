"use strict";

export class Steam {
    constructor() {
        this.STEAM_ID = null;
        this.R_STEAM_ID = /^7656119[0-9]{10}$/;
    }

    validateSteamId(SEARCH_INPUT) {
        let IS_URl = false;
        let IS_SteamId = false;

        // TODO: Create a method to catch user ID via URL
        if (SEARCH_INPUT.value.includes("steamcommunity.com")) IS_URl = true;
        if (this.R_STEAM_ID.test(SEARCH_INPUT.value)) IS_SteamId = true;

        if (!(IS_URl || IS_SteamId)) {
            console.error(`${SEARCH_INPUT.value} is not a valid Steam ID`);
            return false;
        }

        console.warn(`${SEARCH_INPUT.value} is a valid Steam ID`);
        this.STEAM_ID = SEARCH_INPUT.value;

        return true;
    }
}
