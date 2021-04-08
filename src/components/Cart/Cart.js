import React from 'react';

import './Cart.css'

const Cart = (props) => {
    const cart = props.cartCount;
    // const total = cart.reduce((total, pd) => total + pd.price * pd.quantity, 0);
    let total = 0;
    for(let i = 0; i< cart.length; i++){
        const product = cart[i];
        
        total = total + product.price * product.quantity || 1;
    }

    return (
        <div>
            <h1>This cart</h1>
            <h5>Order Summary : {cart.length}</h5>
            <h5>Total Price : {total.toFixed(2)}</h5>
            {
                props.children
            }
        </div>
    );
};

export default Cart;