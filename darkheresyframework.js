var dh = dh || {};

/* Home World */

dh.homeWorld = [
    'feral',
    'hive',
    'imperial',
    'void'];

/* Careers */

dh.career = [
    'adept',
    'arbitrator',
    'assassin',
    'cleric',
    'guardsmen',
    'psyker',
    'scum',
    'techpriest'];

/* Attributes (Characteristics) */

dh.attr = [];
dh.attr.ws = {
    name: "WS",
    mod: [20, 20, 20, 20]
};
dh.attr.bs = {
    name: "BS",
    mod: [20, 20, 20, 20]
};
dh.attr.str = {
    name: "S",
    mod: [25, 20, 20, 15]
};
dh.attr.t = {
    name: "T",
    mod: [25, 15, 20, 20]
};
dh.attr.ag = {
    name: "Ag",
    mod: [20, 20, 20, 20]
};
dh.attr.inte = {
    name: "Int",
    mod: [20, 20, 20, 20]
};
dh.attr.per = {
    name: "Per",
    mod: [20, 20, 20, 20]
};
dh.attr.wp = {
    name: "WP",
    mod: [15, 20, 20, 25]
};
dh.attr.fel = {
    name: "Fel",
    mod: [15, 25, 20, 20]
};

dh.wounds = [
    '9',
    '8',
    '8',
    '6'];

dh.fate = [
    [1, 2, 2],
    [1, 2, 3],
    [2, 2, 3],
    [2, 3, 3]
];

dh.wealth = [
             [100,1,10],
             [50,2,10],
             [120,3,10],
             [300,5,10],
             [70,1,10],
             [50,1,5],
             [10,1,5],
             [150,1,10]
             ];

dh.parseCommand = function parseCommand(msg) {
    /* !cchar creates a new Player Character
     *  Parameters: !cchar homeworld career name
     */
    if (msg.type == "api" && msg.content.indexOf("!cchar ") !== -1) {
    	
        var charsetting = msg.content.replace("!cchar ", "").split(" ");
        var whispertarget = msg.who.split(" ").reverse().pop();
        var world = charsetting[0];
        var career = charsetting[1];
        var name = charsetting[2];

        /* Consistency checks */
        if (world === undefined || career === undefined || name === undefined) {
            sendChat("System", "/w " + whispertarget + " <b><i>Can't create PC: Missing arguments</i></b>");
            log("Error: " + msg.who + "tried to create a PC but it failed. Reason: missing arguments");
            return;
        }

        if (dh.homeWorld.indexOf(world) === -1) {
            sendChat("System", "/w " + whispertarget + " <b><i>Can't create PC: Invalid Home World</i></b>");
            log("Error: " + msg.who + " tried to create a PC but it failed. Reason: invalid arguments");
            return;
        }

        if (dh.career.indexOf(career) === -1) {
            sendChat("System", "/w " + whispertarget + " <b><i>Can't create PC: Invalid Career</i></b>");
            log("Error: " + msg.who + " tried to create a PC but it failed. Reason: invalid arguments");
            return;
        }
        sendChat("System", "<b><i> Creating a PC for " + msg.who);
        log("Creating:" + world + " " + career + " " + name);
        dh.createPC(world, career, name, msg.who);
        return;
    }
};

/*Roll and write Characteristics for the PC*/
dh.rollCharacteristics = function rollCharacteristics(i, world, pc) {
    sendChat("", "/r 2d10+" + dh.attr[i].mod[dh.homeWorld.indexOf(world)], function (rolls) {
        var parsed = JSON.parse(rolls[0].content);
        sendChat("", dh.attr[i].name + ":<b> " + parsed.total + "</b> <i>(" + parsed.rolls[0].results[0].v + "+" + parsed.rolls[0].results[1].v + ")</i>");
        createObj("attribute", {
            name: dh.attr[i].name,
            current: parsed.total,
            characterid: pc.id
        });
    });
};

/*Iterate trough all Characteristics and roll them */
dh.setCharacteristics = function setCharacteristics(world, pc) {
    sendChat("", "/em <b>Rolling Characteristics - " + world + "</b>");
    for (var i in dh.attr) {
        dh.rollCharacteristics(i, world, pc);
    }
    return;
};

dh.rollWounds = function rollWounds(world, pc) {
    sendChat("", "/r 1d5+" + dh.wounds[dh.homeWorld.indexOf(world)], function (rolls) {
        var parsed = JSON.parse(rolls[0].content);
        sendChat("", "Wounds:<b> " + parsed.total + "</b> <i>(" + parsed.rolls[0].results[0].v + ")</i>");
        createObj("attribute", {
            name: 'Wounds',
            current: '0',
            max: parsed.total,
            characterid: pc.id
        });
    });
};

dh.rollFate = function rollFate(world, pc) {
    var fate = 0;
    var i = dh.homeWorld.indexOf(world);
    sendChat("", "/r 1d10", function (rolls) {
        var parsed = JSON.parse(rolls[0].content);
        switch (parsed.total) {
            case 1:
            case 2:
            case 3:
            case 4:
                fate = dh.fate[i][0];
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                fate = dh.fate[i][1];
                break;
            case 9:
            case 10:
                fate = dh.fate[i][2];
                break;
            default:
                log("Error: Unreachable Part of Code: rollFate");
        }
        sendChat("", "Fate Points:<b> " + fate + "</b> <i>(" + parsed.rolls[0].results[0].v + ")</i>");
        createObj("attribute", {
            name: 'Fate Points',
            current: fate,
            characterid: pc.id
        });
    });
};

dh.rollWealth = function rollWealth(career, pc) {
	var i = dh.career.indexOf(career);
	sendChat("", "/r " + dh.wealth[i][1] + "d" + dh.wealth[i][2] + "+" + dh.wealth[i][0], function(rolls){
        var parsed = JSON.parse(rolls[0].content);
        
        createObj("attribute", {
            name: 'Wealth',
            current: parsed.total,
            characterid: pc.id
        });
	});
};

dh.createPC = function createPC(world, career, name, who) {
    /* Create the PC in the Journal with all the Skill, Traits and Charateristics Rolls */
    var pcobj = createObj("character", {
        name: name,
        inplayerjournals: 'all'
    });

    dh.setCharacteristics(world, pcobj);
    dh.rollWounds(world, pcobj);
    dh.rollFate(world, pcobj);
    dh.rollWealth(career, pcobj);
    /*createHomeWorldSkills(settings[0], pcobj);
    createHomeWorldTraits(settings[0], pcobj);
    createCareerSkills(settings[1], pcobj);
    createCareerTalents(settings[1], pcobj);
    createCareerGear(settings[1], pcobj);
    finishPC(settings,who);*/
};


on("ready", function () {
    on("chat:message", function (msg) {
        var chatCmd = dh.parseCommand(msg);
        if (typeof chatCmd === 'undefined') {
            return;
        }
    });
});