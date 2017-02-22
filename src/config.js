var config = {

    creepRoleConfigs: {
        "defender" : {
            "tough" : 3,
            "move" : 6,
            "attack" : 3
        },
        "miner" : {
            "move" : 3,
            "work" : 6 
        },
        "explorer" : {
            "move" : 6,
            "carry" : 12
        },
        "provider" : {
            "move" : 3,
            "carry" : 6
        },
        "repair" : {
            "move" : 2,
            "carry" : 3,
            "work" : 1
        },
        "builder" : {
            "move" : 6,
            "carry" : 7,
            "work" : 5
        },
        "upgrader" : {
            "move" : 4,
            "carry" : 10,
            "work" : 6
        }
    },

    spawnRoomConfig : {
        "W81N9" : {
            "W81N9" : {
                "miner" : 1,
                "provider" : 1,
                "repair" : 2,
                "upgrader" : 3,
                "builder" : 2,
                "explorer" : 1,

            },
            "W82N9" : {
                "miner" : 0,
                "repair" : 0,
                "explorer" : 0,
                "builder" : 0,
                "defender" : 1
            },
            "W81N8" : {
                "miner" : 0,
                "repair" : 0,
                "claim" : 0,
                "explorer" : 0,
                "builder" : 0
            }
        }
    }
};

module.exports = config;