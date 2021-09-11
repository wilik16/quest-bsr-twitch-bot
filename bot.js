const tmi = require('tmi.js');
const fetch = require('node-fetch');
const fs = require(`fs`);
const sanitize = require(`sanitize-filename`);
const http = require('https');
const config = require('./config');

const client = new tmi.client({
    identity: { username: config.bot_options.username, password: config.bot_options.password },
    channels: [config.bot_options.channel]
});
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
        client.say(channel, config.message.manual);
    }
    return true;
}

function fetchMapInfo(mapId, username, channel) {
    const url = `https://api.beatsaver.com/maps/id/${mapId}`;

    fetch(url, { method: "GET", headers: { 'User-Agent': config.user_agent }})
        .then(res => res.json())
        .then(info => {
            const versions = info.versions[0]
            const downloadUrl = versions.downloadURL;
            const fileName = sanitize(`${info.id} ${username} ${info.metadata.levelAuthorName} (${info.name}).zip`);
            const message = `@${username} requested "${info.metadata.songAuthorName}" - "${info.name}" by "${info.metadata.levelAuthorName}" (${info.id}). Successfully added to the queue.`;
            download(downloadUrl, fileName, message, channel);
        })
        .catch(err => console.log(err));
}

async function download(url, fileName, message, channel) {
    const res = await fetch(url, { headers: { 'User-Agent': config.user_agent } });

    await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(`maps/${fileName}`);
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