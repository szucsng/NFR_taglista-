const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const config = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} sikeresen elindult!`);
    console.log(`📊 ${client.guilds.cache.size} szerveren aktív`);
});

client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Check if message is in the allowed channel
    if (message.channel.id !== config.allowedChannelId) {
        // If someone tries to use commands in wrong channel
        if (message.content.startsWith(config.prefix)) {
            const embed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Helytelen csatorna!')
                .setDescription(`A parancsokat csak ebben a csatornában használhatod: <#${config.allowedChannelId}>`)
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
        }
        return;
    }

    // Handle commands
    if (message.content.startsWith(config.prefix)) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'taglista':
                await handleTaglista(message);
                break;
            case 'frakciojump':
                await handleFrakcioJump(message);
                break;
            case 'help':
                await handleHelp(message);
                break;
        }
    }
});

async function handleTaglista(message) {
    try {
        const guild = message.guild;
        const members = await guild.members.fetch();
        
        // Get the mentioned role if any
        const mentionedRole = message.mentions.roles.first();
        
        let filteredMembers;
        let title;
        let description;
        
        if (mentionedRole) {
            // Filter members by the mentioned role
            filteredMembers = members.filter(member => 
                member.roles.cache.has(mentionedRole.id) && !member.user.bot
            );
            title = `📋 ${guild.name} - ${mentionedRole.name} Taglistája`;
            description = `Tagok a(z) **${mentionedRole.name}** rangban:`;
        } else {
            // Show all members
            filteredMembers = members.filter(member => !member.user.bot);
            title = `📋 ${guild.name} Taglistája`;
            description = 'Szerver összes tagja:';
        }
        
        const embed = new EmbedBuilder()
            .setColor(mentionedRole ? mentionedRole.color : '#4ecdc4')
            .setTitle(title)
            .setDescription(description)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '👥 Tagok száma', value: `${filteredMembers.size}`, inline: true },
                { name: '🤖 Botok', value: `${members.size - members.filter(m => !m.user.bot).size}`, inline: true },
                { name: '📊 Összesen', value: `${members.size}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Kérte: ${message.author.tag}` });

        // Add member list (first 20 members)
        if (filteredMembers.size > 0) {
            const memberList = filteredMembers.map(member => {
                const nickname = member.nickname ? ` (${member.nickname})` : '';
                return `• <@${member.id}>${nickname}`;
            }).join('\n');

            embed.addFields({
                name: `👤 Tagok (${filteredMembers.size})`,
                value: memberList.length < 1024 ? memberList : 'Túl sok tag a megjelenítéshez!'
            });
        } else {
            embed.addFields({
                name: '👤 Tagok',
                value: mentionedRole ? 
                    `Nincs tag a(z) **${mentionedRole.name}** rangban.` : 
                    'Nincs tag a szerveren.'
            });
        }

        await message.reply({ embeds: [embed], allowedMentions: { users: [] } });
    } catch (error) {
        console.error('Hiba a taglista lekérdezésénél:', error);
        await message.reply('❌ Hiba történt a taglista lekérdezésénél!');
    }
}

async function handleFrakcioJump(message) {
    const embed = new EmbedBuilder()
        .setColor('#ffa726')
        .setTitle('🏢 Frakció Jump')
        .setDescription('Ez a funkció jelenleg fejlesztés alatt áll.\nKésőbb FiveM integrációval lesz elérhető!')
        .addFields(
            { name: '🔄 Státusz', value: 'Fejlesztés alatt', inline: true },
            { name: '🎮 Integráció', value: 'FiveM (hamarosan)', inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'NFR Bot - Frakció Jump' });

    await message.reply({ embeds: [embed] });
}

async function handleHelp(message) {
    const embed = new EmbedBuilder()
        .setColor('#4ecdc4')
        .setTitle('🤖 NFR Bot - Segítség')
        .setDescription('Elérhető parancsok:')
        .addFields(
            { name: `${config.prefix}taglista`, value: 'Megjeleníti a szerver taglistáját', inline: false },
            { name: `${config.prefix}taglista @rang`, value: 'Megjeleníti egy adott rang taglistáját', inline: false },
            { name: `${config.prefix}frakciojump`, value: 'Frakció jump funkció (fejlesztés alatt)', inline: false },
            { name: `${config.prefix}help`, value: 'Megjeleníti ezt a segítség menüt', inline: false }
        )
        .addFields({
            name: '📋 Megjegyzés',
            value: `A parancsokat csak ebben a csatornában használhatod: <#${config.allowedChannelId}>`
        })
        .setTimestamp()
        .setFooter({ text: 'NFR Bot' });

    await message.reply({ embeds: [embed] });
}

// Error handling
client.on('error', error => {
    console.error('Discord bot hiba:', error);
});

process.on('unhandledRejection', error => {
    console.error('Nem kezelt Promise elutasítás:', error);
});

// Login
client.login(config.token); 