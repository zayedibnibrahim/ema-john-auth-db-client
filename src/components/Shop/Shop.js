import React, { useEffect, useState } from 'react';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'
import { Link } from 'react-router-dom';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
const Shop = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://quiet-citadel-44826.herokuapp.com/allProduct')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])

    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);

        fetch('https://quiet-citadel-44826.herokuapp.com/productsByKeys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productKeys)
        })
            .then(res => res.json())
            .then(data => {
                console.log("Shop: ", data)
                if (data.length > 0) {
                    const previousCart = productKeys.map(pdKey => {
                        let getProduct = data.find(pd => pd.key === pdKey)

                        getProduct.quantity = savedCart[pdKey];
                        return getProduct;
                    })

                    setCart(previousCart)
                }
            })
        // if (products.length > 0) {
        //     const previousCart = productKeys.map(pdKey => {
        //         let getProduct = products.find(pd => pd.key === pdKey)

        //         getProduct.quantity = savedCart[pdKey];
        //         return getProduct;
        //     })

        //     setCart(previousCart)
        // }
    }, [])

    const productClickHandler = (product) => {

        const toBeAdded = product.key;
        const sameProduct = cart.find(pd => pd.key === toBeAdded);
        let count = 1;
        let newCart;
        if (sameProduct) {
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd => pd.key !== toBeAdded);
            newCart = [...others, sameProduct];

        }
        else {
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        addToDatabaseCart(product.key, count);
    }

    return (
        <div className="twin-container">
            <div className="product-container">
                {
                    products.length === 0 &&
                    <div className="d-flex justify-content-center align-items-center">
                        <div class="spinner-border text-info" role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div>
                }
                {
                    products.map(product => <Product showAddToCart={true} key={product.key} eachProduct={product} clickHandler={productClickHandler}></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cartCount={cart}>
                    <Link to="/review">
                        <button className="main-button">Review Order</button>
                    </Link>
                </Cart>
            </div>
        </div>
    );
};

export default Shop;