var config = require('config');

var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var wallHitpoints = 120000;
        if(creep.memory.targetRoom && creep.room.name != creep.memory.targetRoom)
        {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        }
        else
        {        

            if(creep.memory.repairing && creep.carry.energy == 0) {
                creep.memory.repairing = false;
            }
            if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
                creep.memory.repairing = true;
            }

            if(creep.memory.repairing) {
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
                        }
                    });
                    if(targets.length > 0)
                    {
                        currTower = targets[0];
                        creep.memory.fillingTower = currTower.id;
                    }
                }
                // fill the target tower if any
                if(currTower) {
                    if(creep.transfer(currTower,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(currTower, {visualizePathStyle: {stroke: '#00aa00'}});
                    }
                }
                else
                {
                    // try to find something to repair
                    // if already repairing something then check if it still needs repairs
                    if(creep.memory.target)
                    {
                        var currRepairTarget = Game.getObjectById(creep.memory.target);
                        if(!currRepairTarget || currRepairTarget.hits >= 
                            (currRepairTarget.structureType == STRUCTURE_WALL ||currRepairTarget.structureType == STRUCTURE_RAMPART ? wallHitpoints : currRepairTarget.hitsMax))
                        {
                            // done with this structure find a new one
                            creep.memory.target = null;
                        }
                    }
                    // try to find a new target to repair
                    if(!creep.memory.target)
                    {
                        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_STORAGE ||
                                    structure.structureType == STRUCTURE_TOWER ||
                                    structure.structureType == STRUCTURE_ROAD ||
                                    (   (structure.structureType == STRUCTURE_RAMPART || 
                                        structure.structureType == STRUCTURE_WALL) && structure.hits < wallHitpoints)

                                    )  && structure.hits < (structure.hitsMax /1.5)
                            }
                        });
                        if(target) {
                            creep.memory.target = target.id;
                        }

                    }    
                    // if any target to repair then go for it else switch to upgrader
                    if(creep.memory.target) {
                        var currRepairTarget = Game.getObjectById(creep.memory.target);
                        if(creep.repair(currRepairTarget) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(currRepairTarget, {visualizePathStyle: {stroke: '#00aa00'}});
                        }
                    }
                    else
                    {
                        // nothing to repair currently
                        // dismantle enemy construction sites
                        var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: (site) => {return !site.my}});
                        if(target)
                        {
                            if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                            }
                        }
                    }
                }
            }
            else {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE || 
                                    structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
                        }
                    });
                if(target) {
                    if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    // out of energy in storage. mine from a source
                    var source = creep.pos.findClosestByRange(FIND_SOURCES);
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
            }
        }
    }
};

module.exports = roleRepair;