var logicTower = {

    run: function(tower,currRoom) {
        var fContinue = true;

        if(currRoom.memory.targetId && Game.getObjectById(currRoom.memory.targetId) && Game.getObjectById(currRoom.memory.targetId).pos.room == currRoom )
        {
            tower.attack(Game.getObjectById(currRoom.memory.targetId));
            fContinue = false;
        }
        else
        {
            currRoom.memory.targetId = undefined;    
        }

        // If any invader present then attack them
        if(fContinue)
        {
            var targets = currRoom.find(FIND_HOSTILE_CREEPS, {
                    filter: (creep) => {
                        return (creep.getActiveBodyparts(HEAL) > 0)
                    }
                });
            if (targets.length > 0)
            {
                tower.attack(targets[0]);
                currRoom.memory.targetId = targets[0].id;
                fContinue = false;
            }
        }

        if(fContinue)
        {
            var targets = currRoom.find(FIND_HOSTILE_CREEPS, {
                    filter: (creep) => {
                        return (creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0)
                    }
                });
            if (targets.length > 0)
            {
                tower.attack(targets[0]);
                currRoom.memory.targetId = targets[0].id;
                fContinue = false;
            }
        }

        if(fContinue)
        {
            var targets = currRoom.find(FIND_HOSTILE_CREEPS);
            if (targets.length > 0)
            {
                tower.attack(targets[0]);
                currRoom.memory.targetId = targets[0].id;
                fContinue = false;
            }
        }

        // ensure ramparts are not completely destroyed!
        if(fContinue)
        {
            var targets = currRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_RAMPART) && structure.hits < 500
                }
            });
            
            if(targets.length > 0) {
                tower.repair(targets[0]);
            }
        }
   }
};

module.exports = logicTower;