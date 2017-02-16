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
    var providers = _.filter(Game.creeps, (creep) => creep.memory.role == 'provider' && creep.memory.targetRoom == currRoom.name);
    var harvesters = _.filter(Game.creeps, (creep) =>  creep.memory.role == 'harvester' && creep.memory.targetRoom == currRoom.name);
    var currRoomMiners = _.filter(Game.creeps, (creep) =>  creep.memory.role == 'miner' && creep.memory.targetRoom == currRoom.name);
    
    if((providers.length == 0 || currRoomMiners.length == 0) && harvesters.length < 2)
    {
        // create an emergency harvester.
        var currEnergy = Math.min(currRoom.energyAvailable,600);
        spawnUtility.createCreep(currSpawn, 'harvester',
                                Math.max(1,currEnergy/200), // work count
                                Math.max(1,currEnergy/200), // carry count
                                Math.max(1,currEnergy/200), // move count
                                0, currRoom.name);
        spawnCreeps = false;
    }
    else if(providers.length == 0)
    {
        // create an emergency provider
        var currEnergy = Math.min(currRoom.energyAvailable,800);
        spawnUtility.createCreep(currSpawn, 'provider',
                                0, // work count
                                Math.max(1,(2*currEnergy)/150 ), // carry count
                                Math.max(1,currEnergy/150 ), // move count
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
            currRoomMiners++;
        }
    }
    
    if(spawnCreeps)
    {      
        if(providers.length < 2 && currRoom.energyAvailable < currRoom.energyCapacityAvailable) {
            spawnUtility.createCreep(currSpawn, 'provider',0,10,5,0, currRoom.name);
        }

        var rooms = [currRoom.name, "W82N9"];
        for(var room of rooms)
        {
            if(spawnUtility.shouldCreateCreep(room,'claim')) {
                spawnUtility.createCreep(currSpawn, 'claim',0,0,1,1,room);
            }

            if(spawnUtility.shouldCreateCreep(room,'upgrader')) {
                spawnUtility.createCreep(currSpawn, 'upgrader',4,4,4,0, currRoom.name);
            }

            if(spawnUtility.shouldCreateCreep(room,'miner')) {
                spawnUtility.createCreep(currSpawn, 'miner',4,6,5,0,room);
            }
            if(spawnUtility.shouldCreateCreep(room,'builder')) {
                spawnUtility.createCreep(currSpawn, 'builder',5,7,6,0,room);
            }

            if(spawnUtility.shouldCreateCreep(room,'repair')) {
                spawnUtility.createCreep(currSpawn, 'repair',1,3,2,0,room);
            }

            if(spawnUtility.shouldCreateCreep(room,'explorer')) {
                spawnUtility.createCreep(currSpawn, 'explorer',0,14,7,0,room);
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
        // skip creeps which have special role defined. 
        // currently only collector role supported
        if(creep.memory.specialRole)
            continue;
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
        
    }
}
