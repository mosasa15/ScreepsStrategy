var roleHarvester = {  
    /** @param {Creep} creep **/  
    run: function(creep) {  
        creep.memory.dontPullMe = true;  
        var workLoc = creep.memory.workLoc;  
        var source = creep.room.source;  
        var mineral = creep.room.mineral;  
        var containers = creep.room.container;  
        var links = creep.room.link; 
        var resourceToHarvest;  
        var targetTransfer;  

        if (workLoc < 2) { // 0 或 1  
            resourceToHarvest = source[workLoc];  
            targetTransfer = links[workLoc];  
        } else if (workLoc === 2) {  
            resourceToHarvest = mineral;  
            targetTransfer = containers[0]; // 假设转移到第一个container  
            if (creep.pos !== targetTransfer.pos) {  
                creep.moveTo(targetTransfer.pos);  
            }  
        }  

        if(resourceToHarvest && workLoc === 2){
            if (creep.harvest(resourceToHarvest) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(resourceToHarvest, { visualizePathStyle: { stroke: '#ffaa00' } }); // 移动到资源处开采  
            }  
        }
        if (resourceToHarvest && creep.store.getFreeCapacity() > 0 && workLoc !== 2) { // 检查资源是否可开采且creep还有剩余容量  
            if (creep.harvest(resourceToHarvest) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(resourceToHarvest, { visualizePathStyle: { stroke: '#ffaa00' } }); // 移动到资源处开采  
            }  
        } else if (creep.store.getFreeCapacity() === 0 && workLoc !== 2) { // creep的容量已满且工作位置不是2  
            if (targetTransfer && creep.transfer(targetTransfer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(targetTransfer, { visualizePathStyle: { stroke: '#ffffff' } }); // 移动到转移目标处转移能量  
            }  
        }
    }  
};  

module.exports = roleHarvester;