var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var spawnUtility = require('spawn.utility');
var logicTower = require('logic.tower');
var logicLink = require('logic.link');
var roleExplorer = require('role.explorer');
var roleMiner = require('role.miner');
var roleClaim = require('role.claim');
var roleProvider = require('role.provider');
var roleDefender = require('role.defender');
var config = require('config');


module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // testing zone

    // testing zone ends

    // iterate over spawns
    for(var spawnName in config.spawnRoomConfig)
    {
        if (!config.spawnRoomConfig.hasOwnProperty(spawnName)) {
            continue;
        }

        var currSpawn = Game.spawns[spawnName]; 
        var currRoom = currSpawn.room;

        var rooms = [];
        for(var roomName in config.spawnRoomConfig[spawnName])
        {
            if (!config.spawnRoomConfig[spawnName].hasOwnProperty(roomName)) {
                continue;
            }
            rooms.push(roomName);
        }

        var towers = currRoom.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER);
                    }
                });
        towers.forEach(tower => logicTower.run(tower,currRoom));

        var links = currRoom.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK && structure.cooldown == 0);
                    }
                });
        links.forEach(link => logicLink.run(link));

        var spawnCreeps = true;

        // if enough providers/explorers/miners present in room then turn all harvesters to miners
        var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer' && creep.memory.targetRoom == currRoom.name && creep.memory.sourceRoom == currRoom.name);
        var harvesters = _.filter(Game.creeps, (creep) =>  creep.memory.role == 'harvester' && creep.memory.targetRoom == currRoom.name);
        var providers = _.filter(Game.creeps, (creep) =>  creep.memory.role == 'provider' && creep.memory.targetRoom == currRoom.name);
        var miners = _.filter(Game.creeps, (creep) =>  creep.memory.role == 'miner' && creep.memory.targetRoom == currRoom.name);
        
        if((providers.length == 0 || miners.length == 0 || explorers.length == 0) && harvesters.length < config.harvesterCount)
        {
            // create an emergency harvester.
            spawnUtility.createCreep(currSpawn, 'harvester', currRoom.name);
            spawnCreeps = false;
        }
        

        // get current room miners as top priority
        var roles = ["miner","explorer","provider"];
        for(var role of roles)
        {       
            if(spawnCreeps && spawnUtility.shouldCreateCreep(spawnName,currRoom.name,role)) {
                spawnUtility.createCreep(currSpawn, role, currRoom.name);
                spawnCreeps = false;
            }
        }


        // check if we need to defend any room
        //for(var room of rooms)
        {
            var room = currRoom.name;
            if(!Game.rooms[room])
                continue;

            var hostiles = Game.rooms[room].find(FIND_HOSTILE_CREEPS);
            var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.memory.targetRoom == room);
            if(spawnCreeps && hostiles.length > 0 && defenders.length < hostiles.length)
            {
                spawnUtility.createCreep(currSpawn, "defender", room);
                spawnCreeps = false;
            }
        }


        var roles = ["miner","explorer","provider","defender"];
        for(var room of rooms)
        {
            for(var role of roles)
            {       
                if(spawnCreeps && spawnUtility.shouldCreateCreep(spawnName,room,role)) {
                    spawnUtility.createCreep(currSpawn, role, room);
                    spawnCreeps = false;
                }
            }
        }

        var roles = ["upgrader","builder","claim"];
        for(var room of rooms)
        {
            for(var role of roles)
            {       
                if(spawnCreeps && spawnUtility.shouldCreateCreep(spawnName,room,role)) {
                    spawnUtility.createCreep(currSpawn, role, room);
                    spawnCreeps = false;
                }
            }
        }

        var roles = ["repair"];
        for(var room of rooms)
        {
            for(var role of roles)
            {       
                if(spawnCreeps && spawnUtility.shouldCreateCreep(spawnName,room,role)) {
                    spawnUtility.createCreep(currSpawn, role, room);
                    spawnCreeps = false;
                }
            }
        }

        for(var room of rooms)
        {
            if(Game.rooms[room])
                spawnUtility.pickupDroppedResources(Game.rooms[room]);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        // skip creeps which have special role defined. 
        // currently only collector role supported
        if(creep.memory.specialRole) {
            continue;
        }
        else if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        else if(creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
        else if(creep.memory.role == 'claim') {
            roleClaim.run(creep);
        }
        else if(creep.memory.role == 'provider') {
            roleProvider.run(creep);
        }
        else if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        
    }
}
