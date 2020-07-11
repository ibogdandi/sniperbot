require('dotenv').config();

const moment = require('moment');
const Discord = require('discord.js');
const mysql = require('mysql');
const Client = new Discord.Client();
const connection = mysql.createConnection({
    host: 'eu-cdbr-west-03.cleardb.net',
    port: '3306',
    user: 'b94ea3d24429c6',
    password: '0c5e6325',
    database: 'heroku_566e0c23129c7d9'
});

Client.on('ready', () => {
    console.log('I am ready!');
});

const channels = ['calpheon1', 'calpheon2', 'calpheon3'];

Client.on('message', message => {

    let content = message.content;
    if (!content.startsWith('!')) {
        return;
    }
    let args = message.content.substring(1).split(" ");
    switch (args[0]) {
        case 'init':
            connection.query(`DELETE FROM channelcheck`, console.log);

            channels.forEach(element => {
                connection.query(`INSERT INTO channelcheck (channel) VALUES ('${element}')`, console.log);
            });
            message.reply('clear this shit');
            break;
        case 'add':
            let channel = args[1];
            if (channels.includes(channel)) {
                let setData = `SET checkedAt = "${moment().format('YYYY-MM-DD hh:mm:ss')}", user =  "${message.author.username}"`;
                if (args.hasOwnProperty(2)) {
                    setData += `, guild = "${args[2]}"`;
                }
                if (args.hasOwnProperty(3)) {
                    setData += `, names = "${args[3]}"`;
                }
                connection.query(`UPDATE channelcheck ${setData} WHERE channel = "${channel}"`, console.log);
                message.reply(`A ${channel} check mentve!`);
            } else {
                message.reply(`Ne legyél hülye, ${args[1]} channelt nem ismerem`);
            }
            break;
        default:
            message.reply('Rainynek szólj mert valami nem jó!');

    }

    sendMessage(message.channel);
    if (message.content === 'hete') {
        message.reply('HETE');
    }

    message.delete({timeout: 2000});

});

// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);

connection.connect(error => {
    if (error) {
        throw error;
    }
    console.log('Connected to DB');
    connection.query('SHOW TABLES', console.log);
});

function sendMessage(channel) {

    connection.query('SELECT * FROM channelcheck', (error, rows) => {
        let message = new Discord.MessageEmbed()
            .setTitle('Magyarölő táblázat')
            .setDescription('HETE');
        message.addFields(
            {name: 'CHANNEL', value: '\u200b', inline: true},
            {name: 'GUILD', value: '\u200b', inline: true},
            {name: 'CSICSKÁK', value: '\u200b', inline: true},
        );
        rows.forEach(channelData => {
            console.log(channelData);
            let status = '🔴';
            if (channelData.guild || channelData.names) {
                status = '🟢';
            }
            message.addFields(
                {name: '\u200b', value: `${status} ${channelData.channel}`, inline: true},
                {name: '\u200b', value: channelData.guild ?? '\u200b', inline: true},
                {name: '\u200b', value: channelData.names ?? '\u200b', inline: true},
            );
            // message.addField('\u200b', '\u200b');
        });
        // message.addField({
        //     name: rows.
        // })
        channel.send(message);
    });

}
