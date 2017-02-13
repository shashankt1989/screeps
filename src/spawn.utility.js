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

    createCreep: function(spawn,role,workCount,carryCount,moveCount,targetRoom) {
        var typeArr = [];
        for(i=0;i<workCount;i++)
        {
            typeArr.push(WORK);
        }
        for(i=0;i<carryCount;i++)
        {
            typeArr.push(CARRY);
        }
        for(i=0;i<moveCount;i++)
        {
            typeArr.push(MOVE);
        }
        var retVal = spawn.createCreep(typeArr, role.toUpperCase() + "-" + Game.time.toString(), {role: role, targetRoom: targetRoom});
        if(_.isString(retVal))
        {
            console.log("Creating new creep: " + retVal);
        }
    }
};

module.exports = spawnUtility;