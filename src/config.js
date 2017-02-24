var config = {
    range : 10,
    harvesterCount : 1,
    wallsMax : 200000,
    wallsIncrement: 10000,
    minCreepTicks : 75,

    creepRoleConfigs: {
        "defender" : {
            "tough" : 0,
            "move" : 1,
            "attack" : 1,
            "max" : 130
        },
        "miner" : {
            "move" : 1,
            "work" : 2 
        },
        "explorer" : {
            "move" : 1,
            "carry" : 2
        },
        "provider" : {
            "move" : 1,
            "carry" : 1,
            "max" : 100
        },
        "repair" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1,
            "max" : 200
        },
        "builder" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1
        },
        "upgrader" : {
            "move" : 1,
            "carry" : 2,
            "work" : 2
        },
        "claim" : {
            "claim" : 1,
            "move" : 1
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
                "upgrader" : 3,
                "builder" : 3,
                "explorer" : 3,
            },
            "W89S29" : {
                "explorer" : 1
            }
        }
    }
};

module.exports = config;