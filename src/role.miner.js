var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.targetRoom && creep.room.name != creep.memory.targetRoom)
        {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        }
        else
        {

            if(creep.carry.energy == 0 || (creep.memory.mining == true && creep.carry.energy < creep.carryCapacity)) {
                creep.memory.mining = true;
                var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => {return source.energy > 0}});
                if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#00aa00'}});
                }
            }
            else
            {
                creep.memory.harvesting = false;
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE ||
                            structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000'}});
                    }
                }
            }
        }
    }
};

module.exports = roleMiner;