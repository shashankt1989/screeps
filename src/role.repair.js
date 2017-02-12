var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        if(creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_ROAD ||
                        structure.structureType == STRUCTURE_WALL ||
                        structure.structureType == STRUCTURE_RAMPART ||
                        structure.structureType == STRUCTURE_TOWER) && structure.hits < (structure.hitsMax /2) && structure.hits < 50000
                }
            });
            
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00aa00'}});
                }
            }
            else
            {
                creep.memory.role = "upgrader";
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#00aa00'}});
            }
        }
    }
};

module.exports = roleRepair;