var config = {
    range : 10,
    harvesterCount : 1,
    wallsMax : 300000,
    wallsIncrement: 10000,
    minCreepTicks : 75,
    directions : [TOP,TOP_RIGHT,RIGHT,BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT,LEFT,TOP_LEFT],

    receiverLinks : ["58b5a867215a75a42fe8272c"],

    attackTargets : [],

    creepRoleConfigs: {
        "defender" : {
            "tough" : 0,
            "move" : 1,
            "attack" : 1,
            "max" : 130
        },
        "attacker" : {
            "tough" : 1,
            "move" : 2,
            "attack" : 1,
            "max" : 600
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
            "carry" : 2,
            "work" : 2,
            "max" : 350
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
            "work" : 2
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
                "upgrader" : 2,
                "builder" : 2,
                "explorer" : 2
            },
            "W87S29" : {
                "miner" : 1,
                "claim" : 1,
                "explorer" : 1
            }
        },
        "W89S29" : {
            "W89S29" : {
                "miner" : 2,
                "provider" : 1,
                "repair" : 1,
                "upgrader" : 3,
                "builder" : 2,
                "explorer" : 2
            }
        }
    }
};

module.exports = config;