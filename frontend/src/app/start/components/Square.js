import styles from './../../page.module.css';
export default function Square( props ) {
	const sStyle = {
		backgroundColor: props.sColor,
	};
	return <div style={ sStyle } className={ styles.squareInBrowse }></div>;
}
