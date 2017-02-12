var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0 || (creep.memory.harvesting == true && creep.carry.energy < creep.carryCapacity)) {
            creep.memory.harvesting = true;
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        else {
            creep.memory.harvesting = false;
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity) || 
                        structure.structureType == STRUCTURE_STORAGE;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#aa0000'}});
                }
            }
            else
            {
                creep.moveTo(34,20, {visualizePathStyle: {stroke: '#aa0000'}});
            }
        }
    }
};

module.exports = roleHarvester;