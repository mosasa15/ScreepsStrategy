var roleNewtransferer = {  

    /** @param {Creep} creep **/  
    run: function(creep) {  
        // 初始化或更新状态  
        sourceRoomName = creep.memory.sourceRoomName;
        targetRoomName = creep.memory.targetRoomName;
        if (!creep.memory.state) {  
            creep.memory.state = 'RETURN_TO_SOURCE';  // 假设开始时总是返回源房间  
        }  

        // 根据当前状态执行操作  
        switch (creep.memory.state) {  
            case 'RETURN_TO_SOURCE':  
                if (creep.room.name !== sourceRoomName) {  
                    creep.moveTo(new RoomPosition(25, 25, sourceRoomName), { visualizePathStyle: { stroke: '#ffaa00' } });  
                    return;
                } else {  
                    var targetContainer = null;  
                    var containers = creep.room.find(FIND_STRUCTURES, {  
                        filter: (structure) => {  
                            return (structure.structureType === STRUCTURE_CONTAINER &&  
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) < structure.store.getCapacity(RESOURCE_ENERGY));  
                        }  
                    });  
                    if (containers.length > 0) {  
                        if (creep.memory.workLoc === 0 && containers[0]) {  
                            targetContainer = containers[0];  
                        } else if (creep.memory.workLoc === 1 && containers[1]) {  
                            targetContainer = containers[1];  
                        }  
                        // 如果没有匹配到workLoc的container，可以选择默认或随机一个  
                        if (!targetContainer && containers.length > 0) {  
                            targetContainer = containers[0]; // 或者使用其他逻辑选择  
                        }  
                        if (targetContainer) {  
                            if (creep.withdraw(targetContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                                creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ffffff'}});  
                            }  
                        }  
                    }
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0){
                    creep.memory.state = 'TRANSFER_ENERGY';  
                }
            }  
        break;  

        case 'TRANSFER_ENERGY':  
        if (creep.room.name !== targetRoomName) {  
            // 如果不在目标房间，移动到目标房间的中心  
            creep.moveTo(new RoomPosition(25, 25, targetRoomName), { visualizePathStyle: { stroke: '#00aaff' } });  
            return;  
        }  
    
        // 尝试找到并传输到特定的容器 (24, 35)  
        const specificContainer = Game.getObjectById(creep.room.memory.specificContainerId) || null;  
        if (!specificContainer) {  
            // 如果没有找到特定容器的ID，或者ID无效，则通过坐标查找  
            const potentialSpecificContainer = creep.room.lookForAt(LOOK_STRUCTURES, 24, 35).find(s => s.structureType === STRUCTURE_CONTAINER);  
            if (potentialSpecificContainer) {  
                specificContainer = potentialSpecificContainer;  
            }  
        }  
        
        if (specificContainer) {  
            // 检查特殊容器的能量是否已满（大于60%的容量）  
            const maxCapacity = specificContainer.store.getCapacity(RESOURCE_ENERGY);  
            const currentCapacity = specificContainer.store.getUsedCapacity(RESOURCE_ENERGY);  
            if (currentCapacity < maxCapacity * 0.6) {  
                // 特殊容器未满60%，尝试传输能量  
                if (creep.transfer(specificContainer, RESOURCE_ENERGY) === OK) {  
                    // 成功传输到特定容器  
                } else if (creep.transfer(specificContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                    // 特定容器在范围内但不在身边，移动到它  
                    creep.moveTo(specificContainer, { visualizePathStyle: { stroke: '#00ff00' } });  
                }  
            } else {  
                // 特殊容器已满60%，寻找其他容器  
                const containers = creep.room.find(FIND_STRUCTURES, {  
                    filter: (structure) => {  
                        return (structure.structureType === STRUCTURE_STORAGE  &&  
                                structure.id !== specificContainer.id &&  
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);  
                    }  
                });  
                if (containers.length > 0) {  
                    const otherContainer = containers[0]; // 可以根据逻辑选择具体的容器  
                    let transferResult = creep.transfer(otherContainer, RESOURCE_ENERGY);  
                    if (transferResult === OK) {  
                        // 成功传输到其他容器  
                    } else if (transferResult === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(otherContainer, { visualizePathStyle: { stroke: '#ff0000' } });  
                    }
                }
            }
            if (creep.store[RESOURCE_ENERGY] === 0) {   
                creep.memory.state = 'RETURN_TO_SOURCE';   
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {  
                filter: (structure) => {  
                    return (
                            structure.structureType === STRUCTURE_STORAGE) &&  
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;  
                }  
            });  
            // 对targets数组进行排序，根据structureType的优先级，并考虑塔的能量水平  
            // targets.sort((a, b) => {  
            //     // 优先级顺序：EXTENSION, TOWER(但只有当能量低于60%时), SPAWN, STORAGE  
            //     if (a.structureType === STRUCTURE_EXTENSION) return -1;  
            //     if (b.structureType === STRUCTURE_EXTENSION) return 1;  

            //     if (a.structureType === STRUCTURE_SPAWN) return -1;  
            //     if (b.structureType === STRUCTURE_SPAWN) return 1;  
            //     // STORAGE 是默认的最后选择  
            //     return 0; // 如果两个结构类型相同且都是上述未特别处理的类型，则保持原顺序  
            // });  
            if (targets.length > 0) {  
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});  
                }  
            }
            if (creep.store[RESOURCE_ENERGY] === 0) {   
                creep.memory.state = 'RETURN_TO_SOURCE';   
            } 
        }
    break;
        }  
    }  
};
module.exports = roleNewtransferer;