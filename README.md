# Quest BSR Twitch Bot
This bot will automatically download custom songs requested by viewers on twitch chat to `songs` folder, then you as the streamer can upload all the downloaded songs manually via BMBF.

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

Try to send a bsr command chat in your `CHANNEL_NAME` chat (for example `!bsr bd45`, the bot will automatically download the zip to `/song` folder.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
