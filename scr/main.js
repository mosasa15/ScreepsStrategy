var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTransferer = require('role.transferer');
var roleRepairer = require('role.repairer');
var SpawnFunction = require('Spawn');
var NewSpawnFunction = require('NewSpawn');
var roleAttacker = require('role.attacker');
var roleclaimer = require('role.claimer')
var roleNewHarvester = require('role.NewHarvester');
var roleNewtransferer = require('role.Newtransferer');
var roleScavenger = require('role.scavenger');
var roleAdventurer = require('role.adventurer');
var rolereserveController = require('role.reserveController');
var roleCentraltransferer = require('role.Centraltransferer');
var Tower = require('tower');
var Link = require('Link');
var E53N19 = require('E53N19');
var roleManager = require('role.manager');
var roleNewbuilder = require('role.Newbuilder');
const market = require('market');  
require('超级移动优化hotfix 0.9.4');
require('极致建筑缓存 v1.4.3');


module.exports.loop = function () {
    for(var name in Memory.creeps) { // 释放内存
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
            continue;
        }
    }


    //market.createBuyOrderForEnergy();

    if (Game.cpu.bucket === 10000) {//如果CPU到了一万点，则换成pixel
        Game.cpu.generatePixel();
        console.log(`兑换成功`);
    }
    


    var spawn1 = Game.spawns['Spawn1'];
    SpawnFunction.run(spawn1, 'E54N19');


    var spawn2 = Game.spawns['E56N13'];
    NewSpawnFunction.run(spawn2);

    var spawn3 = Game.spawns['E53N19'];
    E53N19.run(spawn3, 'E53N19');




    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'transferer') {
            roleTransferer.run(creep);
        }
        else if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if(creep.memory.role == 'NewHarvester') {
            roleNewHarvester.run(creep);
        }
        else if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
        else if(creep.memory.role == 'manager') {
            roleManager.run(creep);
        }
        else if(creep.memory.role == 'Newtransferer') {
            roleNewtransferer.run(creep);
        }
        else if(creep.memory.role == 'Newbuilder') {
            roleNewbuilder.run(creep);
        }
        else if(creep.memory.role == 'scavenger') {
            roleScavenger.run(creep);
        }
        else if(creep.memory.role == 'claimer') {
            roleclaimer.run(creep);
        }
        else if(creep.memory.role == 'reserveController') {
            rolereserveController.run(creep);
        }
        else if(creep.memory.role == 'Centraltransferer') {
            roleCentraltransferer.run(creep);
        }
        else if(creep.memory.role == 'adventurer') {
            roleAdventurer.run(creep);
        }
    }

    const towerIds = ['66a310ca7aa534861d61e3da', '668463fe494b782380b1db7c','669b7aca0cfed92d8bd089e6',
                    '668c0231bf902da010c66403','66964351a472dbf2cba2baf8','66a735785dbcd154fd3e1afa']; 
    towerIds.forEach(towerId => {  
        const tower = Game.structures[towerId];  
        if (tower) {
            Tower.run(tower);  
        } 
    });

    const linkIds = ['669e56e38f2eeebab669cbb4', '669e4fa500e47d2abb0cdc12','669e549700e47d0a7c0cdd56',
                    '669e496f01946d1b868e346a','66a21df478ffaa307b5abe1a','66a3428d1d2767257b45e528',
                    '66a21bd6bdc564fcf6bc4ce6']; 
    linkIds.forEach(linkId => {  
        const link = Game.structures[linkId];  
        if (link) {
            Link.run(link);  
        } 
    });
    


    //Memory.rooms.E54N19.centerLinkId = Links[3].id;
    //Memory.rooms.E56N13.upgradeLinkId = Links[2].id;
}