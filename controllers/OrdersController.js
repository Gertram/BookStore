const orders = require('../models/orders')
const render = require('../app/render');

class OrdersController{
    static async index(req, res, next) {
        if(req.cookies.user == null){
            if(req.cookies.orders == null || req.cookies.orders.length == 0){
                return render(req,res,'orders/orders',{orders:[]})
            }

            let orders_List = await orders(req).getAll(req.cookies.orders);
            return render(req,res,"orders/orders", {orders:orders_list});
        }

        let orders_list = await orders(req).getAll(req.cookies.user);

        return render(req,res,"orders/orders", {orders:orders_list});
    }
    static async find(req, res, next) {
        let order_id = req.query.order_id;
        let order = await orders(req).get(order_id);
        return render(req,res,"orders/order", {order:order});
    }
    static async order(req, res, next) {
        let order = await orders(req).get(req.params.order);
        return render(req,res,"orders/order", {order:order});
    }
}

module.exports = OrdersController;