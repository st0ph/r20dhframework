var dh = dh || {};

/* Dice Types */

dh.dice100 = "1d100";
dh.dice10 = "1d10";
dh.dice5 = "1d5";

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
    sendChat("CC", "/r 2d10+" + dh.attr[i].mod[dh.homeWorld.indexOf(world)], function (rolls) {
        var parsed = JSON.parse(rolls[0].content);
        sendChat("CC", dh.attr[i].name + ":<b> " + parsed.total + "</b> <i>(" + parsed.rolls[0].results[0].v + "+" + parsed.rolls[0].results[1].v + ")</i>");

        createObj("attribute", {
            name: dh.attr[i].name,
            current: parsed.total,
            characterid: pc.id
        });
    });
};

/*Iterate trough all Characteristics and roll them */
dh.setCharacteristics = function setCharacteristics(world, pc) {

    sendChat("CC", "<b>Rolling Characteristics - " + world + "</b>");
    for (var i in dh.attr) {
        dh.rollCharacteristics(i, world, pc);
    }
    return;
};

dh.rollWounds = function rollWounds(world, pc) {
    sendChat("CC", "/r 1d5+" + dh.wounds[dh.homeWorld.indexOf(world)], function (rolls) {
        var parsed = JSON.parse(rolls[0].content);
        sendChat("CC", "Wounds:<b> " + parsed.total + "</b> <i>(" + parsed.rolls[0].results[0].v + ")</i>");

        createObj("attribute", {
            name: 'Wounds',
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
    /*dh.rollFate(world, pcobj);
    dh.rollWealth(career, pcobj);
    createHomeWorldSkills(settings[0], pcobj);
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