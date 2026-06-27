"use strict";

import { Steam } from "./entities/steam.js";

(() => {
    const wrapper = document.querySelector(".search-wrapper");
    const searchInput = document.querySelector('input[name="search-steam-id"]');
    const button = document.querySelector(".search-steam-button");
    const profiles = [];

    init(searchInput, wrapper, button, profiles);
})();

function init(searchInput, wrapper, button, profiles) {
    const steam = new Steam();

    searchInput.addEventListener("focus", () =>
        wrapper.classList.add("focused-input"),
    );
    searchInput.addEventListener("focusout", () =>
        wrapper.classList.remove("focused-input"),
    );
    button.addEventListener("click", async () => {
        await inputEventHandler(steam, searchInput, profiles);
    });
    searchInput.addEventListener("keydown", async () => {
        await inputEventHandler(steam, searchInput, profiles);
    });
}

const inputEventHandler = async (steam, searchInput, profiles) => {
    const response = await steam.validateSteamId(searchInput);
    if (!response) return false;

    profiles.push(steam);
    startGamesPanel(steam);
};

async function startGamesPanel(steam) {
    const gamesPanel = document.querySelector(".games-panel");
    const mainContentWrapper = document.querySelector(".main-content");
    const panelItems = document.querySelector(".panel-items");
    const gamesPanelTitle = document.querySelector(".games-panel-title");

    mainContentWrapper.style.flexFlow = "row nowrap";
    mainContentWrapper.style.alignItems = "start";
    gamesPanelTitle.innerText = `Observing Games From (${steam.data.steamRealName || steam.data.steamName})`;

    steam.data.games.forEach((game) => {
        const gameWrapper = document.createElement("div");
        const gameTitle = document.createElement("h2");
        const gamePlayTime = document.createElement("small");

        gameTitle.innerText = game.name;
        gamePlayTime.innerText = game.playtime_forever;

        gameWrapper.appendChild(gameTitle);
        gameWrapper.appendChild(gamePlayTime);
        panelItems.appendChild(gameWrapper);
    });

    gamesPanel.classList.remove("hidden");
}
