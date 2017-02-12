var roleExplorer = {

    run: function(creep, spawnRoom) {
        if(creep.carry.energy < creep.carryCapacity) {

            var source = new RoomPosition(,,"W82N9");
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        else {
            var targets = spawnRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#aa0000'}});
                }
            }
        }
    }
};

module.exports = roleExplorer;