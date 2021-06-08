const providers = require('../..//models/providers');
const deliveries = require('../..//models/deliveries');
const render = require('../../app/render');

class ProvidersController{
    static async index(req,res,next){
        let providers_list = await providers(req).getAll();
        return render(req,res,'admin/providers/providers',{providers: providers_list})
    }
    static async add(req,res,next) {
        await providers(req).add(req.body.name,req.body.phone);
        res.redirect('back');
    }
    static async remove(req,res,next) {
        await providers(req).remove(req.body.provider);
        res.redirect('back');
    }
    static async provider(req,res,next){
        let provider = await providers(req).get(req.params.provider_id);
        if(provider == null){
            res.status(404);
            return res.send();
        }
        return render(req,res,'admin/providers/provider',provider)
    }
    static async newDelivery(req,res,next) {
        let provider = await providers(req).get(req.params.provider_id);
        if(provider == null){
            res.status(404);
            return res.send();
        }

        let delivery = await deliveries(req).open(provider._id,req.user._id);

        res.redirect('/admin/deliveries/' + delivery._id);
    }
}

module.exports = ProvidersController;