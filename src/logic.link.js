var logicLink = {

    run: function(link) {
        var range = 10;

        var targets = link.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
            }
        });
        if (targets.length > 0)
        {
            link.transferEnergy(targets[0]);
        }
        else
        {
            var target = link.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK && structure.energy < structure.energyCapacity)
                }
            });
            if(target)
            {
                link.transferEnergy(target);
            }
        }
   }
};

module.exports = logicLink;