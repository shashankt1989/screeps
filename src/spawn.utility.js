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
        

        // find all creeps with collector role and revert them back. The special role will be added again in case they are selected.
        var collectors = _.filter(Game.creeps, (creep) => creep.memory.specialRole == 'collector');
        for(var collector of collectors)
        {
            collector.memory.specialRole = undefined;
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

    createCreep: function(spawn,role,workCount,carryCount,moveCount,claimCount,targetRoom) {
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
        var retVal = spawn.createCreep(typeArr, role.toUpperCase() + "-" + targetRoom + "-" + Game.time.toString(), {role: role, targetRoom: targetRoom, sourceRoom: spawn.room.name});
        if(_.isString(retVal))
        {
            console.log("Creating new creep: " + retVal);
            return true;
        }
        else
            return false;
    },

    shouldCreateCreep: function(roomName,role) {
        var creepCountConfig = {
            "W81N9" : {
                "miner" : 1,
                "provider" : 1,
                "repair" : 1,
                "upgrader" : 2,
                "builder" : 2,
                "explorer" : 1,

            },
            "W82N9" : {
                "miner" : 2,
                "repair" : 1,
                "claim" : 2,
                "explorer" : 3,
                "builder" : 2
            },
            "W81N8" : {
                "miner" : 1,
                "repair" : 0,
                "claim" : 1,
                "explorer" : 1,
                "builder" : 1
            }
        };

        var maxCount = creepCountConfig[roomName] && creepCountConfig[roomName][role] ? creepCountConfig[roomName][role] : 0;


        if(maxCount == 0)
            return false;

        if(role == 'builder')
        {
            // special logic for builders so they are only built when something needs to be built
            var buildCount = 0;
            if(Game.rooms[roomName])
                buildCount = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES).length;
            if(buildCount == 0)
                maxCount = 0;
        }

        else if(role == 'claim')
        {
            var claimTicks = 9999;
            if(Game.rooms[roomName] && Game.rooms[roomName].controller.reservation)
            {
                claimTicks = Game.rooms[roomName].controller.reservation['ticksToEnd']; 
            }
            // For now dont need more than one claim role if reserve count > 1000
            if(claimTicks > 1000)
                maxCount = Math.min(maxCount,1);
        }

        if(maxCount == 0)
            return false;

        // if creep is about to die off then consider that creep as good as dead! 
        var currCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.targetRoom == roomName && (creep.spawning || creep.ticksToLive > 100) );
        var currCount = currCreeps.length;
        if(currCount >= maxCount)
            return false;

        //console.log("Should create creep of type " + role + " for room " + roomName);
        return true;
    }
};

module.exports = spawnUtility;