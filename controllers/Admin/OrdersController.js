const orders = require('../..//models/orders');
const render = require('../../app/render');

class OrdersController{
    static async index(req,res,next){
        const sortby = req.query.sortby;
        const mindate = req.query.mindate;
        const maxdate = req.query.maxdate;
        const customer = req.query.customer;
        const status = req.query.status;
        let orders_list = await orders(req).getAll({mindate:mindate,maxdate:maxdate,customer:customer,status:status},sortby);
        return render(req,res,'admin/orders/orders',{orders: orders_list})
    }
    static async goto(req,res,next){
        return res.redirect('/admin/orders/' + req.query.order.trim());
    }
    static async next(req,res,next){
        await orders(req).next(req.params.order_id);
        return res.redirect('back');
    }
    static async order(req,res,next){
        let order = await orders(req).get(req.params.order_id);
        if(order == null){
            res.status(404);
            return res.send();
        }
        return render(req,res,'admin/orders/order',{order:order})
    }
}

module.exports = OrdersController;