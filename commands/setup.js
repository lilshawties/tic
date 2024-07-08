/*

  ________.__                        _____.___.___________
 /  _____/|  | _____    ____  ____   \__  |   |\__    ___/
/   \  ___|  | \__  \ _/ ___\/ __ \   /   |   |  |    |   
\    \_\  \  |__/ __ \\  \__\  ___/   \____   |  |    |   
 \______  /____(____  /\___  >___  >  / ______|  |____|   
        \/          \/     \/    \/   \/                  

╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║  ## Created by GlaceYT!                                                ║
║  ## Feel free to utilize any portion of the code                       ║
║  ## DISCORD :  https://discord.com/invite/xQF9f9yUEM                   ║
║  ## YouTube : https://www.youtube.com/@GlaceYt                         ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝


*/

const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } = require('discord.js');
const fs = require('fs');
const config = require('../config.js');
const crypto = require('crypto');
const { Permissions } = require('discord.js');
const { PermissionsBitField, ChannelType } = require('discord.js');


function updateTicketData(ticketData) {
  fs.writeFileSync('ticket.json', JSON.stringify(ticketData, null, 2));
}


function loadTicketData() {
    try {
        const data = fs.readFileSync('ticket.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
          
            fs.writeFileSync('ticket.json', '{}');
            return {}; 
        } else {
            throw error; 
        }
    }
}


async function closeTicket(interaction, ticketChannel) {
  try {
                     
                        const ticketOwner = interaction.user;

                     
                        await ticketChannel.delete();
    
                      
      const confirmationEmbed = new EmbedBuilder()
    .setTitle('.Ϟ 𝘁𝗶𝗰𝗸𝗲𝘁 𝗰𝗹𝗼𝘀𝗲𝗱.')
        .setColor('#4a6c89')
  .setDescription(`**𝙪𝙧 𝙩𝙞𝙘𝙠𝙚𝙩 𝙝𝙖𝙨 𝙗𝙚𝙚𝙣 𝙘𝙡𝙤𝙨𝙚𝙙 𝙨𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮.** \n\n- ᓚᘏᗢ `)
        .setImage('https://cdn.discordapp.com/attachments/1237484291219259465/1243033742935592990/c32c6daaa4d17c9b3b0f0d1eabe58f72.gif?ex=668ca5e2&is=668b5462&hm=039325430757774c69d842b6b95863f5122d48fa327d290843a990ea4c93d227&')
    .setFooter({ text: '𝙩𝙮𝙨𝙢 ⁼꒳⁼ ', iconURL:'https://cdn.discordapp.com/emojis/1243174763535536182.gif'})
     .setTimestamp();
await ticketOwner.send({ embeds: [confirmationEmbed] });

                       
                    } catch (error) {
                      
                        if (error.code === 10003) {
                            console.error('Error closing ticket:', error);
                        } else {
                            console.error('An error occurred while closing the ticket:', error);
                        }
                    }
}


let lastTicketCreationTimestamp = 0;

function generateTicketNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}


async function createTicket(interaction, ticketChannel) {
  try {
    
    if (!interaction || !interaction.user || !interaction.user.id) {
      throw new Error('Interaction object or user property is undefined or does not contain id.');
    }
    
        const currentTimestamp = Date.now();

        
        if (currentTimestamp - lastTicketCreationTimestamp < 10000) { 
          const remainingTime = Math.ceil((10000 - (currentTimestamp - lastTicketCreationTimestamp)) / 1000);
          return await interaction.reply({ content: `Please wait ${remainingTime} seconds before creating a new ticket.`, ephemeral: true });
        }

     
        lastTicketCreationTimestamp = currentTimestamp;

    const ticketNumber = generateTicketNumber();
    const userId = interaction.user.id; 
    const channelId = ticketChannel.id;
    const creationTimestamp = new Date().toISOString();

   
    const ticket = {
      ticketNumber,
      userId,
      channelId,
      creationTimestamp,
      status: 'open',
      additionalInfo: 'Additional information here'
    };

   
    const ticketData = loadTicketData();
    ticketData.tickets.push(ticket);
    updateTicketData(ticketData);

    
    const tempChannel = await interaction.guild.channels.create({ name: 'temp-ticket-channel' }, {
      type: ChannelType.GuildText,
      parent: '1208794682897993852',
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });
    

    const newChannelName = `ticket-${ticketNumber}`;
    await tempChannel.setName(newChannelName, 'Updating channel name to include ticket number');

    const embedMessage = new EmbedBuilder()
      .setColor('#bc8787')
      .setTitle('𐙚˙⋆ .˚')
     .setDescription(`➣ **𝙩𝙞𝙘𝙠𝙚𝙩 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 ${interaction.user}**\n☆。 **𝘁𝗶𝗰𝗸𝗲𝘁 𝗻𝘂𝗺𝗯𝗲𝗿: ${ticketNumber}**\n\n\- 𝗰𝗵𝗲𝗰𝗸 𝗿𝗮𝘁𝗲 𝗼𝘄𝗼 𝗰𝗮𝘀𝗵: <#1243917131821617172>\n- ニャー ？！`)
    .setFooter({ text: '𝙢𝙚𝙤𝙬 𝙢𝙚𝙤𝙬 ', iconURL: 'https://cdn.discordapp.com/emojis/1243171663051489350.gif' });
    const createTicketButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('✶ 𝗰𝗹𝗼𝘀𝗲 𝘁𝗶𝗰𝗸𝗲𝘁')
      .setStyle(ButtonStyle.Danger);

    await tempChannel.send({ embeds: [embedMessage], components: [new ActionRowBuilder().addComponents(createTicketButton)] });
      await interaction.reply({ content: '𝙩𝙞𝙘𝙠𝙚𝙩 𝙘𝙧𝙚𝙖𝙩𝙚𝙙 𝙨𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮.', ephemeral: true });
    
    const ticketOwner = interaction.user;
     const confirmationEmbed = new EmbedBuilder()
        .setTitle('ణ 𝘁𝗶𝗰𝗸𝗲𝘁 𝗼𝗽𝗲𝗻𝗲𝗱')
            .setColor('#bc8787')
      .setDescription(` **𝙮𝙤𝙪𝙧 𝙩𝙞𝙘𝙠𝙚𝙩 𝙣𝙪𝙢𝙗𝙚𝙧 𝙞𝙨 ${ticketNumber} ** \n\n-  𝙗𝙤𝙢𝙞𝙚 𝙤𝙣 𝙙𝙖 𝙬𝙖𝙮\n- ニャー ？！`)
       .setImage('https://cdn.discordapp.com/attachments/1237484291219259465/1258970087726252072/0c753154257af31d1848edba62354a20.gif?ex=668c9dc3&is=668b4c43&hm=2f792824c4cd23615df0993b8944dad7c543e3167c077b8f54a69440c406928a&')
    .setFooter({ text: '𝙢𝙚𝙤𝙬 𝙢𝙚𝙤𝙬 ', iconURl:'https://cdn.discordapp.com/emojis/1243171663051489350.gif'})
     .setTimestamp();
    await ticketOwner.send({ embeds: [confirmationEmbed] });
    
 

    
    
    tempChannel.permissionOverwrites.create(tempChannel.guild.roles.everyone, { ViewChannel: false });


        tempChannel.permissionOverwrites.edit(interaction.user.id, {
     ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true
    });

  } catch (error) {
   
    await interaction.reply({ content: 'An error occurred while creating the ticket.', ephemeral: true });
  }
}




process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});


process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
module.exports = {
  name: "setup",
  description: "Set up the ticket system for your server.",
  options: [{
    name: 'channel',
    description: 'Select the channel where you want to set up the ticket system.',
    type: ApplicationCommandOptionType.Channel,
    required: true
  }],
  run: async (client, interaction) => {
    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return interaction.reply({ content: 'You need to be a server administrator to set up tickets.', ephemeral: true });
      }

      const ticketChannel = interaction.options.getChannel('channel');

      const serverId = interaction.guildId;
      const serverName = interaction.guild.name;
      const setupData = JSON.parse(fs.readFileSync(config.setupFilePath, 'utf8'));
      if (setupData[serverId]) {
        return interaction.reply({ content: 'Ticket system is already set up in this server.', ephemeral: true });
      }

      setupData[serverId] = {
        serverName: serverName,
        ticketChannelId: ticketChannel.id
      };
      fs.writeFileSync(config.setupFilePath, JSON.stringify(setupData, null, 2));

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ticket System Setup')
        .setDescription(`Click the button below to set up the ticket system in ${ticketChannel || 'the selected channel'}.`)
        .setFooter({ text: 'Make sure you choose correct channel!' });

      const button = new ButtonBuilder()
        .setCustomId('setup_ticket')
        .setLabel('🛠️ Set up Ticket System')
        .setStyle(ButtonStyle.Primary);

      const message = await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button)], ephemeral: true });

      client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton() && interaction.customId === 'setup_ticket') {
          try {
            const setupData = JSON.parse(fs.readFileSync(config.setupFilePath, 'utf8'));
            const serverId = interaction.guildId;
            const ticketChannelId = setupData[serverId]?.ticketChannelId;

            if (!ticketChannelId) {
              return interaction.reply({ content: 'Ticket system setup is incomplete. Please run the setup command again.', ephemeral: true });
            }

            const ticketChannel = await client.channels.fetch(ticketChannelId);
            if (ticketChannel) {
              const fixedTicketEmbed = new EmbedBuilder()
                .setColor('#bc8787')
                .setTitle('⋆౨ৎ˚⟡˖ ࣪')
                .setImage('https://media.discordapp.net/attachments/795465906808946691/890050778838999100/sparklegif.gif?ex=668c95e2&is=668b4462&hm=076b5b4ea027231e227ee8133d3a3af6d43c0820d78114a667555428dbaf3075&')
              .setDescription('𝗰𝗹𝗶𝗰𝗸 𝘁𝗵𝗲 𝗯𝘂𝘁𝘁𝗼𝗻 𝗯𝗲𝗹𝗼𝘄 𝘁𝗼 𝗰𝗿𝗲𝗮𝘁𝗲 𝗮 𝗻𝗲𝘄 𝘁𝗶𝗰𝗸𝗲𝘁.n\n' +
                 '- 𝘦𝘮𝘱𝘵𝘺 𝘵𝘪𝘤𝘬𝘦𝘵𝘴 𝘢𝘳𝘦 𝘯𝘰𝘵 𝘱𝘦𝘳𝘮𝘪𝘵𝘵𝘦𝘥.\n' +
                 '- 𝘣𝘰𝘮𝘪𝘦 𝘰𝘯 𝘥𝘢 𝘸𝘢𝘺.')
              .setFooter({ text: '𝙢𝙚𝙤𝙬 𝙢𝙚𝙤𝙬', iconURL:'https://cdn.discordapp.com/emojis/1243174809312038912.gif'});

              const createTicketButton = new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('.𝜗𝜚˚⋆')
                .setStyle(ButtonStyle.Primary);

              await ticketChannel.send({ embeds: [fixedTicketEmbed], components: [new ActionRowBuilder().addComponents(createTicketButton)] });
             
              await interaction.reply({ content: 'Setup successful. ', ephemeral: true });
            
              
            } else {
              console.error('Unable to fetch ticket channel.');
              return interaction.reply({ content: 'Unable to fetch ticket channel.', ephemeral: true });
            }
          } catch (error) {
            console.error('Error setting up tickets:', error);
            await interaction.reply({ content: 'An error occurred while setting up tickets.', ephemeral: true });
          }
        }
      });

     
      client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton() && interaction.customId === 'create_ticket') {
          console.log('Ticket Created');
        
        }
      });

     
      client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton() && interaction.customId === 'close_ticket') {
          console.log('Ticket Closed');
        }
      });

  

    } catch (error) {
      console.error('Error setting up tickets:', error);
      await interaction.reply({ content: 'An error occurred while setting up tickets.', ephemeral: true });
    }
  },
  closeTicket,
  createTicket
};


/*

  ________.__                        _____.___.___________
 /  _____/|  | _____    ____  ____   \__  |   |\__    ___/
/   \  ___|  | \__  \ _/ ___\/ __ \   /   |   |  |    |   
\    \_\  \  |__/ __ \\  \__\  ___/   \____   |  |    |   
 \______  /____(____  /\___  >___  >  / ______|  |____|   
        \/          \/     \/    \/   \/                  

╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║  ## Created by GlaceYT!                                                ║
║  ## Feel free to utilize any portion of the code                       ║
║  ## DISCORD :  https://discord.com/invite/xQF9f9yUEM                   ║
║  ## YouTube : https://www.youtube.com/@GlaceYt                         ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝


*/
