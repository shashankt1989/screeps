var config = require('config');

var logicLink = {

    run: function(link) {
        if (config.receiverLinks.indexOf(link.id) == -1)
        {
            var target = link.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK && structure.energy == 0 && config.receiverLinks.indexOf(structure.id) != -1)
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