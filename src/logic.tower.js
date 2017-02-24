var logicTower = {

    run: function(tower,currRoom) {

        // If any invader present then attack them
        var targets = currRoom.find(FIND_HOSTILE_CREEPS);
        if (targets.length > 0)
        {
            tower.attack(targets[0]);
        }
        // ensure ramparts are not completely destroyed!
        else
        {
            targets = currRoom.find(FIND_STRUCTURES, {
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