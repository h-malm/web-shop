import { useState, useEffect } from "react";
import React from 'react';
import styles from './../page.module.css';
import LoginPage from "./Login";

export default function Cart ( props ) {
	const savedUsername = localStorage.getItem( 'username' );
	const [isLoggedIn, setIsLoggedIn] = useState( false );

	let totalPrice = 0;
	for ( let i = 0; i < props.items.length; i++ ) {
		let currentPrice = parseFloat( props.items[i].price );
		totalPrice += currentPrice;
	}

	return (
		<>
			<div className={styles.cartStyle} >

				{isLoggedIn ? (
					<div>
						<div className={styles.subHeader}>
							{savedUsername}'s cart'
						</div>
						<div className={styles.subSubHeader}>
							Cart: {props.items.length} items
							<br />
							Total Price: {totalPrice}€
						</div>
						<div className={styles.cartScrollable}>
							{props.items.map( ( item ) => (
								<div className={styles.cardInCart} key={item.id}>
									<div className={styles.infoOfCardInCart}>
										Title: {item.title}
										<br />
										Price: {item.price}€
										<br />
										Date: {item.dateAdded}
										<br />
										<button onClick={() => props.deleteHandler( item.id )} className={styles.deleteFromCart}>
											Remove from cart
										</button>
									</div>

									<div
										className={styles.squareInCart}
										style={{ backgroundColor: item.color }}
									>
									</div>
								</div>
							) )}


						</div >

					</div>

				) : (
					<div className={styles.subHeader}>
						You have to log in to add items to your cart.
					</div>
				)}


			</div>
		</>
	);
}
