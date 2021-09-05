# Quest BSR Twitch Bot
This bot will automatically download custom songs requested by viewers on twitch chat to `songs` folder, then you as the streamer can upload all the downloaded songs manually via BMBF.

You can see this bot in action when I'm live at https://www.twitch.tv/wiuwwiuw (please do follow if you like the content :) )

## Background
This is intended for twitch streamer who streams Oculus Quest version of Beat Saber, I made this because I need a solution for song request via bsr command even though the current Beat Saber Oculus Quest mod doesn't have runtime song loader yet. So the approach is to at least have an ability to retrieve chat request and download it automatically to my PC, then I can upload all the downloaded songs in one go instead of downloading it manually one by one (in which the viewer will wait for you to download and upload it to the Quest).

If you are using PC version of Beat Saber, it's recommended to use "Song Request Manager" mod instead that can be installed via [ModAssistant](https://github.com/Assistant/ModAssistant), it's better and easier to set up.

## Installation
Install [npm](https://www.npmjs.com/get-npm) first, then

```bash
npm install
```

## Setup
Update value of `USER_AGENT` and `BOT_OPTIONS` (optionally `BSR_MESSAGE`) in `bot.js`

Then run
```bash
node bot.js
```

Try to send a bsr command chat in your `CHANNEL_NAME` chat (for example `!bsr bd45`), the bot will automatically download the zip and save it to `/song` folder. After the download is finished, the bot will send back to chat informing that the song is added to the queue.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. If you want to give feedback only, let me know by opening an issue too.

Updated to the new beatsaver api by joshcubes
