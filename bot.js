require('dotenv').config();

const moment = require('moment');
const Discord = require('discord.js');
const mysql = require('mysql');
const Client = new Discord.Client();

let connection;

Client.on('ready', () => {
    console.log('I am ready!');
});

const channels = [
    'ser1',
    'ser2',
    'ser3',
    'ser4',
    'ser5',
    'ser6',
    'vel1',
    'vel2',
    'vel3',
    'vel4',
    'vel5',
    'vel6',
    'med1',
    'med2',
    'med3',
    'med4',
    'med5',
    'med6',
    'bal1',
    'bal2',
    'bal3',
    'bal4',
    'bal5',
    'bal6',
    'val1',
    'val2',
    'val3',
    'val4',
    'val5',
    'val6',
    'cal1',
    'cal2',
    'cal3',
    'cal4',
    'cal5',
    'cal6',
];

Client.on('message', message => {

    let content = message.content;
    if (message.author.bot) {
        return;
    }
    if (!content.startsWith('!')) {
        message.delete();
        return;
    }
    let args = message.content.substring(1).split(" ");
    switch (args[0]) {
        case 'init':
            connection.query(`DELETE FROM channelcheck`, console.log);

            channels.forEach(element => {
                connection.query(`INSERT INTO channelcheck (channel) VALUES ('${element}')`, console.log);
            });
            message.reply('Magyarkereső drónok fellőve!');
            break;
        case 'add':
            let channel = args[1];
            if (channels.includes(channel)) {
                let setData = `SET checkedAt = "${moment().format('YYYY-MM-DD HH:mm:ss')}", user =  "${message.author.username}"`;
                if (args.hasOwnProperty(2)) {
                    setData += `, names = "${args[2]}"`;
                }
                if (args.hasOwnProperty(3)) {
                    setData += `, guild = "${args[3]}"`;
                }
                connection.query(`UPDATE channelcheck ${setData} WHERE channel = "${channel}"`, console.log);
                message.reply(`A [${channel}] mentve!`);
            } else {
                message.reply(`Ne legyél hülye, ${args[1]} channelt nem ismerem!`);
            }
            break;
        case 'list':
            // list(message.channel);
            break;
        default:
            message.reply('Rainynek szólj mert valami nem jó!');

    }
    clear(message.channel);
    list(message.channel);
});

// THIS  MUST  BE  THIS  WAY
Client.login(process.env.BOT_TOKEN);

handleDbConnection();

function list(channel) {

    connection.query('SELECT * FROM channelcheck', (error, rows) => {
        lines = '```css';
        // lines +='😊 CHANNEL  USER ';
        rows.forEach(channelData => {
            let status = '🔴';
            if (channelData.guild || channelData.names) {
                status = '😍';
                // status = '😊';
                // let emoji = Client.emojis.cache.find(emoji => emoji.name === 'yeahBoi');
                // status = `${emoji}`;
                //
                // channel.send(`${emoji}`);
                // console.log(Client.emojis.cache);
                // console.log(Client.emojis.cache.find(emoji => emoji.name === 'yeahBoi'));
            }

            let line = `\n ${status} ${channelData.channel}`;

            if (channelData.guild) {
                line += ` <${channelData.guild}>`;
            }
            if (channelData.names) {
                line += ` ${channelData.names}`;
            }
            if (channelData.user) {
                line += ` #${channelData.user}`;
            }
            if (channelData.checkedAt) {
                line += ` [${moment(channelData.checkedAt).format('HH:mm')}]`;
            }

            // lines += `\n ${status} ${channelData.channel}  #${channelData.user ?? ''} [${channelData.checkedAt ? moment(channelData.checkedAt).format('HH:mm') : ''}]  ${channelData.guild ?? ''}  ${channelData.names ?? ''}`;
            lines += line;

        });
        lines += '```';
        channel.send(lines);
    });
}

function clear(channel) {
    channel.messages.fetch({limit: 100}).then(function (list) {
        channel.bulkDelete(list);
    });
}

function handleDbConnection() {
    connection = mysql.createConnection({
        host: 'eu-cdbr-west-03.cleardb.net',
        port: '3306',
        user: 'b94ea3d24429c6',
        password: '0c5e6325',
        database: 'heroku_566e0c23129c7d9'
    });
    connection.connect(error => {
        if (error) {
            console.log('Something went wrong');
            setTimeout(handleDbConnection, 2000);
        } else {
            console.log('Connected to DB');
            connection.query('SHOW TABLES', console.log);
        }
    });

    connection.on('error', function (error) {
        console.log('Something went wrong');
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDbConnection();
        } else {
            throw error;
        }
    })
}
