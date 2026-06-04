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
      .setTitle("Embed Test")
      .setDescription("This is an embed with an image.")
      .setImage("https://picsum.photos/400/300")
      .setFooter({ text: "Image caption" });

    await interaction.reply({ content, embeds: [embed] });
  },
};
