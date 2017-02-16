/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn.utility');
 * mod.thing == 'a thing'; // true
 */

var spawnUtility = {
    pickupDroppedResources: function(room) {
        var range = 5;
        

        // find all creeps with collector role and revert them back in case no dropped resource near them
        var collectors = _.filter(Game.creeps, (creep) => creep.memory.specialRole == 'collector');
        for(var collector of collectors)
        {
            if(collector.carry.energy == collector.carryCapacity)
            {
                collector.memory.specialRole = undefined;
            }
            else if(collector.pos.findInRange(FIND_DROPPED_RESOURCES,range).length == 0)
            {
                collector.memory.specialRole = undefined;    
            }
        }

        var sources = room.find(FIND_DROPPED_RESOURCES);
        if(sources.length > 0)
        {
            for(var source of sources)
            {

                var creeps = source.pos.findInRange(FIND_MY_CREEPS, range, { filter: function(creep) {return creep.carry.energy < creep.carryCapacity}});
                if(creeps.length > 0)
                {
                    var creep = creeps[0];
                    creep.memory.specialRole = "collector";

                    if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                    else
                    {
                        // resource either picked up or something happened. revert back to original role
                        creep.memory.specialRole = undefined;
                    }
                }
            }
        }
            
    },

    createCreep: function(spawn,role,workCount,carryCount,moveCount,claimCount,targetRoom,sourceRoom) {
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
        for(i=0;i<claimCount;i++)
        {
            typeArr.push(CLAIM);
        }
        var retVal = spawn.createCreep(typeArr, role.toUpperCase() + "-" + Game.time.toString(), {role: role, targetRoom: targetRoom, sourceRoom: sourceRoom});
        if(_.isString(retVal))
        {
            console.log("Creating new creep: " + retVal);
        }
    },

    getCreepCount: function(roomName,role) {
        var creepCountConfig = {
            "W81N9" : {
                "miner" : 2,
                "provider" : 1,
                "repair" : 1,
                "upgrader" : 3,
                "builders" : 2

            },
            "W82N9" : {
                "miner" : 3,
                "repair" : 1,
                "claim" : 2,
                "explorer" : 3
            }
        };

        return creepCountConfig[roomName] && creepCountConfig[roomName][role] ? creepCountConfig[roomName][role] : 0;
    },

    getCurrentCount : function(roomName, role) {

    }
};

module.exports = spawnUtility;