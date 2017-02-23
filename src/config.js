var config = {
    range : 10,
    harvesterCount : 1,
    wallsMax : 200000,
    wallsIncrement: 10000,

    creepRoleConfigs: {
        "defender" : {
            "tough" : 0,
            "move" : 1,
            "attack" : 1
        },
        "miner" : {
            "move" : 1,
            "work" : 3 
        },
        "explorer" : {
            "move" : 4,
            "carry" : 4
        },
        "provider" : {
            "move" : 2,
            "carry" : 2
        },
        "repair" : {
            "move" : 1,
            "carry" : 1,
            "work" : 1
        },
        "builder" : {
            "move" : 2,
            "carry" : 2,
            "work" : 1
        },
        "upgrader" : {
            "move" : 2,
            "carry" : 2,
            "work" : 2
        },
        "claim" : {
            "claim" : 1,
            "move" : 1
        },
        "harvester" : {
            "move" : 1,
            "carry" : 2,
            "work" : 1

        }
    },

    spawnRoomConfig : {
        "W28N81" : {
            "W28N81" : {
                "miner" : 2,
                "provider" : 0,
                "repair" : 0,
                "upgrader" : 3,
                "builder" : 3,
                "explorer" : 2,
            }
        }
    }
};

module.exports = config;