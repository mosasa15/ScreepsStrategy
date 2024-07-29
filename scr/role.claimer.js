var roleclaimer = {  
    /** @param {Creep} creep **/  
    run: function(creep) {  
        // 如果正在转移且能量为0，则停止转移  
        if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] === 0) {  
            creep.memory.transfering = false;  
            creep.say('😃下班了！好耶');  
        }  

        // 如果不在转移且容量已满，则开始转移  
        if (!creep.memory.transfering && creep.store.getFreeCapacity() === 0) {  
            creep.memory.transfering = true;  
            creep.say('😟上班了！呜呜呜');  
        }  

        // 如果不在转移  
        if (!creep.memory.transfering) {  
            // 根据creep的workLoc找到对应的container  
            var targetContainer = null;  
            var workLoc = creep.memory.workLoc;
            var containers = creep.room.container;
            var targetContainer = containers[workLoc];
            

            if (containers.length > 0) {  
                if (targetContainer) {  
                    if (creep.withdraw(targetContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                        creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ffffff'}});  
                    }  
                }  
            }  
        }  
        else {  
            const extensions = creep.room.extension; // 获取creep工作目标
            const towers = creep.room.tower;
            const spawns = creep.room.spawn;

            const lowEnergyTowers = towers.filter(tower => tower.store.energy < tower.store.getCapacity(RESOURCE_ENERGY) * 0.6);    //对工作目标进行初步筛选，筛选出需要补充能量的工作目标
            const notFullEnergyExtensions = extensions.filter(extension => extension.store.energy < extension.store.getCapacity(RESOURCE_ENERGY));  
            const notFullEnergySpawns = spawns.filter(spawn => spawn.store.energy < spawn.store.getCapacity(RESOURCE_ENERGY));  

            let targets = [...notFullEnergyExtensions, ...notFullEnergySpawns];   //合并数组，（不合并tower数组，目前的决策是优先填充Tower，而选择最近的extension和spawn填充
            var closestTarget = findClosestTarget(creep, targets);
            if(lowEnergyTowers.length > 0){
                if (creep.transfer(lowEnergyTowers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(lowEnergyTowers[0], {visualizePathStyle: {stroke: '#ffffff'}})
                }
            } else if (targets.length > 0 ){
                if (creep.transfer(closestTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {  
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });  
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

module.exports = roleclaimer
