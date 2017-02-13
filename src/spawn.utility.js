/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn.utility');
 * mod.thing == 'a thing'; // true
 */

var spawnUtility = {
    pickupDroppedResources: function(spawn) {
        var sources = spawn.room.find(FIND_DROPPED_RESOURCES);
        if(sources.length > 0)
        {
            for(var source in sources)
            {
                var creep = source.pos.findClosestByPath(FIND_MY_CREEPS, { filter: function(creep) {
                    (creep.memory.role == 'harvester' || creep.memory.role == 'collector') && creep.carry.energy < creep.carryCapacity
                    }});
                if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
        else
        {
            
        }
    },

    createCreep: function(spawn,role,workCount,carryCount,moveCount) {

    }
};

module.exports = spawnUtility;