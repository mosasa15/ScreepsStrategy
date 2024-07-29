var roleManager = {  
    /**  
     * @param {Creep} creep - The creep to run logic for.  
     */  
    run: function(creep) {  
        const tasksList = Memory.rooms[creep.room.name].tasks;  
        const extensions = creep.room.extension;
        const towers = creep.room.tower;
        const spawns = creep.room.spawn;
        const labs = creep.room.lab;
        var storage = creep.room.storage;


        // var storage = creep.room.storage;
        // if(creep.store[RESOURCE_LEMERGIUM_HYDRIDE] === 0){
        //     if (creep.withdraw(labs[3], RESOURCE_LEMERGIUM_HYDRIDE) === ERR_NOT_IN_RANGE) {  
        //         creep.moveTo(labs[3], {visualizePathStyle: {stroke: '#ffffff'}});  
        //     }  
        // } else {
        //     if (creep.transfer(storage, RESOURCE_LEMERGIUM_HYDRIDE) === ERR_NOT_IN_RANGE) {  
        //         creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});  
        //     }  
        // }


        if(tasksList.some(task => task.type === 'fillExtension')){
            fillExtensions(creep, tasksList, extensions, spawns, storage);
        }
        else if(tasksList.some(task => task.type === 'fillTower')){  
            fillTowers(creep, tasksList, towers, storage);
        }
        else if(tasksList.some(task => task.type === 'labGetEnergy')){
            fillLabsEnergy(creep, tasksList, labs, storage)
        }
        else 
        if(tasksList.some(task => task.type === 'boostGetResource')){
            if(creep.store[RESOURCE_ENERGY] === 0){
                fillLabsBoostSource(creep, tasksList, labs, storage)
            } else {
                if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});  
                }  
            }
        }

        if(creep.store[RESOURCE_LEMERGIUM_HYDRIDE] === 0){
        } else if(!tasksList.some(task => task.type === 'boostGetResource')){
            if (creep.transfer(storage, RESOURCE_LEMERGIUM_HYDRIDE) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});  
            }  
        }

        if(creep.store[RESOURCE_CATALYZED_GHODIUM_ACID] === 0){
        } else if (!tasksList.some(task => task.type === 'boostGetResource')){
            if (creep.transfer(storage, RESOURCE_LEMERGIUM_HYDRIDE) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});  
            }  
        }
    }  
};  

function fillTowers(creep, tasks, towers) { 
    //获取能量 
    if (creep.store[RESOURCE_ENERGY] === 0) {  
        var storage = creep.room.storage;
        if (storage) {  
            if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});  
            }  
        } 
    } else {
        // 查找 'fillTower' 类型的任务  
        const fillTowerTask = tasks.find(task => task.type === 'fillTower');  
        if (fillTowerTask) {  
            // 查找对应的 tower  
            const targetTower = creep.room[fillTowerTask.id];  
            const lowEnergyTowers = towers.filter(tower=> tower.store.energy < tower.store.getCapacity(RESOURCE_ENERGY) * 0.6);
            if (targetTower.store.energy < 600) {  
                if (creep.transfer(targetTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                    creep.moveTo(targetTower, {visualizePathStyle: {stroke: '#ffffff'}});  
                }  
            } else if (lowEnergyTowers.length > 0) {
                const closestTower = findClosestTarget(creep, lowEnergyTowers);  
                if (creep.transfer(closestTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                    creep.moveTo(closestTower, {visualizePathStyle: {stroke: '#ffffff'}});  
                } 
            } else {
                creep.say('我滴任务完成啦')
                Memory.rooms[creep.room.name].tasks = tasks.filter(task => task.type !== 'fillTower');
            }
        }  
    }
}  

function fillLabsBoostSource(creep, tasks, labs, storage) {  
    const fillLabsTask = tasks.find(task => task.type === 'boostGetResource');  
    if (!fillLabsTask) return; // 如果没有找到任务，则直接返回  
    // 遍历任务中的所有资源需求  
    for (let resource of fillLabsTask.resource) {  
        // 检查资源是否已完全转移（number 为 0）  
        if (resource.amount <= 0) continue;  
        // 尝试从存储中提取资源  
        let err = creep.withdraw(storage, resource.type, resource.amount);  
        if (err === ERR_NOT_IN_RANGE) {  
            creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });  
        }  
        // 如果从存储中提取资源成功 (在自身上限和资源上限取最小值)
        if (creep.store[resource.type] >= Math.min(resource.amount, creep.store.getCapacity(resource.type))) {  
            // 查找目标实验室 
            var currentlyCarry = creep.store[resource.type];
            const targetLab = creep.room[resource.id];  
            if (targetLab) {  
                // 尝试将资源转移到实验室  
                let transferResult = creep.transfer(targetLab, resource.type, resource.amount);  
                if (transferResult === ERR_NOT_IN_RANGE) {  
                    creep.moveTo(targetLab, { visualizePathStyle: { stroke: '#ffffff' } });  
                }  
                // 更新剩余需要转移的资源量  
                if (transferResult === OK) {  
                    resource.amount -= currentlyCarry;
                     // 检查任务是否完成（所有资源的 number 都为 0）  
                    if (fillLabsTask.resource.every(res => res.amount <= 0)) {  
                        creep.say('我滴任务完成啦');  
                        // 从任务列表中移除已完成的任务  
                        Memory.rooms[creep.room.name].tasks = tasks.filter(task => task.type !== 'boostGetResource');  
                    } 
                }  
            }  
        }  
    } 
}

function fillLabsEnergy(creep, tasks, labs, storage) {  
    //获取能量 
    if (creep.store[RESOURCE_ENERGY] === 0) {  
        if (storage) {  
            if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});  
            }  
        } 
    } else {
        const notFullEnergyLabs = labs.filter(lab => lab.store[RESOURCE_ENERGY] < 2000); 
        if (notFullEnergyLabs.length > 0){
            var closestTarget = findClosestTarget(creep, notFullEnergyLabs);
            if (creep.transfer(closestTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}})
            }
        } else {
            creep.say('我滴任务完成啦')
            Memory.rooms[creep.room.name].tasks = tasks.filter(task => task.type !== 'labGetEnergy');
        }
    }
}

function fillExtensions(creep, tasks,extensions, spawns, storage) {
    //获取能量 
    if (creep.store[RESOURCE_ENERGY] === 0) {  
        if (storage) {  
            if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});  
            }  
        } 
    } else {
        const notFullEnergyExtensions = extensions.filter(extension => extension.store.energy < extension.store.getCapacity(RESOURCE_ENERGY));  
        const notFullEnergySpawns = spawns.filter(spawn => spawn.store.energy < spawn.store.getCapacity(RESOURCE_ENERGY));  
        let targets = [...notFullEnergyExtensions, ...notFullEnergySpawns];  
        var closestTarget = findClosestTarget(creep, targets);
        if (targets.length > 0 ){
            if (creep.transfer(closestTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}})
            }
        } else {
            creep.say('我滴任务完成啦')
            Memory.rooms[creep.room.name].tasks = tasks.filter(task => task.type !== 'fillExtension');
        }
    }
}  


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

module.exports = roleManager;