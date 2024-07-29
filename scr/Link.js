var Link = {  
    /**  
     * 根据Link的职责执行相应的操作  
     * @param {StructureLink} link - 当前操作的Link对象  
     */  
    run: function(link) {  
        // 获取当前房间的内存  
        const roomMemory = Memory.rooms[link.room.name];  
        // 检查Link的职责  
        if (roomMemory.centerLinkId === link.id) {  
            // 作为CenterLink的行为  
            this.runAsCenterLink(link, roomMemory);  
        } else if (roomMemory.upgradeLinkId === link.id) {  
            // 作为UpgradeLink的行为  
            this.runAsUpgradeLink(link, roomMemory);  
        } else {  
            // 默认作为SourceLink的行为  
            this.runAsSourceLink(link, roomMemory);  
        }  
    },  

    /**    
     * CenterLink的行为    
     * @param {StructureLink} link  当前作为中心Link的结构体    
     * @param {Object} roomMemory  房间内存对象，包含关于房间状态的信息    
     */    
    runAsCenterLink: function(link, roomMemory) {    
        const upgradeLink = Game.getObjectById(roomMemory.upgradeLinkId);    
        // 检查UpgradeLink是否存在且需要能量，且Link的冷却时间已结束  
        if (roomMemory.requestEnergyFromCenterLink){  //当upgradeLink向room发布接收能量的任务
            roomMemory.transferEnergyToStorage = false;  //取消将能量转移到storage的任务
            if (upgradeLink && link.cooldown === 0 && link.store[RESOURCE_ENERGY] > 799 ) {    
                    link.transferEnergy(upgradeLink);    
            }
        } else {
            roomMemory.transferEnergyToStorage = true; //重新发布将能量转移到storage的任务
        }
    },

    /**  
     * UpgradeLink的行为  
     * @param {StructureLink} link  
     * @param {Object} roomMemory  
     */  
    runAsUpgradeLink: function(link, roomMemory) {  
        const centerLink = Game.getObjectById(roomMemory.centerLinkId);
        if (link.store[RESOURCE_ENERGY] >= 100) {  
            if (roomMemory.requestEnergyFromCenterLink) {    
                roomMemory.requestEnergyFromCenterLink = false;     
                //console.log('UpgradeLink能量已满，停止从centerLink请求能量');  
            }  
        } else if (link.store[RESOURCE_ENERGY] < 100 && !centerLink.cooldown) {  
            if (!roomMemory.requestEnergyFromCenterLink) {  
                roomMemory.requestEnergyFromCenterLink = true;  
                //console.log('UpgradeLink能量不足，请求从centerLink获取能量');  
            }  
        }  
    },  

    /**  
     * SourceLink的行为  
     * @param {StructureLink} link - 当前的SourceLink实例  
     * @param {Object} roomMemory - 房间内存对象  
     */  
    runAsSourceLink: function(link, roomMemory) {  
        const centerLink = Game.getObjectById(roomMemory.centerLinkId);  
        const upgradeLink = Game.getObjectById(roomMemory.upgradeLinkId);  
        if (upgradeLink) {  
            // 检查UpgradeLink是否存在  
            if (upgradeLink.store[RESOURCE_ENERGY] <= 600) {  
                // 如果存在UpgradeLink且其能量未满，则向UpgradeLink传输能量  
                if (link.transferEnergy(upgradeLink) === OK) {  
                    //console.log('UpgradeLink能量不足，向upgradeLink发送能量成功。传输冷却时间：', link.cooldown);  
                } else {  
                    //console.log('尝试向UpgradeLink发送能量失败，可能是因为冷却时间未结束或自身能量不足。传输冷却时间：', link.cooldown);  
                }  
            } else if (centerLink) {  
                // 否则，如果CenterLink存在，则向CenterLink传输能量  
                if (link.transferEnergy(centerLink) === OK) {  
                    //console.log('UpgradeLink能量已满，向centerLink发送能量成功。传输冷却时间：', link.cooldown);  
                } else {  
                    //console.log('尝试向CenterLink发送能量失败，可能是因为冷却时间未结束或自身能量不足。传输冷却时间：', link.cooldown);  
                }  
            }  
        } 
    }
};  

// 导出模块  
module.exports = Link;