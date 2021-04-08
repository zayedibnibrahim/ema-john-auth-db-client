import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { userContext } from '../../App';
import { getDatabaseCart, processOrder } from '../../utilities/databaseManager';
import './Shipment.css'
const Shipment = () => {

    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => {
        console.log(data);
        const savedCart = getDatabaseCart();
        const orderDetails = {...loggedInUser, products: savedCart, Shipment: data}

        fetch('https://quiet-citadel-44826.herokuapp.com/addOrders', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(orderDetails)
        })
        .then(res => res.json())
        .then(data => {
            if(data){
                processOrder();
            }
        })
    }
    return (
        <div>
            <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>

                <input name="name" defaultValue={loggedInUser.name} ref={register} placeholder="Your Name"/>
                {errors.name && <span className="error">This field is required</span>}

                <input name="email" defaultValue={loggedInUser.email} ref={register({ required: true })} placeholder="Your Email"/>
                {errors.email && <span className="error">This field is required</span>}

                <input name="address" ref={register({ required: true })} placeholder="Your Address"/>
                {errors.address && <span className="error">This field is required</span>}

                <input name="phone" ref={register({ required: true })} placeholder="Phone"/>
                {errors.phone && <span className="error">This field is required</span>}

                <input type="submit" />
            </form>
        </div>
    );
};

export default Shipment;