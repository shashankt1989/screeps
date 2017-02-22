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

        // if enough providers/miners present in room then turn all harvesters to miners
        var providers = _.filter(Game.creeps, (creep) => creep.memory.role == 'provider' && creep.memory.targetRoom == currRoom.name);
        var harvesters = _.filter(Game.creeps, (creep) =>  creep.memory.role == 'harvester' && creep.memory.targetRoom == currRoom.name);
        var currRoomMiners = _.filter(Game.creeps, (creep) =>  creep.memory.role == 'miner' && creep.memory.targetRoom == currRoom.name);
        
        if((providers.length == 0 || currRoomMiners.length == 0) && harvesters.length < 2)
        {
            // create an emergency harvester.
            var currEnergy = Math.min(currRoom.energyAvailable,600);
            spawnUtility.createCreep(currSpawn, 'harvester',
                                    Math.max(1,Math.floor(currEnergy/200)), // work count
                                    Math.max(1,Math.floor(currEnergy/200)), // carry count
                                    Math.max(1,Math.floor(currEnergy/200)), // move count
                                    0, currRoom.name);
            spawnCreeps = false;
        }
        else if(providers.length == 0)
        {
            // create an emergency provider
            var currEnergy = Math.min(currRoom.energyAvailable,800);
            spawnUtility.createCreep(currSpawn, 'provider',
                                    0, // work count
                                    Math.max(1,Math.floor((2*currEnergy)/150) ), // carry count
                                    Math.max(1,Math.floor(currEnergy/150) ), // move count
                                    0, currRoom.name);
            spawnCreeps = false;
        }
        else
        {
            // Turn all harvesters into miners as we have provider present
            for(var creep of harvesters)
            {
                creep.memory.role = 'miner';
                creep.memory.targetRoom = currRoom.name;
            }
        }
        
        var rooms = [currRoom.name, "W82N9"/*, "W81N8"*/];
        if(spawnCreeps)
        {      
            for(var room of rooms)
            {
                for(var role in config.creepRoleConfigs)
                {
                    if (!config.creepRoleConfigs.hasOwnProperty(role)) {
                        continue;
                    }
        
                    if(spawnCreeps && spawnUtility.shouldCreateCreep(room,role)) {
                        spawnCreeps = !spawnUtility.createCreep(currSpawn, role, room);
                    }

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
