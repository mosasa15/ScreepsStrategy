var roleAdventurer = {  
    /** @param {Creep} creep **/  
    run: function(creep) {  
        // 初始化或更新状态  
        if (!creep.memory.state) {  
            creep.memory.state = 'RETURN_TO_SOURCE';  
        }  
        switch (creep.memory.state) {  
            case 'RETURN_TO_SOURCE':  
                if (creep.room.name !== sourceRoomName) {  
                    creep.moveTo(new RoomPosition(25, 25, sourceRoomName), { visualizePathStyle: { stroke: '#ffaa00' } });  
                    return;  
                } else {  
                    // 查找最近的RUIN  
                    const ruins = creep.room.find(FIND_RUINS);  
                    if (ruins.length > 0) {  
                        const closestRuin = creep.pos.findClosestByPath(ruins);  
                        creep.memory.state = 'EXTRACT_FROM_RUIN';  
                        creep.memory.target = closestRuin.id;  // closestRuin.id
                        creep.moveTo(closestRuin, { visualizePathStyle: { stroke: '#ff0000' } });  
                    }  
                }  
                break;  
            case 'EXTRACT_FROM_RUIN':  
                const ruin = Game.getObjectById(creep.memory.target);  
                for(let resourceType in ruin.store){
                    if (ruin && creep.withdraw(ruin, (resourceType)) === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(ruin, { visualizePathStyle: { stroke: '#ff0000' } }); 
                    } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {  
                        creep.memory.state = 'RETURN_TO_TARGET';  
                }
                }  
                break;  
            case 'RETURN_TO_TARGET':  
                if (creep.room.name !== targetRoomName) {  
                    creep.moveTo(new RoomPosition(25, 25, targetRoomName), { visualizePathStyle: { stroke: '#00aaff' } });  
                    return;  
                } else {  
                    // 查找最近的STORAGE  
                    const storages = creep.room.find(FIND_STRUCTURES, {  
                        filter: (structure) => structure.structureType === STRUCTURE_STORAGE  
                    });  
                    if (storages.length > 0) {  
                        for(let resourceType in creep.store){
                            if (storages && creep.transfer(storages[0], (resourceType)) === ERR_NOT_IN_RANGE) {  
                                creep.moveTo(storages[0], { visualizePathStyle: { stroke: '#ff0000' } }); 
                            } 
                        }
                    }  
                    if (creep.store === 0) {  
                        creep.memory.state = 'RETURN_TO_SOURCE';  
                    }  
                }  
                break;  
        }  
    }  
};  

module.exports = roleAdventurer;