# aarucard

Offical nowplaying card for Aaru!

## Usages

```js
const { AttachmentBuilder } = require("discord.js");
const { AaruCard } = require("aarucard");

const aarucard = await AaruCard({
    thumbnail: "",
    background: "",
    text: "",
    title: "",
    author: "",
    requestor: "",
    duration: "",
});

const attachment = new AttachmentBuilder(aarucard, { name: "aarucard.png" });
```

Preview:

![AaruCard]()
