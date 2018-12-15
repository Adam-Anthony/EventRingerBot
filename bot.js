const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '$';

var dotenv = require('dotenv');
dotenv.load();

var membersList = null;

var guildsMap = {};

var active = false;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.deleted) return;
    if (msg.content[0] !== prefix) return;
    if (msg.channel.type === 'dm') return;


    var rung = msg.content.slice(1);

    if (/^setup +/i.test(rung)){
        if (!msg.guild.member(msg.author).permissions.has('MANAGE_GUILD', true)) return;
    	var roleTrgt = rung.slice(5).trim();
    	//.split( / ?\| ?/);
    	//console.log(parts);
    	if (roleTrgt.length <= 1) {
    		console.log('forgot parameters.');
    		return;
    	}
        var server = msg.guild;
        //console.log(msg.guild);
        //
        var roleCall = Array.from(server.roles);
        var match = false;
        for (var i = roleCall.length - 1; i >= 0; i--) {
            if (roleCall[i][1].name === roleTrgt){
                match = true;
                break;
            }
        }
        if (match===false){
            msg.reply('Can\'t find that role, sorry.');
            return;
        }
        //
        guildsMap[server.id] = roleTrgt;
    }

    if (rung === 'ring'){
        var server = msg.guild; 
    	if (guildsMap[server.id] != undefined){
            //console.log('in guildsMap')
    		if (server.member(msg.author).permissions.has('MANAGE_GUILD', true)){
                console.log('Cleared author check.')
                console.log(guildsMap[server.id]);
                var membersList = Array.from(server.members.values());
                var outacall = membersList.filter(val => val.voiceChannel == undefined);
                var paging = outacall.filter(val => val.roles.find(rol => rol.name === guildsMap[server.id]));

    			for (var i = paging.length - 1; i >= 0; i--) {
    				if (!paging[i].user.bot){
                        //console.log('paging: '+paging[i].user.username);
    					paging[i].send(`Hey , wake up ${guildsMap[server.id]}! You are needed in ${server.name}`);
    				}
    			}
    		}
    	}
    }

});

client.login(process.env.BOT_TOKEN);