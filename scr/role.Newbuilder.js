var roleNewbuilder = {  
    /**  
     * @param {Creep} creep 
     */  
    run: function(creep) {  
        const targetRoomName = creep.memory.targetRoomName;  
        const sourceRoomName = creep.memory.sourceRoomName;  
        if (!creep.memory.state) {  
            creep.memory.state = 'harvesting';  
        }  
        
        if (creep.room.name !== sourceRoomName) {  
            creep.moveTo(new RoomPosition(20, 25, sourceRoomName), { visualizePathStyle: { stroke: '#0000ff' } });  
        } 

        var targetSource = null;
        const sources = creep.room.source;  
        if (sources.length > 0) {  
            if (creep.memory.workLoc === 0 && sources[0]) {  
                targetSource = sources[0];  
            } else if (creep.memory.workLoc === 1 && sources[1]) {  
                targetSource = sources[1];  
            }  
        }

        if (creep.memory.state === 'harvesting' && creep.room.name === sourceRoomName) { 
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {  
                if (targetSource) {  
                    if (creep.harvest(targetSource, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(targetSource, {  
                            visualizePathStyle: { stroke: '#ffffff' }});  
                        }  
                    }  
                } else {  
                creep.memory.state = 'working';  
            }  
        } else if (creep.memory.state === 'working') {  
            if (creep.store[RESOURCE_ENERGY] > 0) {  
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES); // 寻找建筑位  
                if (targets.length) {  
                    var closestTarget = findClosestTarget(creep, targets);  
                    if (creep.build(closestTarget) == ERR_NOT_IN_RANGE) {  
                        creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}}); // 绘制路径并前往最近的建筑位  
                    }  
                    if (creep.build(closestTarget) == OK ){
                        creep.room.update();
                    }
                } else {  
                    // 没有建造任务，尝试修理道路  
                    var damagedRoads = creep.room.find(FIND_MY_STRUCTURES, {  
                        filter: (structure) => {  
                            return (structure.structureType === STRUCTURE_ROAD) && structure.hits < structure.hitsMax * 0.6;  
                        }  
                    });  
                    if (damagedRoads.length) {  
                        var closestDamagedRoad = findClosestTarget(creep, damagedRoads);  
                        if (creep.repair(closestDamagedRoad) === ERR_NOT_IN_RANGE) {  
                            creep.moveTo(closestDamagedRoad, {visualizePathStyle: {stroke: '#ffffff'}});  
                        }  
                    } 
                }
            } else {  
                creep.memory.state = 'harvesting';  
            }  
        } 
    }
};

function findClosestTarget(creep, targets) {  
    let closest = targets[0];  
    let minDistance = creep.pos.getRangeTo(closest);  
    for (let i = 1; i < targets.length; i++) {  
        let distance = creep.pos.getRangeTo(targets[i]);  
        if (distance < minDistance) {  
            closest = targets[i];  
            minDistance = distance;  
        }  
    }  
    return closest;  
}  
module.exports = roleNewbuilder;