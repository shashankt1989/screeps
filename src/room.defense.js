var config = require('config');
var spawnUtility = require('spawn.utility');

var roomDefense = {
    // return value indicated whether its safe to spawn other creeps or not.
    spawnDefense: function(spawnName) {
        // check for hostile invader creeps and create new defenders
        var spawn = Game.spawns[spawnName];
        var spawnRoom = spawn.room;
        if(spawnUtility.isSafeMode(spawn))
            return true;
        var hostiles = spawnRoom.find(FIND_HOSTILE_CREEPS, {
                filter: (creep) => {
                    return (creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0 || creep.getActiveBodyparts(HEAL) > 0)
                }
            });
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.memory.targetRoom == spawnRoom.name);
        if(hostiles.length > 0 && defenders.length < hostiles.length)
        {
            if(!spawnUtility.createCreep(spawn, "defender", spawnRoom.name) && hostiles.length > 2)
                spawnUtility.activateSafeMode();
            return false;
        }
        return true;
   },

   miningDefense: function(spawn,roomName) {
        // check for hostile invader creeps
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS, {
            filter: (creep) => {
                return (creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0 || creep.getActiveBodyparts(HEAL) > 0)
            }
        });
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.memory.targetRoom == roomName);
        if(hostiles.length > 0 && defenders.length < hostiles.length)
        {
            spawnUtility.createCreep(spawn, "defender", roomName);
            return false;
        }
        return true;
   }
};

module.exports = roomDefense;