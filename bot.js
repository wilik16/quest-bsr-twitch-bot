const tmi = require('tmi.js');
const fetch = require('node-fetch');
const fs = require(`fs`);
const sanitize = require(`sanitize-filename`);
const http = require('https');

const USER_AGENT = `YOUR_USER_AGENT/1.0.0`; // define your own User-Agent https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
const BSR_MESSAGE = `To request song, find a song at bsaber.com and click on twitch logo under a song to copy the code, then paste in the chat. I made a video guide here https://imgur.com/a/a0s0qqa`;
const BOT_OPTIONS = {
    identity: {
        username: "Your Bot Username",
        password: "Your Bot Oauth Token"
    },
    channels: ["Your Channel"]
}; // follow this docs on how to retrieve these 3 variables https://dev.twitch.tv/docs/irc

const client = new tmi.client(BOT_OPTIONS);
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);
client.connect();

function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

function onMessageHandler(channel, tags, rawMessage, self) {
    if (self || rawMessage.charAt(0) != '!') { return; }

    console.log(`======\n* Received "${rawMessage}"`);
    const message = rawMessage.trim();
    const username = tags.username;

    if (processBsr(message, username, channel)) { 
    } else { console.log(`* This command is not handled`); }
}

function processBsr(message, username, channel) {
    const command = `!bsr`;
    if (!message.startsWith(command)) { return false; }

    const arg = message.slice(command.length + 1);
    if (message.charAt(command.length) == ` ` && arg.length > 0) {
        fetchMapInfo(arg, username, channel);
    } else {
        client.say(channel, BSR_MESSAGE);
    }
    return true;
}

function fetchMapInfo(mapId, username, channel) {
    const url = `https://api.beatsaver.com/maps/id/${mapId}`;

    fetch(url, { method: "GET", headers: { 'User-Agent': USER_AGENT }})
        .then(res => res.json())
        .then(info => {
            const versions = info.versions[0]
            const downloadUrl = versions.downloadURL;
            const fileName = sanitize(`${info.key} ${username} ${info.metadata.levelAuthorName} (${info.name}).zip`);
            const message = `@${username} requested "${info.metadata.songAuthorName}" - "${info.name}" by "${info.metadata.levelAuthorName}" (${info.key}). Successfully added to the queue.`;
            download(downloadUrl, fileName, message, channel);
        })
        .catch(err => console.log(err));
}

async function download(url, fileName, message, channel) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });

    await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(`${fileName}`);
            const request = http.get(`${url}`, function(response) {
              response.pipe(fileStream);
            });
        fileStream.on("finish", function() {
            console.log(`* Downloaded "${fileName}"`);
            client.say(channel, message);
            resolve();
        });
    });
}