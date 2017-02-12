var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var spawnUtility = require('spawn.utility');
var logicTower = require('logic.tower');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

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
    if(harvesters.length < 2) {
        currSpawn.createCreep([WORK,CARRY,MOVE], "Harvester - " + Game.time.toString(), {role: 'harvester'});
    }
    else 
    {
        if(harvesters.length < 5) {
            currSpawn.createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "Harvester - " + Game.time.toString(), {role: 'harvester'});
        } 
        
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if(upgraders.length < 1) {
            currSpawn.createCreep([WORK,CARRY,MOVE,MOVE], "Upgrader - " + Game.time.toString(), {role: 'upgrader'});
        }
        else if(upgraders.length < 3) {
            currSpawn.createCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "Upgrader - " + Game.time.toString(), {role: 'upgrader'});
        }
        
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        if(builders.length < 6 && buildCount > 0) {
            currSpawn.createCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "Builder - " + Game.time.toString(), {role: 'builder'});
        }
        
        var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
        if(repairs.length < 3) {
            currSpawn.createCreep([WORK,WORK,CARRY,MOVE,MOVE], "Repair - " + Game.time.toString(), {role: 'repair'});
        }
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
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