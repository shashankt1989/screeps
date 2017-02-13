var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
        }

        if(creep.memory.repairing) {
            if(creep.memory.fillingTower)
            {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity
                    }
                });
            }
            else
            {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < (structure.energyCapacity/1.5)
                    }
                });
            }

            if(targets.length > 0) {
                creep.memory.fillingTower = true;
                if(creep.transfer(targets[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00aa00'}});
                }
            }
            else
            {
                creep.memory.fillingTower = false;
                if(creep.memory.target)
                {
                    var currRepairTarget = Game.getObjectById(creep.memory.target);
                    if(!currRepairTarget || currRepairTarget.hits > Math.min(currRepairTarget.hitsMax,50000))
                    {
                        // done with this structure find a new one
                        creep.memory.target = null;
                    }
                }
                if(!creep.memory.target)
                {
                    targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_WALL ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_ROAD ||
                                structure.structureType == STRUCTURE_RAMPART) && structure.hits < (structure.hitsMax /1.5) && structure.hits < 50000
                        }
                    });
                    if(targets.length > 0) {
                        creep.memory.target = targets[0].id;
                    }

                }    
                if(creep.memory.target) {
                    var currRepairTarget = Game.getObjectById(creep.memory.target);
                    if(creep.repair(currRepairTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(currRepairTarget, {visualizePathStyle: {stroke: '#00aa00'}});
                    }
                }
                else
                {
                    creep.memory.role = "upgrader";
                }
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
            if(targets.length > 0) {
                if(creep.withdraw(targets[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                targets = creep.room.find(FIND_SOURCES);
                if(creep.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
    }
};

module.exports = roleRepair;