require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let db = { users: {}, reviews: [] };

// carregar banco
if (fs.existsSync('db.json')) {
  db = JSON.parse(fs.readFileSync('db.json'));
}

// salvar banco
function saveDB() {
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
}

// buscar anime na API
async function buscarAnime(nome) {
  const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${nome}&limit=1`);
  return res.data.data[0];
}

client.on('clientReady', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;

  if (interaction.commandName === 'add') {
    const nome = interaction.options.getString('anime');
    const anime = await buscarAnime(nome);

    const embed = new EmbedBuilder()
      .setTitle(anime.title)
      .setDescription(anime.synopsis?.slice(0, 200) || "Sem descrição")
      .setImage(anime.images.jpg.image_url);

    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'avaliar') {
    const nome = interaction.options.getString('anime');
    const nota = interaction.options.getNumber('nota');

    const anime = await buscarAnime(nome);

    db.reviews.push({
      userId,
      anime: anime.title,
      nota
    });

    saveDB();

    await interaction.reply(`Você avaliou **${anime.title}** com nota ${nota}`);
  }

  if (interaction.commandName === 'lista') {
    const target = interaction.options.getUser('usuario') || interaction.user;

    const lista = db.reviews.filter(r => r.userId === target.id);

    if (lista.length === 0) {
      return interaction.reply('Nenhum anime encontrado.');
    }

    const texto = lista.map(a => `${a.anime} (${a.nota})`).join('\n');

    await interaction.reply(`📺 Lista de ${target.username}:\n${texto}`);
  }

  if (interaction.commandName === 'recomendar') {
    const lista = db.reviews
      .filter(r => r.nota >= 8)
      .slice(-5);

    if (lista.length === 0) {
      return interaction.reply('Sem recomendações ainda.');
    }

    const texto = lista.map(a => a.anime).join('\n');

    await interaction.reply(`🔥 Recomendações:\n${texto}`);
  }
});

client.login(process.env.TOKEN);