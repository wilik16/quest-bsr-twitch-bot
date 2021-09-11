const tmi = require('tmi.js');
const fetch = require('node-fetch');
const fs = require(`fs`);
const sanitize = require(`sanitize-filename`);
const http = require('https');
const { exec } = require("child_process");
const extract = require('extract-zip');
const {resolve} = require("path");
const config = require('./config');

const adb = `${config.adb_folder}/adb`;
var questConnected = false;
var questIpAddress = ``;

const client = new tmi.client({
    identity: { username: config.bot_options.username, password: config.bot_options.password },
    channels: [config.bot_options.channel]
});
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);
client.connect();

if (config.enable_automatic_upload_to_quest) {
    getIpAddress();
}

function getIpAddress() {
    console.log(`- Getting Quest IP Address...(make sure the Quest is connected via cable)`);
    exec(`${adb} shell ip addr show wlan0`, (error, stdout, stderr) => {
        if (error) {
            console.log(`- [IP]error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`- [IP]stderr: ${stderr}`);
            return;
        }
        const r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        const ipAddress = stdout.match(r);
        console.log(`- Quest IP Address: ${ipAddress}`);
        adbConnect(ipAddress);
    });
}

function adbConnect(ipAddress) {
    console.log(`- Connecting to Quest wirelessly...`)
    exec(`${adb} tcpip 5555 && adb connect ${ipAddress}:5555`, (error, stdout, stderr) => {
        if (error) {
            console.log(`- [CO]error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`- [CO]stderr: ${stderr}`);
            return;
        }
        console.log(`- [CO]output: ${stdout}`);
        if (stdout.includes('connected to')) {
            questConnected = true;
            questIpAddress = ipAddress;
            console.log(`- Quest connected wirelessly, now you can unplug the cable if you want`)
        }
    });
}

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

    console.log(`* Getting map info...`);
    fetch(url, { method: "GET", headers: { 'User-Agent': config.user_agent }})
        .then(res => res.json())
        .then(info => {
            const versions = info.versions[0]
            const downloadUrl = versions.downloadURL;
            const fileName = sanitize(`${info.id} ${username} ${info.metadata.levelAuthorName} (${info.name}).zip`);
            const message = `@${username} requested "${info.metadata.songAuthorName}" - "${info.name}" by "${info.metadata.levelAuthorName}" (${info.id}). Successfully added to the queue.`;
            download(downloadUrl, fileName, versions.hash, message, channel);
        })
        .catch(err => console.log(err));
}

async function download(url, fileName, hash, message, channel) {
    await new Promise((resolve, reject) => {
        console.log(`* Downloading map...`);
        const mapsFolder = `maps`;
        if (!fs.existsSync(mapsFolder)){
            fs.mkdirSync(mapsFolder);
        }
        const filePath = `${mapsFolder}/${fileName}`;
        const fileStream = fs.createWriteStream(filePath);
            http.get(`${url}`, function(response) {
                response.pipe(fileStream);
            });
        fileStream.on("finish", function() {
            console.log(`* Downloaded "${fileName}"`);
            client.say(channel, message);
            if (questConnected) {
                extractZip(hash, filePath);
            }
            resolve();
        });
    });
}

async function extractZip(hash, source) {
    try {
        await extract(source, { dir: resolve(`tmp/${hash}`) });
        pushMapToQuest(hash);
    } catch (err) {
        console.log("* Oops: extractZip failed", err);
    }
}

function pushMapToQuest(hash) {
    console.log(`- Uploading to Quest...`)
    exec(`${adb} -s ${questIpAddress}:5555 push tmp\\${hash} /sdcard/ModData/com.beatgames.beatsaber/Mods/SongLoader/CustomLevels/${hash}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`- [PU]error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`- [PU]stderr: ${stderr}`);
            return;
        }
        // console.log(`- [PU]output: ${stdout}`);
        console.log(`- Map uploaded to Quest`);
        fs.rmdir(`tmp/${hash}`, { recursive: true }, (err) => {
            if (err) { 
                console.log(`- [EX]error: ${err.message}`); 
            }
        });
    });
}