import styles from './../../page.module.css';

export default function Cart( props ) {
	return (
		<div className={ styles.cartStyle } >
			<div className={ styles.subSubHeader }>
				Cart: { props.items.length } products
			</div>

			<div className={ styles.cartScrollable }>
				{ props.items.map( ( item ) => (
					<div className={ styles.cardInCart } key={ item.id } onClick={ () => props.deleteHandler( item.id ) }>
						<div className={ styles.infoOfCardInCart }>
							Title: { item.title }
							<br />
							Price: { item.price }€
							<br />
							Date: { item.dateAdded }
						</div>
						<div
							className={ styles.squareInCart }
							style={ { backgroundColor: item.color } }
						>
						</div>
					</div>
				) ) }
			</div>
		</div >
	);
}
