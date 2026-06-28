"use strict";

import { Steam } from "./entities/steam.js";

const wrapper = document.querySelector(".search-wrapper");
const searchInput = document.querySelector('input[name="search-steam-id"]');
const button = document.querySelector(".search-steam-button");
const gamesPanel = document.querySelector(".games-panel");
const mainContentWrapper = document.querySelector(".main-content");
const panelItems = document.querySelector(".panel-items");
const gamesPanelTitle = document.querySelector(".games-panel-title");
const searchHistory = document.querySelector(".search-history-list");
const possibleStatus = ["in_progress", "abandoned", "completed", "unplayed", "unregistered"];

function init(searchInput, wrapper, button, profiles) {
    searchInput.addEventListener("focus", () => wrapper.classList.add("focused-input"));
    searchInput.addEventListener("focusout", () => wrapper.classList.remove("focused-input"));
    button.addEventListener("click", async () => {
        await inputEventHandler(new Steam(), searchInput, profiles);
    });
    searchInput.addEventListener("keydown", async () => {
        if (event.key !== "Enter") return false;

        await inputEventHandler(new Steam(), searchInput, profiles);
    });
    window.addEventListener("beforeunload", () => {
        saveProfilesHistory(profiles);
    });
    if (profiles.length >= 1) startGamesPanel(profiles[0]);
}
const inputEventHandler = async (steam, searchInput, profiles) => {
    const response = await steam.validateSteamId(searchInput);

    if (!response.success) return false;

    const isDuplicate = profiles.some((profile) => profile.data.steamName === response.steamName);
    if (isDuplicate) return false;

    profiles.push(steam);
    saveProfilesHistory(profiles);
    updateSearchHistory(steam);
    startGamesPanel(steam);
};
async function startGamesPanel(steam) {
    mainContentWrapper.style.flexFlow = "row nowrap";
    mainContentWrapper.style.alignItems = "start";

    updateGamesPanel(steam);

    gamesPanel.classList.remove("hidden");
}
const updateGamesPanel = (steam) => {
    if (panelItems.hasChildNodes()) panelItems.innerHTML = "";

    gamesPanelTitle.innerText = `Observing Games From (${steam.data.steamRealName || steam.data.steamName})`;

    steam.data.games.forEach((game) => {
        const gameWrapper = document.createElement("section");
        const gameHeader = document.createElement("header");

        const gameTitle = document.createElement("h2");
        const gameImage = document.createElement("img");
        const baseURL = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

        const gamePlayTime = document.createElement("small");

        gameTitle.innerText = game?.status !== undefined ? `${game.name} (${possibleStatus[game.status]})` : game.name;
        const smallGameName = game.name.length >= 20 ? game.name.slice(0, 20) + "..." : game.name;

        gamePlayTime.innerText = `You have played ${smallGameName} for ${(game.playtime_forever / 60).toFixed(2)} hours.`;
        gameImage.src = baseURL;

        gameWrapper.classList.add("game-wrapper");
        gameHeader.classList.add("game-header");
        gameTitle.classList.add("game-title");
        gameTitle.addEventListener("click", () => {
            assignGameStatus(game, steam, gameTitle);
        });

        gameHeader.appendChild(gameImage);
        gameHeader.appendChild(gameTitle);

        gameWrapper.appendChild(gameHeader);
        gameWrapper.appendChild(gamePlayTime);

        panelItems.appendChild(gameWrapper);
    });
};
const assignGameStatus = (game, steam, title) => {
    if (game?.status === undefined) {
        game.status = possibleStatus.length - 1;
        title.innerText = `${game.name} (${possibleStatus[game.status]})`;
        return;
    }

    if (game.status >= possibleStatus.length || (game.status += 1) >= possibleStatus.length) {
        game.status = 0;
        title.innerText = `${game.name} (${possibleStatus[game.status]})`;
        return;
    }

    game.status += 1;
    title.innerText = `${game.name} (${possibleStatus[game.status]})`;
};
const updateSearchHistory = (steam) => {
    const searchHistoryItem = document.createElement("li");

    searchHistory.classList.add("search-history");

    searchHistoryItem.innerText = steam.data.steamRealName
        ? `${steam.data.steamName} (${steam.data.steamRealName})`
        : steam.data.steamName;
    searchHistoryItem.addEventListener("click", () => {
        updateGamesPanel(steam);
    });

    searchHistory.appendChild(searchHistoryItem);
};
const loadProfilesHistory = () => {
    const data = localStorage.getItem("_profiles");
    let parse;

    if (data) {
        parse = JSON.parse(data);
        parse.forEach((profile) => {
            updateSearchHistory(profile);
        });
    } else {
        parse = [];
    }
    return parse;
};
const saveProfilesHistory = (profiles) => {
    localStorage.setItem("_profiles", JSON.stringify(profiles));
};

(() => {
    const profiles = loadProfilesHistory();
    init(searchInput, wrapper, button, profiles);
})();
