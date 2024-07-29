var roleRepairer = {  
    /**
     * @param {Creep} creep 
     * **/
    run: function(creep) {
        var workLoc =creep.memory.workLoc;
        var containers = creep.room.container;
        var sources = creep.room.source;
        var container = containers[workLoc];
        var source = sources[workLoc];
        
        if (container) {  
            if(creep.pos !== container.pos){
                const direction = creep.pos.getDirectionTo(container);
                creep.move(direction);
            } 
        } 
        if(source) {
            if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: { stroke: '#ffaa00'}})
            } 
        }
    }
}
module.exports = roleRepairer;