var logicLink = {

    run: function(link) {
        var range = 10;

        var targets = link.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE)
            }
        });
        // In case it has a storage nearby then this link is not supposed to send back resources. 
        if (targets.length == 0)
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