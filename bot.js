const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('winston');
const auth = require('./auth.json');
const schedule = require('node-schedule');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.level = 'debug';

// Initialize Discord client
client.login(auth.token);

client.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('Logged in as: ' + client.user.tag);
});

client.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('pong');
	}
});

function newMemberForRole(roleName) {
	let role = client.guilds.first().roles.find("name", roleName);
	let randomMember = client.guilds.first().members.random();
	let oldMember = role.members.first();

	if (oldMember != undefined) {
		oldMember.removeRole(role)
			.then(function() {
				randomMember.addRole(role);
			})
			.catch(console.error);
	}
	else {
		randomMember.addRole(role).catch(console.error);
	}
}

schedule.scheduleJob({dayOfWeek: 0}, function() {
	newMemberForRole("blümchen der woche");
	logger.info('Selected new member of the week');
});
