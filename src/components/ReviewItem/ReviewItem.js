import React from 'react';
import './ReviewItem.css'

const reviewItem = (props) => {
    const { name, quantity, img, key } = props.product;
    return (
        <div className="product">
            <div className="product-img">
                <img src={img} alt="" />
            </div>
            <div className="product-info">
                <h4 className="product-name">{name}</h4>
                <p>Quantity: {quantity}</p>
                <button onClick={() => props.removeProduct(key)} className="main-button">Remove</button>
            </div>
        </div>
    );
};

export default reviewItem;