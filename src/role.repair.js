/*
Algo followed by repair creep in below order:
- Get to correct room if not already there
- if in repairing mode
    - continue supplying energy to tower or find a new tower to supply energy to
    - continue repairing a structure if defined in memory and if it still needs repairs
    - find a new structure to repair in following order: MY_STRUCTURES except rampart, roads, walls/ramparts
- if in mining mode
    - find a non empty storage or container
    - mine a source
- move to neutral location if present
*/
var config = require('config');

var roleRepair = {

    run: function(creep) {
        var fContinue = true;

        // wall/rampart config values
        var max = config.wallsMax;
        var increment = config.wallsIncrement;

        if(fContinue && creep.memory.targetRoom && creep.room.name != creep.memory.targetRoom)
        {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            fContinue = false;
        }

        if(fContinue)
        {
            if(creep.memory.repairing && creep.carry.energy == 0) {
                creep.memory.repairing = false;
            }
            if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
                creep.memory.repairing = true;
            }

            if(creep.memory.repairing)
            {
                // try to fill a tower as first priority
                if(fContinue)
                {
                    // continue filling tower to full energy if were doing earlier
                    var currTower = null;
                    if(creep.memory.fillingTower)
                    {
                        currTower = Game.getObjectById(creep.memory.fillingTower);
                        if(!currTower || currTower.energy == currTower.energyCapacity)
                        {
                            currTower = null;
                            creep.memory.fillingTower = null;
                        }
                    }
                    // find a new tower if we dont have an existing one
                    if(!creep.memory.fillingTower)
                    {
                        var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_TOWER) && structure.energy < (structure.energyCapacity/1.5)
                        }});
                        if(targets.length > 0)
                        {
                            currTower = targets[0];
                            creep.memory.fillingTower = currTower.id;
                        }
                    }
                    // fill the target tower if any
                    if(currTower) {
                        if(creep.transfer(currTower,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(currTower, {visualizePathStyle: {stroke: '#00aa00'}, maxRooms : 1});
                        }
                        fContinue= false;
                    }
                }

                // continue repairing something if already in process
                if(fContinue && creep.memory.target)
                {
                    var currRepairTarget = Game.getObjectById(creep.memory.target);
                    if(!currRepairTarget || currRepairTarget.hits >= 
                        (currRepairTarget.structureType == STRUCTURE_WALL ||currRepairTarget.structureType == STRUCTURE_RAMPART ? creep.memory.targetHitpoints : currRepairTarget.hitsMax))
                    {
                        // done with this structure find a new one
                        creep.memory.target = null;
                    }
                }

                if(fContinue && !creep.memory.target)
                {
                    // try to find a non rampart/wall/road structure
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return  structure.structureType != STRUCTURE_RAMPART && 
                                    structure.structureType != STRUCTURE_WALL && 
                                    structure.structureType != STRUCTURE_ROAD && 
                                    structure.hits < (structure.hitsMax /1.5)
                        }
                    });
                    if(target) {
                        creep.memory.target = target.id;
                    }
                }

                if(fContinue && !creep.memory.target)
                {
                    // try to find a road to repair
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_ROAD && structure.hits < (structure.hitsMax /1.5)
                        }
                    });
                    if(target) {
                        creep.memory.target = target.id;
                    }
                }


                if(fContinue && !creep.memory.target)
                {
                    // try to find a wall or rampart to repair
                    for(var targetPoints = increment; !creep.memory.target && targetPoints <= max; targetPoints += increment )
                    {
                        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < targetPoints
                        }});
                        if(target) {
                            creep.memory.target = target.id;
                            creep.memory.targetHitpoints = targetPoints + increment;
                        }
                    }
                }

                // if any target to repair then go for it
                if(fContinue && creep.memory.target) {
                    var currRepairTarget = Game.getObjectById(creep.memory.target);
                    if(creep.repair(currRepairTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(currRepairTarget, {visualizePathStyle: {stroke: '#00aa00'}, maxRooms : 1});
                    }
                    fContinue = false;
                }
            }
            else
            {
                // harvest energy from somewhere
                if(fContinue)
                {
                    // try to get resource from any container or storage first
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
                    }});
                    if(target) {
                        if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {maxRooms : 1});
                        }
                        fContinue = false;
                    }
                }

                if(fContinue)
                {
                    // out of energy in storage. mine from a source
                    var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => {return source.energy > 0}});
                    if(source) {
                        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source, {visualizePathStyle: {stroke: '#ff0000'}, maxRooms : 1});
                        }
                        fContinue = false;
                    }
                }
            }
        }

        // Nothing to do
        if(fContinue && Game.flags[creep.pos.roomName])
        {
            creep.moveTo(Game.flags[creep.pos.roomName]);
        }
    }
};

module.exports = roleRepair;