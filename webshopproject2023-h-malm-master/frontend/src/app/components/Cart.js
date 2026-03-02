import React from 'react';
import styles from './../page.module.css';

export default function Cart ( props ) {

	let totalPrice = 0;
	for ( let i = 0; i < props.items.length; i++ ) {
		let currentPrice = parseFloat( props.items[i].price );
		totalPrice += currentPrice;
	}

	return (
		<div className={styles.cartStyle} >

			<div className={styles.subSubHeader}>
				Cart: {props.items.length} products
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
			</div>
		</div >
	);
}
