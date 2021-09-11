require('dotenv').config();

const config = {
    user_agent: process.env.BSR_BOT_USER_AGENT, // define your own User-Agent https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
    message: {
        manual: `To request song, find a song at bsaber.com and click on twitch logo under a song to copy the code, then paste in the chat. I made a video guide here https://imgur.com/a/a0s0qqa`
    },
    bot_options: { // follow this docs on how to retrieve these 3 variables https://dev.twitch.tv/docs/irc
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_BOT_PASSWORD,
        channel: process.env.TWITCH_CHANNEL
    }
};

module.exports = config;