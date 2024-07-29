var Tower = {  
    whitelist: ['ZaindORp','zanggq'], // 示例用户名  
    /**  
     * @param {StructureTower} tower - 当前的塔对象  
     */  
    run: function(tower) {  
        const tasksList = Memory.rooms[tower.room.name].tasks;
        if (tower.store.energy < 600 && !tasksList.some(task => task.type === 'fillTower')) {  
            this.pushFillTowerTask(tower, tasksList); 
            return;
        }  
        if(Game.time % 5 === 0 ){
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);  
            if (target) {  
                // 检查目标是否在白名单中  
                if (!this.whitelist.includes(target.owner.username)) {  
                    tower.attack(target);  
                }  
            } else {  
                // 如果没有敌对单位，则检查并维修受损建筑  
                const roads = tower.room.road;
                const containers = tower.room.container;
                const lowEnergyRoads = roads.filter(road => road.hits < road.hitsMax * 0.6);
                const lowEnergyContainers = containers.filter(container => container.hits < container.hitsMax * 0.6);    
                // 如果没有指定排序或按类型排序后，选择第一个目标进行修复  
                if (lowEnergyContainers.length > 0) {  
                    tower.repair(lowEnergyContainers[0]);  
                }  else if (lowEnergyRoads.length > 0){
                    tower.repair(lowEnergyRoads[0]);
                }
            }  
        }
    },  
    /**  
     * 推送 fillTower 任务到房间物流队列（这里需要实现具体的推送逻辑）  
     * @param {StructureTower} tower - 当前的塔对象  
     */  
    pushFillTowerTask: function(tower, tasksList) {  
        console.log(`正在为塔 ${tower.id} 推送填充任务到 ${tower.room.name} 房间的物流队列中...`);
        tasksList.push({  
            type: 'fillTower',  
            id: tower.id  
        });  
    }  
};  

module.exports = Tower;