import styles from "../../page.module.css";

export default function Label( props ) {
	return <div className={ styles.Label }>
		Title: { props.lTitle }
		<br />
		Price: { props.lPrice }€
		<br />
		Description: { props.lDescription }
		<br />
		Seller: { props.lOwner }
		<br />
		Date Added: { props.lDateAdded }
		<br />
		{ props.lStatus }
	</div>;
}
