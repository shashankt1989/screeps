/*
Looks for resources in receiver links or dropped resources in target room and then brings them back to either storage or non receiver links in source room.
*/
var roleExplorer = {

    run: function(creep) {
        var targetRoom = creep.memory.targetRoom;
        var spawnRoom = Game.rooms[creep.memory.sourceRoom];
        var receiverLinks = ["58a5f97f83b51f338b909f73"];
        var directions = [TOP,TOP_RIGHT,RIGHT,BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT,LEFT.TOP_LEFT];

        if(creep.carry.energy == 0) {
            if(creep.room.name != targetRoom)
            {
                var exitDir = Game.map.findExit(creep.room, targetRoom);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit);
                creep.memory.sourceId = undefined;
            }
            else
            {
                // try to find a nearby link first. use that to withdraw energy. 
                var targets = creep.pos.findInRange(FIND_STRUCTURES, 10,
                    { filter: function(structure) {return structure.structureType == STRUCTURE_LINK && structure.energy > 0 && receiverLinks.indexOf(structure.id) != -1}});
                if(targets.length > 0)
                {
                    if(creep.withdraw(targets[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00aa00'}});
                    }
                }
                else
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
                        // need to find a source for this creep. pick a random source
                        var allSources = creep.room.find(FIND_SOURCES);
                        if(allSources.length > 1)
                        {
                            // Choosing a random number between [100,200) and then modulus with number of sources
                            var index = (100 + Math.floor(Math.random()*100))%allSources.length;
                            source = allSources[index];
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
                    if(source) {
                        // Creep should find resources lying around and the spawn utility logic should kick in and it should pick up the resource
                        
                        // As sometimes builders or repair creeps can be closer to the dropped res and continue picking it up and staying there
                        // adding special logic as well

                        // take care of scenarios where explorer creep blocks the miner creep from gathering resources
                        if(creep.pos.isNearTo(source))
                        {
                            // just move in a random direction to create space. random movement should sometime remove the deadlock
                            var index = (100 + Math.floor(Math.random()*100))%directions.length;
                            creep.move(directions[index]);
                        }
                        // try to proactively find dropped resources when in range of 10.
                        else if(creep.pos.inRangeTo(source, 10))
                        {
                            // specifically check for dropped resources
                            var droppedRes = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10);
                            if(droppedRes.length > 0)
                            {
                                if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ff0000'}});
                                }
                            }
                            else
                            {
                                creep.moveTo(source);
                            }
                        }
                        // just move towards the source
                        else
                        {
                            creep.moveTo(source);
                        }
                    }
                }
            }
        }
        else {
            if(creep.room != spawnRoom)
            {
                var exitDir = Game.map.findExit(creep.room, spawnRoom);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit);
            }
            else
            {
                // Dont transfer resouces to receiver links. The explorer creep is supposed to take resources from receiver links and put in storage.
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_LINK) && receiverLinks.indexOf(structure.id) == -1;
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
};

module.exports = roleExplorer;