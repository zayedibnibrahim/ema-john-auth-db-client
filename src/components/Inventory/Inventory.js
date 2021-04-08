import React from 'react';
import fakeData from '../../fakeData';
const Inventory = () => {
    const addProductHandler = () => {
        fetch('https://quiet-citadel-44826.herokuapp.com/addProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fakeData)
        })
            .then(res => {
                console.log(res)
            })
    }
    return (
        <div>
            <h1>
                <button onClick={addProductHandler}>Add Products</button>
            </h1>
        </div>
    );
};

export default Inventory;