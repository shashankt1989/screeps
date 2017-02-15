var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var spawnUtility = require('spawn.utility');
var logicTower = require('logic.tower');
var roleExplorer = require('role.explorer');
var roleMiner = require('role.miner');
var roleClaim = require('role.claim');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
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

    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length<1) {
        spawnUtility.createCreep(currSpawn, 'harvester',1,1,1,0);
    }
    else 
    {
        if(harvesters.length < 3) {
            spawnUtility.createCreep(currSpawn, 'harvester',4,7,6,0);
        }
        
        var rooms = ["W82N9"];
        for(var room of rooms)
        {
            var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.targetRoom == room);
            if(miners.length < 2) {
                spawnUtility.createCreep(currSpawn, 'miner',4,5,8,0,room);
            }

            var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claim' && creep.memory.targetRoom == room);
            if(claimers.length < 2) {
                spawnUtility.createCreep(currSpawn, 'claim',0,0,3,1,room);
            }            
        }

        var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer');
        if(explorers.length < 2) {
            spawnUtility.createCreep(currSpawn, 'explorer',1,11,6,0);
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
            if(repairs.length < 2) {
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
        
    }
}
