const users = require('../models/users');
const books = require('../models/books');
const orders = require('../models/orders');
const getBasket = require('../models/basket');
const render = require('../app/render');

class BasketController{
    static async index(req, res, next) {
        let products = await getBasket(req,res).products();

        console.log(products);

        return render(req,res,"basket/basket", {title: 'Basket', basket: products});
    }
    static async buy(req,res,next) {
        let step = req.body.step;
        if(step == null){
            return render(req,res,'basket/order/order_address');
        } else if(step === "address"){
            return render(req,res,'basket/order/order_payment',{
                surname:req.body.surname,
                name:req.body.name,
                middlename:req.body.middlename,
                phone:req.body.phone,
                address:req.body.address});
        } else if(step === "payment"){
            let basket = getBasket(req,res);
            let order = await orders(req).add(await basket.products(),
                req.body.surname,
                req.body.name,
                req.body.middlename,
                req.body.phone,
                req.body.address,
                req.body.card_number,
                req.body.card_validity,
                req.body.card_owner,
                req.body.card_code,
                req.user == null?1:req.user._id
            );

            basket.clear();
            res.redirect('/orders/' + order._id)
        }
    }
    static async add(req, res, next) {
        let product = req.body.product;
        let quantity = req.body.quantity;

        await getBasket(req,res).add(product,quantity);

        res.redirect('back');
    }
    static async remove(req,res,next) {
        let product = req.body.product;
        await getBasket(req,res).remove(product);

        res.redirect('back');
    }
    static async clear (req,res,next) {
        await getBasket(req,res).clear();

        res.redirect('back');
    }
}

module.exports = BasketController;