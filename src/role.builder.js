var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.targetRoom && creep.room.name != creep.memory.targetRoom)
        {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, {maxRooms : 1});
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
                creep.memory.mining = false;
                var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: (site) => {return true/*site.my*/}});
                if(target) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}, maxRooms : 1});
                    }
                }
            }
            else {
                creep.memory.mining = true;
                var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => {return source.energy > 0}});
                if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#00aa00'}, maxRooms : 1});
                }
            }
        }
    }
};

module.exports = roleBuilder;