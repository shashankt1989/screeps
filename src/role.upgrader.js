var roleUpgrader = {

    run: function(creep) {

        var fContinue = true;

        if(fContinue && creep.room.name != creep.memory.targetRoom)
        {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, {maxRooms : 1});
            fContinue = false;
        }

        if(fContinue)
        {
            // upgrading but out of energy
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
            }
            if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
            }

            if(creep.memory.upgrading) {
                creep.memory.mining = false;
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0000ff'}, maxRooms : 1});
                }
            }
            else {
                creep.memory.mining = true;
                // find a storage with non zero energy
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
                        }
                    });
                if(target) {
                    if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {maxRooms : 1});
                    }
                }
                else {
                    // out of energy in storage. mine from a source
                    var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => {return source.energy > 0}});
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ff0000'}, maxRooms : 1});
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;