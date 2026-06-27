"use strict";

export class Steam {
    R_STEAM_ID = /^7656119[0-9]{10}$/;
    data = {
        steamId: null,
        steamRealName: null,
        steamName: null,
        games: [],
    };

    async validateSteamId(SEARCH_INPUT) {
        let isURL = false;
        let isSteamId = false;
        const value = SEARCH_INPUT.value;

        if (value.includes("steamcommunity.com")) isURL = true;
        if (this.R_STEAM_ID.test(value)) isSteamId = true;

        if (!(isURL || isSteamId)) return false;

        if (isURL) {
            try {
                console.warn(`Fetching steamId for URL: ${value}`);
                const steamId = await fetch(`api/urlToId/${value}`);
                const data = await steamId.json();

                this.data.steamId = data;
            } catch (error) {
                console.error(error);
                return false;
            }
        } else {
            this.data.steamId = value;
        }

        await this.populateProfile();
        await this.populateGames();

        console.log(this.data);

        return { success: true, steamName: this.data.steamName };
    }
    async populateProfile() {
        const URL = `api/idDetails/${this.data.steamId}`;
        try {
            const response = await fetch(URL);
            const data = await response.json();

            this.data.steamRealName = data.realname || null;
            this.data.steamName = data.personaname || null;
        } catch (e) {
            console.error(e);
        }
    }
    async populateGames() {
        const URL = `api/getIdGames/${this.data.steamId}`;
        try {
            const response = await fetch(URL);
            const data = await response.json();

            this.data.games = data || [];
        } catch (e) {
            console.error(e);
        }
    }
}
