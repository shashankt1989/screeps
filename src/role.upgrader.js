var roleUpgrader = {

    run: function(creep) {

        // upgrading but out of energy
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0000ff'}});
            }
        }
        else {
            // find a storage with non zero energy
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
                // go and upgrade if any energy present or move to neutral location
                if(creep.carry.energy >0)
                    creep.memory.upgrading = true;
                else
                    creep.moveTo(36,12);
            }
        }
    }
};

module.exports = roleUpgrader;