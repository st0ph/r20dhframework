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

dh.careers = [
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
        var chararray = msg.content.replace("!cchar ", "").split(" ");

        if (dh.homeworld.contains(chararray[0].toLowerCase()) && chararray[0] !== "") {
            if (dh.careers.contains(chararray[1].toLowerCase()) && chararray[1] !== "") {
                if (chararray[2] !== "") {
                    sendChat("System", "<b>" + msg.who + " created the " + chararray[0] + " " + chararray[1] + " " + chararray[2]"</b>");
                } else {
                    sendChat("System", "<b> Character creation failed: No name specified <b>");
                }
            } else {
                sendChat("System", "<b> Character creation failed: Invalid Career </b>");
            }
        } else {
            sendChat("System", "<b> Character creation failed: Invalid Homeworld </b>");
        }
        return;
    }
};

dh.createPC = function createPC(homeworld, career) {};


on("ready", function () {
    on("chat:message", function (msg) {
        var chatCmd = dh.parseCommand(msg);
        if (typeof chatCmd === 'undefined') {
            return;
        }
    });
});