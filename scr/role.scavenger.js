var roleScavenger = {  

    /**  
     * @param {Creep} creep  
     */  
    run: function(creep) {  
        // 查找房间内的掉落资源  
        var targets = creep.room.find(FIND_DROPPED_RESOURCES);
        // 如果有可拾取的掉落资源  
        if (targets.length > 0) {  
            // 选择最近的一个目标  
            var target = creep.pos.findClosestByPath(targets);  
            // 前往并拾取资源  
            if (creep.pickup(target) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });  
            }  
            // 如果背包满了，则尝试将资源存入储存建筑中  
            if (creep.store.getUsedCapacity() / creep.store.getCapacity() >= 0.4) {  
                var storageTargets = creep.room.find(FIND_STRUCTURES, {  
                    filter: (structure) => {  
                        return (structure.structureType === STRUCTURE_STORAGE ||  
                                (structure.structureType === STRUCTURE_CONTAINER &&  
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0));  
                    }  
                });  
                if (storageTargets.length > 0) {  
                    // 选择一个最近的储存建筑  
                    var storageTarget = creep.pos.findClosestByPath(storageTargets);  
                    // 前往储存建筑并存储资源  
                    if (creep.transfer(storageTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(storageTarget, { visualizePathStyle: { stroke: '#ffffff' } });  
                    }  
                }  
            }  
        } else {  
            // 如果没有可拾取的掉落资源，但背包中有资源，则尝试存入储存建筑中  
            if (creep.store[RESOURCE_ENERGY] > 0) {  
                var storageTargets = creep.room.find(FIND_STRUCTURES, {  
                    filter: (structure) => {  
                        return (structure.structureType === STRUCTURE_STORAGE  &&  
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);  
                    }  
                });  
                if (storageTargets.length > 0) {  
                    var storageTarget = creep.pos.findClosestByPath(storageTargets);  
                    // 前往储存建筑并存储资源  
                    if (creep.transfer(storageTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(storageTarget, { visualizePathStyle: { stroke: '#ffffff' } });  
                    }  
                }  
            }  
            if (creep.store[RESOURCE_ENERGY] === 0 && targets.length === 0) {  
                creep.say('🚶‍♂️ 巡逻中');  
            }  
        }  
    }  
};  

module.exports = roleScavenger;