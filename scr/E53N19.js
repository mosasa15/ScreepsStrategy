var E53N19 = {  
    run: function(target, room) { 
        var sourceRooms = ['E53N19']; 
        var targetRooms = ['E53N19'];
        var spawn = target; 
        var spawnRoom = spawn.room;  
        var roomName = spawnRoom.name;  // 提前获取房间名称，以便后续使用  
        var roomMemory = Memory.rooms[roomName];  
        
        // 首先检查 roomMemory 和 tasks 数组是否存在  
        if (!roomMemory || !roomMemory.tasks) {  
            // 如果 roomMemory 不存在，则初始化它  
            if (!roomMemory) {  
                Memory.rooms[roomName] = {};  
                roomMemory = Memory.rooms[roomName];  
            }  
            // 如果 tasks 数组不存在，则初始化它  
            if (!roomMemory.tasks) {  
                roomMemory.tasks = [];  
            }  
        }  
        
        // 然后检查房间能量和任务列表  
        if (spawnRoom.energyAvailable < 650 && !roomMemory.tasks.some(task => task.type === 'fillExtension')) {  
            // 推送 'fillExtension' 任务  
            roomMemory.tasks.push({ type: 'fillExtension' });  
            console.log(`房间 ${roomName} 能量不足，已推送 fillExtension 任务。`);  
            return; // 如果需要立即退出后续代码，可以取消注释这行  
        }

        var roleConfigs = [  
            { role: 'manager',          sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 1, priority: 10},
            { role: 'transferer',       sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [1],     maxNumber: 1, priority: 10}, 
            { role: 'transferer',       sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 1, priority: 10},   //priority 越大越优先生产 workLoc 越靠后越优先生产
            // { role: 'NewHarvester',     sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 1, priority: 9},    //priority 相同的时候，排名靠下优先生产
            // { role: 'Newtransferer',    sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 1, priority: 8}, 
            { role: 'upgrader',         sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 2, priority: 7}, 
            { role: 'builder',          sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 1, priority: 6},
            { role: 'repairer',         sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [1,0],     maxNumber: 1, priority: 6}, //兼职挖
            // { role: 'scavenger',        sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 0, priority: 6},
            // { role: 'attacker',         sourceRoom: sourceRooms[2], targetRoom: targetRooms[2], workLoc: [0],     maxNumber: 1, priority: 5}, 
            // { role: 'attacker',         sourceRoom: sourceRooms[1], targetRoom: targetRooms[1], workLoc: [0],     maxNumber: 1, priority: 5}, 
            // { role: 'adventurer',       sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 0, priority: 5},    

            // { role: 'Centraltransferer',sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 1, priority: 4}, 
            
            // { role: 'reserveController',sourceRoom: sourceRooms[1], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 1, priority: 3}, 
            // { role: 'reserveController',sourceRoom: sourceRooms[2], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 1, priority: 3},   

            // { role: 'Newtransferer',    sourceRoom: sourceRooms[2], targetRoom: targetRooms[0], workLoc: [0],     maxNumber: 1, priority: 2},     //E57N13
            // { role: 'NewHarvester',     sourceRoom: sourceRooms[2], targetRoom: targetRooms[2], workLoc: [0],     maxNumber: 1, priority: 1},     //E57N13 
            { role: 'Newbuilder',       sourceRoom: sourceRooms[0], targetRoom: targetRooms[0], workLoc: [1],     maxNumber: 0, priority: 1},     //E57N13 

            // { role: 'Newtransferer',    sourceRoom: sourceRooms[1], targetRoom: targetRooms[0], workLoc: [1,0],   maxNumber: 1, priority: 1},
            // { role: 'NewHarvester',     sourceRoom: sourceRooms[1], targetRoom: targetRooms[1], workLoc: [1,0],   maxNumber: 1, priority: 1},     //E55N13
            // { role: 'Newbuilder',       sourceRoom: sourceRooms[1], targetRoom: targetRooms[1], workLoc: [1,0],   maxNumber: 1, priority: 1},     //E55N13
        ];  
        roleConfigs.sort((a, b) => a.priority - b.priority) // 先按优先级排序

        for (let config of roleConfigs) {    
            let workLocs = config.workLoc;
            for (let workLoc of workLocs) {    
                if (checkCreepLimit(config.role, config.sourceRoom, config.targetRoom, workLoc, config.maxNumber)) {    
                    spawnCreep(spawn, config.role, config.sourceRoom, config.targetRoom, workLoc, createCreepBody(config.role));  
                }  
            }    
        }
    
        // 显示正在生成的Creep的信息
        if(Game.spawns['E53N19'].spawning) { // 孵化过程可视化
            var spawningCreep = Game.creeps[Game.spawns['E53N19'].spawning.name];
            Game.spawns['E53N19'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['E53N19'].pos.x + 1, 
                Game.spawns['E53N19'].pos.y, 
                {align: 'left', opacity: 0.8});
        }
    }  
};

function checkCreepLimit(role, sourceRoom, targetRoom, workLoc, maxNumber) {  
    let count = 0;  
    const creeps = Game.creeps; // 提前获取Game.creeps，减少在循环中的访问次数  
    // 遍历Game.creeps中的所有creep  
    for (const name in creeps) {  
        const creep = creeps[name]; // 存储当前creep的引用  
        // 检查creep的记忆是否与给定参数匹配  
        if (  
            creep.memory.role === role &&  
            creep.memory.sourceRoomName === sourceRoom &&  
            creep.memory.targetRoomName === targetRoom &&  
            creep.memory.workLoc === workLoc  
        ) {  
            count++; // 如果匹配，则计数器加一  
        }  
    }  
    // 返回当前数量是否小于最大数量  
    return count < maxNumber;  
}

function createCreepBody(role) {    //返回body
    let body;  
    switch (role) {  
        case 'harvester':  
            body = [WORK,WORK,MOVE,MOVE];  
            break;  
        case 'transferer':  
            body = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];  
            break;  
        case 'claimer':  
            body = [CARRY,CARRY,MOVE];  
            break;  
        case 'manager':  
            body = [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];  
            break;  
        case 'upgrader':  
            body = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];  
            break;  
        case 'builder':  
            body = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];  
            break;  
        case 'repairer':  
            body = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE];  
            break;  
        case 'Newbuilder':  
            body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];  
            break;  
        default:  
            body = [TOUGH]; 
    }  
    return body;  
}


function spawnCreep(spawn, role, sourceRoom, targetRoom, workLoc, body) {  
    // 检查spawn是否正在生成其他creep  
    if (spawn.spawning === null) {  
        // 构造Creep的名称
        let newName;  
        if (sourceRoom) { 
            newName = `${role}_${sourceRoom}_${Game.time}_${workLoc}`;  
        } else { 
            newName = `${role}_${Game.time}`;  
        }  
        // 尝试生成Creep  
        const result = spawn.spawnCreep(body, newName, {  
            memory: {  
                role: role,  
                sourceRoomName: sourceRoom, 
                targetRoomName: targetRoom,  
                workLoc: workLoc  
            }  
        });  
        // 检查生成结果  
        // if (result === OK) {  
        //     console.log(`成功 生产 ${newName} as a ${role}`);  
        // } else {  
        //     console.log(`失败 生产 ${role} creep: ${result}`);  
        // }  
        
    } 
}

module.exports = E53N19;
