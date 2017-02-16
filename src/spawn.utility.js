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
        var retVal = spawn.createCreep(typeArr, role.toUpperCase() + "-" + Game.time.toString(), {role: role, targetRoom: targetRoom, sourceRoom: spawn.name});
        if(_.isString(retVal))
        {
            console.log("Creating new creep: " + retVal);
        }
    },

    shouldCreateCreep: function(roomName,role) {
        var creepCountConfig = {
            "W81N9" : {
                "miner" : 2,
                "provider" : 1,
                "repair" : 1,
                "upgrader" : 2,
                "builder" : 2

            },
            "W82N9" : {
                "miner" : 3,
                "repair" : 1,
                "claim" : 2,
                "explorer" : 3,
                "builder" : 2
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
                maxCount = Math.max(maxCount,1);
        }

        if(maxCount == 0)
            return false;

        var currCount = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.targetRoom == roomName);

        if(currCount >= maxCount)
            return false;


        return true;
    }
};

module.exports = spawnUtility;