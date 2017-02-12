var roleExplorer = {

    run: function(creep, spawnRoom, targetRoom) {
        if(creep.carry.energy < creep.carryCapacity) {
            if(creep.room == spawnRoom)
            {
                var exitDir = Game.map.findExit(creep.room, targetRoom);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit);
            }
            else
            {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
        else {
            if(creep.room != spawnRoom)
            {
                var exitDir = Game.map.findExit(creep.room, spawnRoom);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit);
            }
            else
            {
                var targets = spawnRoom.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE;
                    }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#aa0000'}});
                    }
                }
            }
        }
    }
};

module.exports = roleExplorer;