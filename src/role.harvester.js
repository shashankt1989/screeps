/*
Backup role to ensure that more creeps can be created.
Ideally a set of miners and providers keep the system running. But in case the creeps die off
then harvesters are preferred as this creep directly can mine and transfer the resources to spawn/extensions and create more creeps.
*/

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var fContinue = true;
        if(creep.carry.energy == 0 || (creep.memory.harvesting == true && creep.carry.energy < creep.carryCapacity))
        {
            creep.memory.harvesting = true;
            if(fContinue)
            {
                var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => {return source.energy > 0}});
                if(source)
                {
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ff0000'}, maxRooms : 1});
                    }
                    fContinue = false;
                }
            }
            if(fContinue)
            {
                source = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0 }});
                if(source)
                {
                    if(creep.withdraw(source,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {maxRooms : 1});
                    }
                    fContinue = false;
                }
            }
        }
        else
        {
            creep.memory.harvesting = false;
            if(fContinue)
            {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN ||structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
                }});
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#aa0000'}, maxRooms : 1});
                    }
                    fContinue = false;
                }
            }
            if(fContinue)
            {
                var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_STORAGE}});
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#aa0000'}, maxRooms : 1});
                    }
                    fContinue = false;
                }
            }
        }

        // Nothing to do - either no sources or no structures to fill
        if(fContinue && Game.flags[creep.pos.roomName])
        {
            creep.moveTo(Game.flags[creep.pos.roomName], {maxRooms : 1});
        }
    }
};

module.exports = roleHarvester;