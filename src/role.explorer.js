/*
Looks for resources in receiver links or dropped resources in target room and then brings them back to either storage or non receiver links in source room.
*/
var config = require('config');

var roleExplorer = {

    run: function(creep) {
        var targetRoom = creep.memory.targetRoom;
        var spawnRoom = Game.rooms[creep.memory.sourceRoom];

        if(creep.carry.energy == 0)
        {
            var fContinue = true;

            if(fContinue && creep.room.name != targetRoom)
            {
                var exitDir = Game.map.findExit(creep.room, targetRoom);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit, {maxRooms : 1});
                creep.memory.sourceId = undefined;
                fContinue = false;
            }

            if(fContinue && targetRoom != spawnRoom.name)
            {
                // try to find enemy containers storage and steal from that.
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure) {
                    return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0}});
                if(target)
                {
                    if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#00aa00'}, maxRooms : 1});
                    }
                    fContinue = false;
                }
            }

            if(fContinue)
            {
                // try to find a nearby link first. use that to withdraw energy. 
                var targets = creep.pos.findInRange(FIND_STRUCTURES, config.range,
                    { filter: function(structure) {return structure.structureType == STRUCTURE_LINK && structure.energy > 0 && config.receiverLinks.indexOf(structure.id) != -1}});
                if(targets.length > 0)
                {
                    if(creep.withdraw(targets[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00aa00'}, maxRooms : 1});
                    }
                    fContinue = false;
                }
            }

            if(fContinue)
            {
                // honor the droppedId if present
                if(creep.memory.collectorSourceId && Game.getObjectById(creep.memory.collectorSourceId))
                {
                    var droppedRes = Game.getObjectById(creep.memory.collectorSourceId);
                    if(creep.pickup(droppedRes) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedRes, {visualizePathStyle: {stroke: '#ff0000'}, maxRooms : 1});
                    }
                    fContinue = false;
                }
            }

            if(fContinue)
            {
                // honor the sourceId if already present and move towards it.
                var source = null;
                if(creep.memory.sourceId)
                {
                    // some source is already defined so just honor it
                    source = Game.getObjectById(creep.memory.sourceId);
                }
                if(!source)
                {
                    // need to find a source for this creep. pick a random source if more than one explorer present
                    var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer' && creep.memory.targetRoom == creep.pos.roomName && (creep.spawning || creep.ticksToLive > config.minCreepTicks));
                    if(explorers.length > 1)
                    {
                        var allSources = creep.room.find(FIND_SOURCES);
                        if(allSources.length > 1)
                        {
                            for(var currSource of allSources)
                            {
                                source = currSource;
                                // break the loop if no other miner associated with this source
                                if((_.filter(explorers, (creep) => creep.memory.sourceId == currSource.id)).length == 0)
                                    break;
                            }
                            creep.memory.sourceId = source.id;
                        }
                        else if(allSources.length == 1)
                        {
                            source = allSources[0];
                            creep.memory.sourceId = source.id;
                        }
                        else
                        {
                            console.log(creep.memory.targetRoom + " is missing energy source");
                        }
                    }
                    else
                    {
                        source = creep.pos.findClosestByRange(FIND_SOURCES);
                        if(source)
                            creep.memory.sourceId = source.id;
                    }
                }
                if(source)
                {
                    // Creep should find resources lying around and the spawn utility logic should kick in and it should pick up the resource

                    // As sometimes builders or repair creeps can be closer to the dropped res and continue picking it up and staying there
                    // adding special logic as well

                    // take care of scenarios where explorer creep blocks the miner creep from gathering resources
                    if(creep.pos.isNearTo(source))
                    {
                        // just move in a random direction to create space. random movement should sometime remove the deadlock
                        // also null the sourceId in memory so that explorers dont keep waiting at a mine without any miners
                        var index = (100 + Math.floor(Math.random()*100))%config.directions.length;
                        creep.move(config.directions[index]);
                        creep.memory.sourceId = undefined;
                    }
                    // try to proactively find dropped resources when in range of 10.
                    else if(creep.pos.inRangeTo(source, 10))
                    {
                        // specifically check for dropped resources
                        var droppedRes = creep.pos.findInRange(FIND_DROPPED_RESOURCES, config.range);
                        if(droppedRes.length > 0)
                        {
                            creep.memory.collectorSourceId = droppedRes[0].id; 
                            if(creep.pickup(droppedRes[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(droppedRes[0], {visualizePathStyle: {stroke: '#ff0000'}, maxRooms : 1});
                            }
                        }
                        else
                        {
                            creep.moveTo(source, {maxRooms : 1});
                        }
                    }
                    // just move towards the source
                    else
                    {
                        creep.moveTo(source, {maxRooms : 1});
                    }

                    fContinue = false;
                }
            }
        }
        else {
            creep.memory.collectorSourceId = undefined;
            // Look for new random source. Just introducing randomness.
            creep.memory.sourceId = undefined;
            if(creep.room != spawnRoom)
            {
                var exitDir = Game.map.findExit(creep.room, spawnRoom);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit, {maxRooms : 1});
                fContinue = false;
            }
            else
            {
                // Dont transfer resouces to receiver links. The explorer creep is supposed to take resources from receiver links and put in storage.
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                    filter: (structure) => {
                        return  ((structure.structureType == STRUCTURE_STORAGE ||
                                structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity) || 
                                ((structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity) ||
                                (structure.structureType == STRUCTURE_LINK && structure.energy < structure.energyCapacity && config.receiverLinks.indexOf(structure.id) == -1);
                    }
                });

                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000'}, maxRooms : 1});
                    }
                    fContinue = false;
                }
            }
        }

        // Nothing to do
        if(fContinue && Game.flags[creep.pos.roomName])
        {
            creep.moveTo(Game.flags[creep.pos.roomName], {maxRooms : 1});
        }
    }
};

module.exports = roleExplorer;