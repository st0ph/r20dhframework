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
    name: "Weapon-Skill",
    current: 0,
    max: 0
};
dh.attr.bs = {
    name: "Ballistic-Skill",
    current: 0,
    max: 0
};
dh.attr.s = {
    name: "Strength",
    current: 0,
    max: 0
};
dh.attr.t = {
    name: "Toughness",
    current: 0,
    max: 0
};
dh.attr.ag = {
    name: "Agility",
    current: 0,
    max: 0
};
dh.attr.intel = {
    name: "Intelligence",
    current: 0,
    max: 0
};
dh.attr.per = {
    name: "Perception",
    current: 0,
    max: 0
};
dh.attr.wp = {
    name: "Willpower",
    current: 0,
    max: 0
};
dh.attr.fel = {
    name: "Fellowship",
    current: 0,
    max: 0
};


dh.parseCommand = function parseCommand(msg) {
    /* !cchar creates a new Player Character
     *  Parameters: !cchar homeworld career name
     */
    if (msg.type == "api" && msg.content.indexOf("!cchar ") !== -1) {
        var charsetting = msg.content.replace("!cchar ", "").split(" ");
        var whispertarget = msg.who.split(" ").reverse().pop();

        /* Consistency checks */
        if (charsetting[0] === undefined || charsetting[1] === undefined || charsetting[2] === undefined) {
            sendChat("System", "/w " + whispertarget + " <b><i>Can't create PC: Invalid arguments</i></b>");
            log("Error: " + msg.who + "tried to create a PC but it failed. Reason: invalid arguments");
            return;
        }

        if (dh.homeWorld.indexOf(charsetting[0]) === -1) {
            sendChat("System", "/w " + whispertarget + " <b><i>Can't create PC: Invalid Home World</i></b>");
            log("Error: " + msg.who + " tried to create a PC but it failed. Reason: invalid arguments");
            return;
        }

        if (dh.career.indexOf(charsetting[1]) === -1) {
            sendChat("System", "/w " + whispertarget + " <b><i>Can't create PC: Invalid Career</i></b>");
            log("Error: " + msg.who + " tried to create a PC but it failed. Reason: invalid arguments");
            return;
        }

        dh.createPC(charsetting[0], charsetting[1]);
        sendChat("System", "/w " + whispertarget + " <b><i> Successfully created the " + charsetting[0] + " " + charsetting[1] + " " + charsetting[2] + "</b>");
        return;
    }
};


on("ready", function () {
    on("chat:message", function (msg) {
        var chatCmd = dh.parseCommand(msg);
        if (typeof chatCmd === 'undefined') {
            return;
        }
    });
});