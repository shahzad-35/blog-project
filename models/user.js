const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongoDb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return JSON.stringify(cp.productId) === JSON.stringify(product._id);
        });
        let newQuantity = 1;

        const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
        }

        const updateCart = { items: updatedCartItems };
        const db = getDb();
        return db.collection('users')
        .updateOne({ _id: new ObjectId(this._id) },
            { $set: { cart: updateCart } });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users')
        .findOne({ _id: new ObjectId(userId) })
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => {
            console.log(err);
        });
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return JSON.stringify(i.productId) === JSON.stringify(p._id);
                        }).quantity
                    };
                });
            });
    }

    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.items.filter(item => {
            return JSON.stringify(item.productId) !== JSON.stringify(productId);
        });
        const db = getDb();
        return db.collection('users')
        .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: {items: updatedCartItems} } });
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
          .then(products => {
            const order = {
              items: products,
              user: {
                _id: new ObjectId(this._id),
                name: this.username
              }
            };
            return db.collection('orders').insertOne(order);
          })
          .then(result => {
            this.cart = { items: [] };
            return db
              .collection('users')
              .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: [] } } }
              );
          });
      }


    getOrders(){
        const db = getDb();
        return db.collection('orders')
        .find({'user._id': new ObjectId(this._id)})
        .toArray();
    }
}

module.exports = User;