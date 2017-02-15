/*
Creep provider is specialized for tranfering energy from storage/containers to spawn/extension/towers. 
Spawn and extensions are given first priority and then towers are filled. 
TODO: add tower logic. Till then towers are handled by repair creeps.
*/

var roleProvider = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE ||
                        structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
                }
            });
            if(source)
            {
                if(creep.withdraw(source,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else
            {
                // move to neutral location and wait.
                creep.moveTo(35,11);
            }
        }
        else {
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
                // move to neutral location and wait.
                creep.moveTo(35,11);
            }
        }
    }
};

module.exports = roleProvider;