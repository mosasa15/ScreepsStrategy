var roleCentraltransferer = {  
    /**    
     * @param {Creep} creep - The creep to run logic for.    
     */    
    run: function(creep) {    
        const sourceRoomName = creep.memory.sourceRoomName;    
        const targetRoomName = creep.memory.targetRoomName;    
        const roomMemory = Memory.rooms[creep.room.name];   
        // 根据房间名设置不同的目标位置  
        let targetPosition;  
        if (creep.room.name === 'E54N19') {  
            targetPosition = new RoomPosition(5, 9, creep.room.name);  
        } else if (creep.room.name === 'E56N13') {  
            targetPosition = new RoomPosition(43, 16, creep.room.name);  
        } 
        creep.memory.dontPullMe = true;    
        // 如果creep尚未到达目标位置（通过比较坐标和房间名）    
        if (creep.pos.x !== targetPosition.x || creep.pos.y !== targetPosition.y || creep.room.name !== targetPosition.roomName) {    
            // 移动到目标位置    
            creep.moveTo(targetPosition, { visualizePathStyle: { stroke: '#ffaa00', opacity: 0.5, lineStyle: 'dashed' } });    
        } else {    
            // 到达目标位置后执行能量管理任务    
            this.manageEnergy(creep, roomMemory);    
        }    
    },  
    /**  
     * 管理Terminal和Storage之间的能量平衡  
     * @param {Creep} creep  
     * @param {Object} roomMemory  房间内存对象，包含关于房间状态的信息    
     */  
    manageEnergy: function(creep, roomMemory) {  
        // 查找Terminal和Storage  
        const terminal = creep.room.terminal;
        const storage = creep.room.storage;
        
        // 按照预习安排好的任务进行操作
        const centerLink = creep.room[roomMemory.centerLinkId]; 
        if(roomMemory.transferEnergyToStorage){ //如果中央link发布转移能量到storage当中，就将中央link的能量提取出来到storage当中
            if(centerLink){
                if (creep.store.energy === 0) {  
                    if(creep.withdraw(centerLink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(centerLink, {visualizePathStyle: {stroke: '#ffaa00'}});  
                    }
                }  else if (creep.store.energy > 0){
                    if(storage){
                        if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                            creep.moveTo(storage, {visualizePathStyle: {stroke: '#00ffaa'}});  
                        }
                    }
                }
            }
        } else if(roomMemory.requestEnergyFromCenterLink){ 
            //如果upgradelink发布向中央link收集能量，检测中央link的能量是否超过799，如果超过则待机，如果没有就将storage的能量转移到中央link；
            if (centerLink && centerLink.structureType === STRUCTURE_LINK) {  
                // 检查central link的能量  
                if (centerLink.store.energy >= 800) {  
                //待机
                } else {  
                    if (storage) {   
                        if (creep.store.energy === 0) {  
                            if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                                creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });  
                            }  
                        }  else if (creep.store.energy > 0) {  
                            if (creep.transfer(centerLink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                                creep.moveTo(centerLink, { visualizePathStyle: { stroke: '#ffaa00' } });  
                            }  
                        }  
                    }  
                }  
            } 
        }
        
        // // 遍历终端中的所有资源类型  
        // for (let resourceType in terminal.store) {  
        //     // 检查creep是否在终端的范围内  
        //     if (creep.withdraw(terminal, resourceType) === ERR_NOT_IN_RANGE) {  
        //         creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ff0000' } });  
        //     } else if (creep.store.getFreeCapacity(resourceType) === 0) {   
        //             if (storage && creep.transfer(storage, resourceType) === ERR_NOT_IN_RANGE) {  
        //                 creep.moveTo(storage, { visualizePathStyle: { stroke: '#ff0000' } });  
        //             }  
        //     }  
        // }
        //转移氢元素
        // if (storage) {  
        //     // 检查creep是否已经达到了其能携带HYDROGEN的容量上限  
        //     if (creep.store.getFreeCapacity(RESOURCE_HYDROGEN) > 0) {  
        //         // 尝试从storage中取出HYDROGEN  
        //         if (creep.withdraw(storage, RESOURCE_HYDROGEN) === ERR_NOT_IN_RANGE) {  
        //             // 如果不在范围内，则移动到storage  
        //             creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });  
        //         }  
        //     } else {  
        //         if (terminal) {  
        //             // 尝试将HYDROGEN转移到终端  
        //             if (creep.transfer(terminal, RESOURCE_HYDROGEN) === ERR_NOT_IN_RANGE) {  
        //                 // 如果不在范围内，则移动到终端  
        //                 creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });  
        //             }  
        //         }  
        //     }  
        // }
        //转移能量
        // if (storage && terminal) {  
        //     // 检查storage中是否有能量  
        //     const storageEnergy = storage.store[RESOURCE_ENERGY] || 0;  
        //     // 检查终端中的能量是否少于60,000单位  
        //     const terminalEnergy = terminal.store[RESOURCE_ENERGY] || 0;  
        //     // 如果storage有能量且终端能量不足60,000单位  
        //     if (storageEnergy > 0 && terminalEnergy < 180000) {  
        //         // 检查creep是否已经达到了其能携带能量的容量上限  
        //         if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {  
        //             // 尝试从storage中取出能量  
        //             if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
        //                 // 如果不在范围内，则移动到storage  
        //                 creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });  
        //             }  
        //         } else {  
        //             // 如果creep已经携带了最大量的能量  
        //             // 尝试将能量转移到终端  
        //             if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
        //                 // 如果不在范围内，则移动到终端  
        //                 creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });  
        //             }  
        //         }  
        //     }  
        //     //如果terminal的能量已经足够或storage中没有能量，可以选择让creep执行其他任务或等待  Assignment
        // }
    }  
};  
module.exports = roleCentraltransferer;