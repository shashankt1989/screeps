var config = require('config');

var spawnUtility = {
    pickupDroppedResources: function(room) {   
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
                var creep = null;
                // check if we already have a creep associated with this
                var creeps = _.filter(Game.creeps, (creep) => creep.memory.collectorSourceId == source.id );
                if(creeps.length > 0)
                    creep = creeps[0];
                if(!creep)
                {
                    creep = source.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (creep) => {return creep.carry.energy == 0 && creep.carryCapacity > 0}});
                    if(!creep || !source.pos.inRangeTo(creep,config.range))
                        creep = null;
                }
                if(creep)
                {
                    creep.memory.specialRole = "collector";
                    creep.memory.collectorSourceId = source.id;
                    if(retVal == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                    else if(retVal == OK || retVal == ERR_FULL) {
                        creep.memory.collectorSourceId = undefined;
                    }
                }
            }
        }
            
    },

    createCreep: function(spawn,role,targetRoom) {

        var attackCount = 0;
        var workCount = 0;
        var carryCount = 0;
        var moveCount = 0;
        var claimCount = 0;
        var toughCount = 0;

        if(config.creepRoleConfigs[role])
        {
            var creepConfig = config.creepRoleConfigs[role]; 
            if(creepConfig["move"])
                moveCount = creepConfig["move"];
            if(creepConfig["attack"])
                attackCount = creepConfig["attack"];
            if(creepConfig["work"])
                workCount = creepConfig["work"];
            if(creepConfig["carry"])
                carryCount = creepConfig["carry"];
            if(creepConfig["tough"])
                toughCount = creepConfig["tough"];
            if(creepConfig["claim"])
                claimCount = creepConfig["claim"];
        }

        var typeArr = [];
        
        for(i=0;i<toughCount;i++)
        {
            typeArr.push(TOUGH);
        }
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
        for(i=0;i<attackCount;i++)
        {
            typeArr.push(ATTACK);
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

    shouldCreateCreep: function(spawnName,roomName,role) {
        if(!config.spawnRoomConfig[spawnName])
            return false;

        var creepCountConfig = config.spawnRoomConfig[spawnName];

        var maxCount = creepCountConfig[roomName] && creepCountConfig[roomName][role] ? creepCountConfig[roomName][role] : 0;

        if(maxCount == 0)
            return false;

        if(role == 'builder')
        {
            // special logic for builders so they are only built when something needs to be built
            var buildCount = 0;
            if(Game.rooms[roomName])
                buildCount = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES, {filter: (site) => {return site.my}}).length;
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
        var currCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.targetRoom == roomName && (creep.spawning || creep.ticksToLive > 75) );
        var currCount = currCreeps.length;
        if(currCount >= maxCount)
            return false;

        //console.log("Should create creep of type " + role + " for room " + roomName);
        return true;
    }
};

module.exports = spawnUtility;