var config = {
    range : 10,
    harvesterCount : 1,
    wallsMax : 1000000,
    wallsIncrement: 1000,
    minCreepTicks : 75,
    directions : [TOP,TOP_RIGHT,RIGHT,BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT,LEFT,TOP_LEFT],

    receiverLinks : ["58b5a867215a75a42fe8272c"],

    attackTargets : ["58b25ad956fffb4764e37b1b"],

    selfUsername : 'arzo',

    creepRoleConfigs: {
        "defender" : {
            "tough" : 3,
            "move" : 2,
            "attack" : 1,
            "max" : 640
        },
        "attacker" : {
            "tough" : 1,
            "move" : 2,
            "attack" : 1,
            "max" : 950
        },
        "dismantler" : {
            "tough" : 1,
            "move" : 2,
            "work" : 1,
            "max" : 420
        },
        "healer" : {

        },
        "miner" : {
            "move" : 1,
            "work" : 2,
            "max" : 750 
        },
        "explorer" : {
            "move" : 1,
            "carry" : 2,
            "max" : 900
        },
        "provider" : {
            "move" : 1,
            "carry" : 1,
            "max" : 300
        },
        "repair" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1,
            "max" : 400
        },
        "builder" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1,
            "max" : 1000
        },
        "upgrader" : {
            "move" : 1,
            "carry" : 1,
            "work" : 3,
            "max" : 1200
        },
        "claim" : {
            "claim" : 1,
            "move" : 1,
            "max" : 650
        },
        "harvester" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1,
            "max" : 200

        }
    },

    spawnRoomConfig : {
        "W88S29" : {
            "W88S29" : {
                "miner" : 2,
                "provider" : 1,
                "repair" : 1,
                "upgrader" : 1,
                "builder" : 1,
                "explorer" : 2
            },
            "W87S29" : {
                "miner" : 1,
                "explorer" : 1,
                "builder" : 1
            }
        },
        "W89S29" : {
            "W89S29" : {
                "miner" : 2,
                "provider" : 1,
                "repair" : 1,
                "upgrader" : 1,
                "builder" : 2,
                "explorer" : 2
            },
            "W89S28" : {
                "miner" : 1,
                "explorer" : 1,
                "builder" : 1
            }
        }
    }
};

module.exports = config;