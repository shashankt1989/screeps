var roleBuilder = {

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
            if(creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
            }
            if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }

            if(creep.memory.building) {
                var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00ff00'}});
                    }
                }
                else
                {
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#00aa00'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;