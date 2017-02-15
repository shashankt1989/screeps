var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var spawnUtility = require('spawn.utility');
var logicTower = require('logic.tower');
var roleExplorer = require('role.explorer');
var roleMiner = require('role.miner');
var roleClaim = require('role.claim');
var roleProvider = require('role.provider');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // testing zone

    // testing zone ends

    var currSpawn = Game.spawns['Spawn1']; 
    var currRoom = currSpawn.room;

    var towers = currRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER);
                }
            });
    towers.forEach(tower => logicTower.run(tower,currRoom));   
    
    var spawnCreeps = true;

    // if enough providers/miners present in room then turn all harvesters to miners
    var providers = _.filter(Game.creeps, (creep) => creep.memory.role == 'provider' && creep.room == currRoom);
    var harvesters = _.filter(Game.creeps, (creep) =>  creep.memory.role == 'harvester' && creep.room == currRoom);
    var currRoomMiners = _.filter(Game.creeps, (creep) =>  creep.memory.role == 'miner' && creep.memory.targetRoom == currRoom.name);
    
    if((providers.length == 0 || currRoomMiners.length == 0) && harvesters.length < 2)
    {
        // create an emergency harvester.
        var currEnergy = Math.min(currRoom.energyAvailable,600);
        spawnUtility.createCreep(currSpawn, 'harvester',
                                Math.max(1,currEnergy/200), // work count
                                Math.max(1,currEnergy/200), // carry count
                                Math.max(1,currEnergy/200), // move count
                                0);
        spawnCreeps = false;
    }
    else if(providers.length == 0)
    {
        // create an emergency provider
        var currEnergy = Math.min(currRoom.energyAvailable,800);
        spawnUtility.createCreep(currSpawn, 'provider',
                                1, // work count
                                Math.max(1,(2*(currEnergy-100))/150 ), // carry count
                                Math.max(1,(currEnergy-100)/150 ), // move count
                                0);
        spawnCreeps = false;
    }
    else
    {
        // Turn all harvesters into miners as we have provider present
        for(var creep of harvesters)
        {
            creep.memory.role = 'miner';
            creep.memory.targetRoom = currRoom.name;
            currRoomMiners++;
        }
    }
    
    if(spawnCreeps)
    {
        // keeping logic separate of spawn miners as they are sure to have roads which means they need less move parts.
        if(currRoomMiners.length < 2) {
            spawnUtility.createCreep(currSpawn, 'miner',4,6,5,0);
        }
        
        if(providers.length < 2 && currRoom.energyAvailable < currRoom.energyCapacityAvailable) {
            spawnUtility.createCreep(currSpawn, 'provider',1,9,5,0);
        }

        var rooms = ["W82N9"];
        for(var room of rooms)
        {
            var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.targetRoom == room);
            if(miners.length < 3) {
                spawnUtility.createCreep(currSpawn, 'miner',4,5,8,0,room);
            }

            var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claim' && creep.memory.targetRoom == room);
            var claimTicks = 9999;
            if(Game.rooms[room])
            {
                claimTicks = Game.rooms[room].controller.reservation['ticksToEnd']; 
            }
            if(claimers.length < (claimTicks<1000 ? 2 : 1) ) {
                spawnUtility.createCreep(currSpawn, 'claim',0,0,3,1,room);
            }            
        }

        var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer');
        if(explorers.length < 4) {
            spawnUtility.createCreep(currSpawn, 'explorer',1,13,7,0);
        }
        
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if(upgraders.length < 1) {
            spawnUtility.createCreep(currSpawn, 'upgrader',1,2,2,0);
        }
        else if(upgraders.length < 2) {
            spawnUtility.createCreep(currSpawn, 'upgrader',5,7,6,0);
        }

        var rooms = [currRoom.name, "W82N9"];
        for(var room of rooms)
        {
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.targetRoom == room);
            var buildCount = 0;
            if(Game.rooms[room])
                buildCount = Game.rooms[room].find(FIND_CONSTRUCTION_SITES).length;
            if(builders.length < 2 && buildCount > 0) {
                spawnUtility.createCreep(currSpawn, 'builder',5,7,6,0,room);
            }

            var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair' && creep.memory.targetRoom == room);
            if(repairs.length < 1) {
                spawnUtility.createCreep(currSpawn, 'repair',2,2,2,0,room);
            }
        }
        
    }

    var rooms = [currRoom.name, "W82N9"];
    for(var room of rooms)
    {
        if(Game.rooms[room])
            spawnUtility.pickupDroppedResources(Game.rooms[room]);
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'explorer') {
            roleExplorer.run(creep,currRoom,"W82N9");
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
        if(creep.memory.role == 'claim') {
            roleClaim.run(creep);
        }
        if(creep.memory.role == 'provider') {
            roleProvider.run(creep);
        }
        
    }
}
