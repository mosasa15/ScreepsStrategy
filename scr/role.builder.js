var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.boosted === undefined) {  
            creep.memory.boosted = false;  
        }  
        const sourceRoomName = creep.memory.sourceRoomName;   
        const storage = creep.room.storage;  
        const labs = creep.room.lab;
        const tasksList = Memory.rooms[creep.room.name].tasks;
        var workLoc = creep.memory.workLoc;
        //移动到源房间
        if (creep.room.name !== sourceRoomName) {  
            creep.moveTo(new RoomPosition(20, 25, sourceRoomName), { visualizePathStyle: { stroke: '#0000ff' } });  
        } 

        if (creep.room.name === 'E54N19') {  
            // 只在E54N19房间进行boost强化  
            if (!creep.memory.boosted) {  
                var targetLab = labs[1]; 
                const result = targetLab.boostCreep(creep);  
                if (result === OK) {  
                    creep.memory.boosted = true;  
                } else if (result === ERR_NOT_IN_RANGE) {  
                    creep.moveTo(targetLab, { visualizePathStyle: { stroke: '#0000ff' } });  
                } else if (result === ERR_NOT_ENOUGH_RESOURCES && !tasksList.some(task => task.type === 'boostGetResource') && !tasksList.some(task => task.type === 'labGetEnergy')) {  
                    // 如果资源不足，调用this.boostBodyParts来请求物资  
                    this.boostBodyParts(creep, labs, tasksList);  
                }  
            }  
        
            // 如果已经boosted或者boost流程结束后  
            if (creep.memory.boosted) {  
                // 状态切换逻辑  
                this.toggleState(creep);  
                // 执行动作  
                if (creep.memory.building) { 
                    var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES); // 寻找建筑位 
                    if(constructionSites.length > 0){
                        this.buildConstruction_Sites(creep, constructionSites);  
                    } else {
                        this.buildRampart(creep);
                    }
                } else {  
                    this.harvestEnergy(creep,storage);  
                }  
            }  
        } else {  
            // 在非E54N19房间  
            if (creep.room.name === sourceRoomName) {  
                // 状态切换逻辑  
                this.toggleState(creep);  
                // 执行动作  
                if (creep.memory.building) { 
                    var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES); // 寻找建筑位 
                    if(constructionSites.length > 0){
                        this.buildConstruction_Sites(creep, constructionSites);  
                    } else {
                        this.buildRampart(creep);
                    }
                } else {  
                    this.harvestEnergy(creep,storage);  
                } 
            }  
        }
	},

    boostBodyParts: function(creep, labs, tasksList) {  
        const workParts = creep.body.filter(part => part.type === WORK).length;  
        const totalCompound = workParts * 30;  
        const lab = labs[1];  
        const Compound = RESOURCE_LEMERGIUM_HYDRIDE; 
        // 检查实验室是否有足够的RESOURCE_LEMERGIUM_HYDRIDE
        if (lab.store[Compound] < totalCompound) {  
            console.log(`实验室 ${lab.id} 缺少 ${totalCompound - lab.store[Compound]} 单位的 ${Compound}，无法强化Creep的WORK部件。`);  
            tasksList.push({  
                type:'boostGetResource',  
                resource: [  
                    {  
                        id: lab.id,  
                        type: Compound,  
                        amount: totalCompound - lab.store[Compound]  
                    }  
                ]  
            });  
        }  
        // 检查实验室是否有足够的ENERGY  
        if (lab.store[RESOURCE_ENERGY] < 2000) {  
            console.log(`实验室 ${lab.id} 缺少ENERGY，无法强化Creep的WORK部件。`);  
            tasksList.push({
                type: 'labGetEnergy'
            });  
        }   
        return;  
    },

    toggleState: function(creep) {  
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) { // building && 背包为空
            creep.memory.building = false;  // 变为 非building状态
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) { // 非building状态 && 背包满(空余为0)
	        creep.memory.building = true;  // 变为 building状态
	        creep.say('🚧 build');
	    }
    },  

    upgradeController: function(creep) {  
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {  
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });  
        } 
    },  

    buildRampart: function(creep) {  
        var ramparts = creep.room.rampart;
        const lowHitsRamparts = ramparts.filter(rampart => rampart.hits < rampart.hitsMax * 0.1)
        if (lowHitsRamparts.length > 0) {  // 如果存在需要修复的Rampart  
            if (creep.repair(lowHitsRamparts[0]) == ERR_NOT_IN_RANGE) {  // 如果不在修复范围内  
                creep.moveTo(lowHitsRamparts[0], {visualizePathStyle: {stroke: '#ffffff'}});  // 绘制路径并前往Rampart  
            }  
        }
    },  

	buildConstruction_Sites: function(creep, targets) {  
            if(targets.length) {  // targets.length > 0  || 建筑位 > 0
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}}); // 绘制路径
                }
            }
    },  

    harvestEnergy: function(creep,storage) {  
        if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {  
            creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });  
        }  
    } 
};

module.exports = roleBuilder;