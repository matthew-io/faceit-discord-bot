const axios = require('axios');
const Discord = require('discord.js');

const { faceitToken } = require('../config/faceitConfig.json');

const getPlayerInfo = async (player, message) => {
  try {
    message.channel.send(`*Getting ${player}'s FACEIT stats...*`);

    // GET PLAYER ID FROM USERNAME

    const getPlayerName = await axios.get(
      `https://open.faceit.com/data/v4/players?nickname=${player}`,
      {
        headers: {
          Authorization: `Bearer ${faceitToken}`,
        },
      }
    );

    // ASSIGNING PLAYER DATA FROM API USERNAME QUERY

    let {
      player_id,
      nickname,
      avatar,
      cover_image,
      country,
    } = getPlayerName.data;
    let playerElo = getPlayerName.data.games.csgo.faceit_elo;

    // GET PLAYER STATS FROM ID

    const getPlayerStats = await axios.get(
      `https://open.faceit.com/data/v4/players/${player_id}/stats/csgo
            `,
      {
        headers: {
          Authorization: `Bearer ${faceitToken}`,
        },
      }
    );

    // ASSIGNING PLAYER STATS FROM ID

    let {
      Matches,
      ['Average Headshots %']: playerHs,
      ['Win Rate %']: playerWr,
      ['Longest Win Streak']: playerLongestW,
      ['Average K/D Ratio']: playerKd,
    } = getPlayerStats.data.lifetime;

    // DISCORD EMBEDDED MESSAGE SETUP

    const hookEmbed = new Discord.MessageEmbed()
      .setColor('#fd5d00')
      .setAuthor('BEST FACEIT BOT')
      .setTitle(`${nickname}`)
      .setImage(cover_image)
      .setThumbnail(avatar)
      .setDescription('^ Click to view profile.')
      .setURL(`https://www.faceit.com/en/players/${nickname}`)
      .setTimestamp()
      .addFields(
        {
          name: '**Country**',
          value: `:flag_${country}:`,
          inline: true,
        },
        {
          name: '**ELO**',
          value: `${playerElo} ELO`,
          inline: true,
        },
        {
          name: '**K/D Ratio**',
          value: `${playerKd} K/D`,
          inline: true,
        },
        {
          name: '**Matches**',
          value: `${Matches} Matches`,
          inline: true,
        },

        {
          name: '**Win Rate**',
          value: `${playerWr}%`,
          inline: true,
        },
        {
          name: '**Longest Win Streak**',
          value: `${playerLongestW} Wins`,
          inline: true,
        },
        {
          name: '**Headshot %**',
          value: `${playerHs}%`,
          inline: true,
        }
      )
      .setFooter('FACEIT STATS BOT 🤖');

    // SEND DISCORD EMBEDDED MESSAGE

    message.channel.send(hookEmbed);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = getPlayerInfo;
