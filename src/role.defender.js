var roleDefender = {
    run: function(creep) {
        var fContinue = true;
        if(fContinue && creep.memory.targetRoom && creep.room.name != creep.memory.targetRoom)
        {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit,{maxRooms : 1});
            fContinue = false;
        }

        var target = undefined;

        if(fContinue && creep.memory.targetId && Game.getObjectById(creep.memory.targetId) && creep.pos.room == Game.getObjectById(creep.memory.targetId).pos.room)
        {
            target = Game.getObjectById(creep.memory.targetId);
            fContinue = false;
        }
        else
        {
            creep.memory.targetId = undefined;
        }

        if(fContinue && !target)
        {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (creep) => {
                    return (creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0 || creep.getActiveBodyparts(HEAL) > 0)
                }
            });
        }

        if(fContinue && !target)
        {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }

        if(fContinue && !target)
        {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
        }

        if(target)
        {
            creep.memory.targetId = target.id;
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target,{maxRooms : 1});
            }
        }
    }
};

module.exports = roleDefender;