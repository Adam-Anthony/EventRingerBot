const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '$';

var dotenv = require('dotenv');
dotenv.load();

var hoster = null;
var group = null;

var server = null;
var serverName = null;
var membersList = null;

var active = false;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.deleted) return;
    if (msg.content[0] !== prefix) return;



    var rung = msg.content.slice(1);

    if (/^ring +/i.test(rung) && (msg.channel.type === 'dm')) {
    	var parts = rung.slice(5).trim();
    	//.split( / ?\| ?/);
    	//console.log(parts);
    	if (parts.length <= 1) {
    		console.log('forgot parameters.');
    		return;
    	}
    	hoster = msg.author;
    	group = parts;//.split(/ ?(?=@)/g);
    	//channelName = parts[1];

    }
    if (msg.channel.type === 'dm') return;
    if (/^ring$/i.test(rung)){
    	//client.reply(msg.author.id)
    	if (msg.author.id === hoster.id){
    		msg.guild.member(msg.author).permissions.has('MANAGE_GUILD', true);

    		if (active){
    			var targets = membersList.filter(val => val.voiceChannel === undefined);
    			var callingList = Array.from(targets.values());
    			for (var i = callingList.length - 1; i >= 0; i--) {
    				if (!callingList[i].user.bot){
    					callingList[i].send("Hey, wake up!");
    				}
    			}
    		}else{
    			
    			server = msg.guild;
    			serverName = server.name;
    			membersList = server.members.filter(val => val.roles.filter(rol => rol.name === group));
    			var targets = membersList.filter(val => val.voiceChannel === undefined);
    			var callingList = Array.from(targets.values());
    			for (var i = callingList.length - 1; i >= 0; i--) {
    				if (!callingList[i].user.bot){
    					callingList[i].send("Hey, wake up!");
    				}
    			}
    			active = true;

    		}
    	}
    }

});

client.login(process.env.BOT_TOKEN);