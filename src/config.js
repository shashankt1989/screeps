var config = {
    range : 10,
    harvesterCount : 2,

    creepRoleConfigs: {
        "defender" : {
            "tough" : 2,
            "move" : 3,
            "attack" : 1
        },
        "miner" : {
            "move" : 1,
            "work" : 1 
        },
        "explorer" : {
            "move" : 2,
            "carry" : 2
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
        "Spawn1" : {
            "W28N81" : {
                "miner" : 0,
                "provider" : 0,
                "repair" : 1,
                "upgrader" : 2,
                "builder" : 2,
                "explorer" : 0,
            }
        }
    }
};

module.exports = config;