var roleNewHarvester = {  
    /**  
     * @param {Creep} creep The creep instance to run.  
     */  
    run: function(creep) {  
        const sourceRoomName = creep.memory.sourceRoomName;  
        const targetRoomName = creep.memory.targetRoomName;  
        const SOURCE_RANGE = 1;  
        // 如果不在源房间，则移动到源房间  
        if (creep.room.name !== sourceRoomName) {  
            creep.moveTo(new RoomPosition(25, 25, sourceRoomName), { visualizePathStyle: { stroke: '#ffaa55' } });  
            return;  
        }  
        const sources = creep.room.find(FIND_SOURCES);  
        let targetsource = null;  
        if (sources.length > 0) {  
            if (creep.memory.workLoc === 0 && sources[0]) {  
                targetsource = sources[0];  
            } else if (creep.memory.workLoc === 1 && sources[1]) {  
                targetsource = sources[1];  
            }  
            // 如果没有指定workLoc或指定的源不存在，则选择第一个源  
            if (!targetsource) {  
                targetsource = sources[0];  
            }  
        }  
        const container = findContainerNearSource(targetsource, SOURCE_RANGE);  
        // 如果背包中有能量且容器需要修理  
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && container.hits < container.hitsMax) {  
            if (creep.repair(container) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });  
            }  
        } else {  
            // 如果creep不在容器旁边，移动到容器  
            if (!creep.pos.isEqualTo(container.pos)) {  
                creep.moveTo(container, { visualizePathStyle: { stroke: '#ffffff' } });  
            } else {  
                // 如果creep在容器旁边，根据条件执行操作  
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {  
                    if (creep.harvest(targetsource) === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(targetsource, { visualizePathStyle: { stroke: '#ffaa00' } });  
                    }  
                } else if (container.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {  
                    creep.transfer(container, RESOURCE_ENERGY);  
                }  
            }  
        }  
    }  
};  

function findContainerNearSource(source, range) {  
    return source.room.find(FIND_STRUCTURES, {  
        filter: (structure) => {  
            return (structure.structureType === STRUCTURE_CONTAINER) &&  
                    (structure.pos.getRangeTo(source.pos) <= range);  
        }  
    })[0];  
}  
module.exports = roleNewHarvester;