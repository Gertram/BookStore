const deliveries = require('../..//models/deliveries');
const books = require('../..//models/books');
const render = require('../../app/render');

class DeliveriesController{
    static async index(req,res,next){
        let deliveries_list = await deliveries(req).getAll();

        return render(req,res,'admin/deliveries/delivers',{deliveries: deliveries_list})
    }
    static async remove(req,res,next) {
        await deliveries(req).remove(req.body.delivery);
        res.redirect('back');
    }
    static async close(req,res,next) {
        let delivery = await deliveries(req).get(req.params.delivery_id);
        if(delivery == null){
            res.status(404);
            return res.send();
        }

        await deliveries(req).close(delivery._id);
        res.redirect('back');
    }
    static async add(req,res,next) {
        let delivery = await deliveries(req).get(req.params.delivery_id);
        if(delivery == null){
            res.status(404);
            return res.send();
        }

        await deliveries(req).add(delivery._id,req.body.product,req.body.count,req.body.cover);
        res.redirect('back');
    }
    static async delivery(req,res,next){
        let delivery = await deliveries(req).get(req.params.delivery_id);
        if(delivery == null){
            res.status(404);
            return res.send();
        }

        return render(req,res,'admin/deliveries/delivery',{delivery:delivery,books:await books(req).getAll()})
    }
}

module.exports = DeliveriesController;