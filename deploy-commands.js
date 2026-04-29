require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('add')
    .setDescription('Buscar anime')
    .addStringOption(option =>
      option.setName('anime')
        .setDescription('Nome do anime')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('avaliar')
    .setDescription('Avaliar anime')
    .addStringOption(option =>
      option.setName('anime')
        .setDescription('Nome do anime')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option.setName('nota')
        .setDescription('Nota de 0 a 10')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('lista')
    .setDescription('Ver lista')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('recomendar')
    .setDescription('Recomendar animes')
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registrando comandos...');

    await rest.put(
      Routes.applicationCommands('1498901170129993748'),
      { body: commands },
    );

    console.log('Comandos registrados!');
  } catch (error) {
    console.error(error);
  }
})();