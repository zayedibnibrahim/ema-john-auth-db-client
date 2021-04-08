import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import './Product.css'
import { Link } from 'react-router-dom';

const Product = (props) => {

    const { img, name, seller, price, stock, key } = props.eachProduct;
    return (
        <div className="product">
            <div>
                <img src={img} alt={name} />
            </div>
            <div>
                <h4 className="product-name">
                    {props.showAddToCart === true ? <Link to={"/product/" + key}>{name}</Link> : name}
                </h4>
                <br />
                <p><small>by: {seller}</small></p>
                <p>${price}</p>
                <p><small>only {stock} left in stock - Order soon</small></p>
                {
                    props.showAddToCart === true &&
                    <button onClick={() => props.clickHandler(props.eachProduct)} className="main-button"><FontAwesomeIcon icon={faShoppingCart} />Add To Cart</button>
                }
            </div>
        </div>
    );
};

export default Product;