var logicTower = {

    run: function(tower) {

        // If any invader present then attack them
        var target = tower.room.find(FIND_HOSTILE_CREEPS);
        if (target.length > 0)
        {
            tower.attack(target[0]);
        }
        else
        {

        }
   }
};

module.exports = logicTower;