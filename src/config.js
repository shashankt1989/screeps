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
            "attack" : 1
        },
        "miner" : {
            "move" : 1,
            "work" : 2 
        },
        "explorer" : {
            "move" : 1,
            "carry" : 1
        },
        "provider" : {
            "move" : 1,
            "carry" : 1
        },
        "repair" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1
        },
        "builder" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1
        },
        "upgrader" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1
        },
        "claim" : {
            "claim" : 1,
            "move" : 1
        },
        "harvester" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1

        }
    },

    spawnRoomConfig : {
        "W88S29" : {
            "W88S29" : {
                "miner" : 1,
                "provider" : 0,
                "repair" : 0,
                "upgrader" : 1,
                "builder" : 1,
                "explorer" : 1,
            },
            "W89S29" : {
                "defender" : 2
            }
        }
    }
};

module.exports = config;