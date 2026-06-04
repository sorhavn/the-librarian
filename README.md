# The Librarian

## Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Create a `.env` file:
   ```
   APP_ID=
   TOKEN=
   ```

3. Register commands with Discord:
   ```bash
   bun run deploy
   ```

4. Run the bot:
   ```bash
   bun run dev   # development
   bun run start # production
   ```

## Creating Commands

Add new commands in `commands/`:
```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Description here'),

  async execute(interaction) {
    await interaction.reply('Response here');
  },
};
```

After creating a command, run `bun run deploy` to register it with Discord.

## Content Files

For longer replies, keep the text in `content/*.md` and load it from a command. Discord renders the Markdown.

Create the file:

```markdown
Useful general guides and resources:

- [New Player Handbook](https://example.com/handbook)
- [Build Compendium](https://example.com/builds)
```

Wire it up in a command (see `commands/guides.js`):

```javascript
import { SlashCommandBuilder } from 'discord.js';
import { readFile } from 'fs/promises';

const content = await readFile(new URL('../content/yourFile.md', import.meta.url), 'utf8');

export default {
  data: new SlashCommandBuilder()
    .setName('yourCommand')
    .setDescription('...'),

  async execute(interaction) {
    await interaction.reply(content);
  },
};
```

The file is read once when the bot starts.

**Limit:** Discord caps messages at 2000 characters. If a file grows past that, you'll need to split it across multiple messages with `interaction.followUp()`.

### Subdirectories

You can organize content in subdirectories like `content/characters/`. Load them the same way:

```javascript
const content = await readFile(
  new URL("../content/characters/aria.md", import.meta.url),
  "utf8",
);
```

## Commands with Parameters

Add options to your command using `addStringOption`, `addIntegerOption`, etc. (see `commands/character-guide.js`):

```javascript
import { SlashCommandBuilder } from "discord.js";
import { readFile } from "fs/promises";

const guides = {
  aria: await readFile(new URL("../content/characters/aria.md", import.meta.url), "utf8"),
  borin: await readFile(new URL("../content/characters/borin.md", import.meta.url), "utf8"),
};

export default {
  data: new SlashCommandBuilder()
    .setName("character-guide")
    .setDescription("Look up a guide for a character")
    .addStringOption((option) =>
      option
        .setName("character")
        .setDescription("The character name to look up")
        .setRequired(true)
        .addChoices(
          { name: "Aria", value: "aria" },
          { name: "Borin", value: "borin" },
        ),
    ),

  async execute(interaction) {
    const character = interaction.options.getString("character");
    const content = guides[character];
    await interaction.reply({ content });
  },
};
```

Discord supports `String`, `Integer`, `Boolean`, `User`, `Channel`, and `Role` option types.

## Embeds and Images

Use `EmbedBuilder` to send rich embeds with images (see `commands/image.js`):

```javascript
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { readFile } from "fs/promises";

const content = await readFile(
  new URL("../content/image.md", import.meta.url),
  "utf8",
);

export default {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Sends an embed with an image"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Title")
      .setDescription("Embed description")
      .setImage("https://example.com/image.png")
      .setFooter({ text: "Caption" });

    await interaction.reply({ content, embeds: [embed] });
  },
};
```

You can send both `content` (markdown text) and `embeds` in the same reply.

## Slash Command Usage

More info about slash commands can be found in the [discord.js guide](https://discordjs.guide/legacy/slash-commands/advanced-creation).
