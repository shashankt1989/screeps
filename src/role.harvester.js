/*
Backup role to ensure that more creeps can be created.
Ideally a set of miners and providers keep the system running. But in case the creeps die off
then harvesters are preferred as this creep directly can mine and transfer the resources to spawn/extensions and create more creeps.
*/

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
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
                }
            });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000'}});
                }
            }
            else
            {
                var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_STORAGE}});
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
    }
};

module.exports = roleHarvester;