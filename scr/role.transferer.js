var roleTransferer = {  

    /** @param {Creep} creep **/  
    run: function(creep) {  
        // 如果正在转移且能量为0，则停止转移  
        if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] === 0) {  
            creep.memory.transfering = false;  
            creep.say('😃下班了！好耶');  
        }  
        // 如果不在转移且容量已满，则开始转移  
        if (!creep.memory.transfering && (creep.store.getFreeCapacity() === 0 || creep.store[RESOURCE_HYDROGEN] >= creep.store.getCapacity() * 0.2) ) {  
            creep.memory.transfering = true;  
            creep.say('😟上班了！呜呜呜');  
        }  
        // 如果不在转移  
        if (!creep.memory.transfering) {  
            const containers = creep.room.container; 
            // 根据creep的workLoc找到对应的容器  
            if (containers.length > 0) {  
                let targetContainer = null;  
                if (creep.memory.workLoc === 0) {  
                    targetContainer = containers[0];  
                } else if (creep.memory.workLoc === 1) {  
                    targetContainer = containers[1];  
                } else if (creep.memory.workLoc === 2) {  
                    targetContainer = containers[0];  
                }  
                if (creep.memory.workLoc != 2) {  
                    if (creep.withdraw(targetContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ffffff'}});  
                    }  
                } else {  
                    // 尝试提取氢  
                    if (creep.withdraw(targetContainer, RESOURCE_HYDROGEN) === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ffffff'}});  
                    }  
                }
            }  
        } else {  
            var targets = creep.room.storage;
            if (targets) { 
                if (creep.transfer(targets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});  
                } else if(creep.transfer(targets, RESOURCE_HYDROGEN) === ERR_NOT_IN_RANGE){
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});  
                }
            }
        }  
    }  
};  

module.exports = roleTransferer;