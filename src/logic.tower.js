var logicTower = {

    run: function(tower,currRoom) {

        // If any invader present then attack them
        var targets = currRoom.find(FIND_HOSTILE_CREEPS);
        if (targets.length > 0)
        {
            tower.attack(targets[0]);
        }
   }
};

module.exports = logicTower;