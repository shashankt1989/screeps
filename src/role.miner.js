/*
Creep that mines resources from sources and tranfers them to either storage or containers.
Miners are supposed to operate in neutral environments where only containers are present. Containers are fragile structures which require
constant repairs. Miners are coded to repair the structure if required. 

Also miners have fixed source which is decided once they enter the room for the first time. Ideally all sources should have a container right next to it.
*/

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.targetRoom && creep.room.name != creep.memory.targetRoom)
        {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        }
        else
        {

            if(creep.carry.energy == 0 || (creep.memory.mining == true && creep.carry.energy < creep.carryCapacity)) {
                creep.memory.mining = true;
                var source = null;
                if(creep.memory.sourceId)
                {
                    // some source is already defined so just honor it
                    source = Game.getObjectById(creep.memory.sourceId);
                }
                if(!source)
                {
                    // need to find a source for this creep. of all the sources find one with max resources present
                    var allSources = creep.room.find(FIND_SOURCES);
                    if(allSources.length > 1)
                    {
                        var maxEnergy = -1;
                        for(var currSource of allSources)
                        {
                            if(currSource.energy > maxEnergy)
                            {
                                source = currSource;
                            }
                        }
                        source = currSource;
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
                if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#00aa00'}});
                }
            }
            else
            {
                creep.memory.mining = false;
                // find any container within range 10 which requires dire repairs
                var containerTargets = creep.pos.findInRange(FIND_STRUCTURES, 10,
                    { filter: function(sstructure) {return structure.structureType == STRUCTURE_CONTAINER && structure.hits < 100000}});
                if(containerTargets.length>0)
                {
                    if(creep.repair(containerTargets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containerTargets[0]);
                    }
                }
                else
                {
                    // fill up the container/storage
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE ||
                                structure.structureType == STRUCTURE_CONTAINER);
                        }
                    });
                    if(target) {
                        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000'}});
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleMiner;