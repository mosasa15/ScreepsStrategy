
let orderCreated = false;  
/**  
 * 创建一个购买能源的订单  
 * 注意：此函数设计为在整个程序的运行周期内只创建一个订单。  
 */  
function createBuyOrderForEnergy() {  
    if (orderCreated) {  
        console.log('An order for energy has already been created.');  
        return;  
    }  
    const roomName = 'E54N19';  
    const amount = 800000;
    const price = 22;  
    const orderId = Game.market.createOrder({  
        type: ORDER_BUY,  
        resourceType: RESOURCE_ENERGY,  
        price: price,  
        totalAmount: amount,  
        roomName: roomName  
    });  
    if (orderId === -1) {  
        console.log('失败创建订单', roomName);  
    } else {  
        console.log('成功创建订单；', orderId, '在', roomName);  
        orderCreated = true; // 标记订单已创建  
    }  
}  
// 导出函数以便在其他文件中使用  
module.exports = {  
    createBuyOrderForEnergy  
};
