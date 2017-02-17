var roleExplorer = {

    run: function(creep) {
        var targetRoom = creep.memory.targetRoom;
        var spawnRoom = Game.rooms[creep.memory.sourceRoom];
        if(creep.carry.energy == 0) {
            if(creep.room.name != targetRoom)
            {
                var exitDir = Game.map.findExit(creep.room, targetRoom);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit);
            }
            else
            {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
                if(target) {
                    if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else
                {
                    // wait in room at some neutral position
                    creep.moveTo(30,7);
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
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_LINK;
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

module.exports = roleExplorer;