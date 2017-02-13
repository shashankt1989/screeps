var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var spawnUtility = require('spawn.utility');
var logicTower = require('logic.tower');
var roleExplorer = require('role.explorer');

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

    var buildCount = currRoom.find(FIND_CONSTRUCTION_SITES).length;
    if(buildCount == 0)
    {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == "builder")
                creep.memory.role = 'upgrader';
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length<1) {
        spawnUtility.createCreep(currSpawn, 'harvester',1,1,1);
    }
    else 
    {
        if(harvesters.length < 3) {
            spawnUtility.createCreep(currSpawn, 'harvester',4,7,6);
        }
        
        var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer');
        if(explorers.length < 4) {
            spawnUtility.createCreep(currSpawn, 'explorer',2,8,11);
        }
        
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if(upgraders.length < 1) {
            spawnUtility.createCreep(currSpawn, 'upgrader',1,1,2);
        }
        else if(upgraders.length < 2) {
            spawnUtility.createCreep(currSpawn, 'upgrader',5,7,8);
        }
        
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        if(builders.length < 2 && buildCount > 0) {
            spawnUtility.createCreep(currSpawn, 'builder',5,7,8,currRoom.name);
        }
        
        var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
        if(repairs.length < 2) {
            spawnUtility.createCreep(currSpawn, 'repair',1,1,2);
        }
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
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
        
    }
}
