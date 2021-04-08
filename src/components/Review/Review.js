import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
// import fakeData from '../../fakeData';
import { getDatabaseCart, removeFromDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import ReviewItem from '../ReviewItem/ReviewItem';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

const Review = () => {
    const [cart, setCart] = useState([]);

    const removeProduct = (productKey) => {
        const newCart = cart.filter(pd => pd.key !== productKey)
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }
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
                const cartProducts = productKeys.map(key => {
                    const product = data.find(pd => pd.key === key);
                    product.quantity = savedCart[key];
                    return product;
                });
                setCart(cartProducts);
            })

        // const cartProducts = productKeys.map(key => {
        //     const product = fakeData.find(pd => pd.key === key);
        //     product.quantity = savedCart[key];
        //     return product;
        // });
        // setCart(cartProducts);
    }, [])
    // Process Order
    const history = useHistory()
    const handlerProceedCheckout = () => {
        history.push("/shipment")
    }
    return (
        <div className="twin-container">
            <div className="product-container">
                {
                    cart.length === 0 &&
                    <div className="d-flex justify-content-center align-items-center">
                        <div class="spinner-border text-info" role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div>
                }
                {
                    cart.map(pd => <ReviewItem removeProduct={removeProduct} key={pd.key} product={pd}></ReviewItem>)
                }
            </div>
            <div className="cart-container">
                <Cart cartCount={cart}>
                    <button onClick={handlerProceedCheckout} className="main-button">Proceed Checkout</button>
                </Cart>
            </div>
        </div>
    );
};

export default Review;