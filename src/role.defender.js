var roleDefender = {
    run: function(creep) {
        var fContinue = true;
        if(fContinue && creep.memory.targetRoom && creep.room.name != creep.memory.targetRoom)
        {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            fContinue = false;
        }

        if(fContinue)
        {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target)
            {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                fContinue = false;
            }
        }

        if(fContinue)
        {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => {return !structure.my}});
            if(target)
            {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                fContinue = false;
            }
        }
    }
};

module.exports = roleDefender;