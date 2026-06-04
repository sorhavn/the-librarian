import { SlashCommandBuilder } from "discord.js";
import { readFile } from "fs/promises";

const guides = {
  aria: await readFile(
    new URL("../content/characters/aria.md", import.meta.url),
    "utf8",
  ),
  borin: await readFile(
    new URL("../content/characters/borin.md", import.meta.url),
    "utf8",
  ),
  celeste: await readFile(
    new URL("../content/characters/celeste.md", import.meta.url),
    "utf8",
  ),
  drakon: await readFile(
    new URL("../content/characters/drakon.md", import.meta.url),
    "utf8",
  ),
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
          { name: "Celeste", value: "celeste" },
          { name: "Drakon", value: "drakon" },
        ),
    ),

  async execute(interaction) {
    const character = interaction.options.getString("character");
    const content = guides[character];

    await interaction.reply({ content });
  },
};
