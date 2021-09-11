require('dotenv').config();

const config = {
    user_agent: `Quest-BSR-Twitch-Bot/1.0.0 (+https://github.com/wilik16/quest-bsr-twitch-bot)`,
    message: {
        manual: `To request song, find a song at bsaber.com and click on twitch logo under a song to copy the code, then paste in the chat. I made a video guide here https://imgur.com/a/a0s0qqa`
    },
    bot_options: { // follow this docs on how to retrieve these 3 variables https://dev.twitch.tv/docs/irc
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN,
        channel: process.env.CHANNEL_NAME
    }
};

module.exports = config;