import React from "react";
import styles from "./../page.module.css";

export default function Label ( props ) {
	return <div className={styles.Label}>
		<div>
			{props.lOwner}
			<br />
			Published: {props.lDateAdded}
			<div className={styles.cardPrice}>
				{props.lPrice}€
			</div>
		</div>
		<div className={styles.status}>
			{props.lStatus}
		</div>
	</div>;
}
