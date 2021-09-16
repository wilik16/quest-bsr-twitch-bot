# Quest BSR Twitch Bot
Quest BSR Twitch Bot is an Oculus Quest Beat Saber song request bot that will download requested songs and optionally upload to the Quest automatically. If you choose to enable automatic upload feature, you will be able to play requested songs without leaving Beat Saber and opening BMBF.

Video of this bot in action:

[![VIDEO](http://img.youtube.com/vi/aQYtrmLr5RE/0.jpg)](http://www.youtube.com/watch?v=aQYtrmLr5RE "quest-bsr-twitch-bot in action")

## Background
This is intended for twitch streamer who streams Oculus Quest version of Beat Saber, I made this because I need a solution for song request via bsr command even though the current Beat Saber Oculus Quest mod doesn't have runtime song loader yet. So the approach is to at least have an ability to retrieve chat request and download it automatically to my PC, then I can upload all the downloaded songs in one go instead of downloading it manually one by one (in which the viewer will wait for you to download and upload it to the Quest). **UPDATE: it is now possible to upload downloaded songs to the Quest and reload the uploaded songs in-game without leaving Beat Saber, [more about this](#new-automatic-map-upload-to-quest)**

If you are using PC version of Beat Saber, it's recommended to use "Song Request Manager" mod instead that can be installed via [ModAssistant](https://github.com/Assistant/ModAssistant), it's better and easier to set up.

## Installation
Installation tutorial video by [Universe-made-of-cotton](https://www.youtube.com/channel/UCpXfUhQUr3VHSXbV-BNBlxA/)

[![VIDEO](http://img.youtube.com/vi/UjLeEJEUfuo/0.jpg)](http://www.youtube.com/watch?v=UjLeEJEUfuo "Quest BSR Twitch Bot Setup")

- Clone or download this repo (Code -> Download ZIP, then extract)
- Create new file named `.env` with this content below, then follow [this docs](https://dev.twitch.tv/docs/irc) on how to retrieve these 3 variables
```env
BOT_USERNAME=
OAUTH_TOKEN=
CHANNEL_NAME=
```
- Install [Node.js](https://nodejs.org/en/download/)
- Run / double click `install.bat`
- To start the bot, run / double click `start.bat`

After the bot is connected, try to send a bsr command in your channel's chat (for example `!bsr bd45`), the bot will automatically download the zip and save it to `/maps` folder. After the download is finished, the bot will send back to chat informing that the song is added to the queue.

## NEW! Automatic Map Upload to Quest
Since BMBF v1.14.0 for Beat Saber 1.16.4 released, it is now possible to upload downloaded songs to the Quest and reload the uploaded songs in-game without leaving Beat Saber (thanks to Runtime Song Loader mod). So, I have implemented an ability to upload downloaded map wirelessly from PC to the Quest via ADB, then simply click "Reload New Songs" button in SongLoader mod settings.

Prerequisite:
- BMBF v1.14.0 for Beat Saber 1.16.4 or latest
- PC and Quest are connected to the same network
- ADB Server (if you have SideQuest installed, then you should have this already)

To enable this (Setup):
- Change `enable_automatic_upload_to_quest` value to `true` in `config.js`
- Change `adb_folder` to your `adb.exe` folder
  - If you are using Windows and have SideQuest installed, you shouldn't need to change this
  - If you change the value, make sure to escape `\` character by adding another `\` character

Now:
- Connect your Quest to PC via cable
- Start the bot
- Unplug the cable when it's connected wirelessly
- When there's new song and you're ready to play requested songs, click "Reload New Songs" button in SongLoader mod settings
  - Beat Saber -> Settings -> Mod Settings -> SongLoader -> Reload New Song

## Contributing / Issues / Feedback
Pull requests are welcome. Create issue here or reach out to me [via Discord](https://discord.com/users/396515255519543299) if you have any issue or want to give feedback.

Updated to the new beatsaver api by [joshcubes](https://github.com/joshcubes)
