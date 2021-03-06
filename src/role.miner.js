/*
Miners just keep on mining and dropping the resource. Someone should pick it up.
They dont have any carry parts. Unless they revert back from harvester. 
Also miners have fixed source which is decided once they enter the room for the first time.
*/
var config = require('config');

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.targetRoom && creep.room.name != creep.memory.targetRoom)
        {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, {maxRooms : 1});
        }
        else
        {
            var source = null;
            if(creep.memory.sourceId)
            {
                // some source is already defined so just honor it
                source = Game.getObjectById(creep.memory.sourceId);
            }
            if(!source)
            {
                // need to find a source for this creep.
                var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.targetRoom == creep.pos.roomName && (creep.spawning || creep.ticksToLive > config.minCreepTicks));
                if(miners.length > 1)
                {
                    // find the source without any associated creep.
                    var allSources = creep.room.find(FIND_SOURCES);
                    if(allSources.length > 1)
                    {
                        for(var currSource of allSources)
                        {
                            source = currSource;
                            // break the loop if no other miner associated with this source
                            if((_.filter(miners, (creep) => creep.memory.sourceId == currSource.id)).length == 0)
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
                        console.log(creep.memory.targetRoom + " is missing energy source. WTH are miner doing here?");
                    }
                }
                // If only one miner in the room then find the closest one.
                else
                {
                    source = creep.pos.findClosestByRange(FIND_SOURCES);
                    if(source)
                        creep.memory.sourceId = source.id;
                }
            }
            if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#00aa00'}, maxRooms : 1});
            }
        }
    }
};

module.exports = roleMiner;