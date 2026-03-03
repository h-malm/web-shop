import React from "react";
import styles from "./../page.module.css";

export default function Label ( props ) {
	return <div className={styles.Label}>
		{props.lTitle}, {props.lPrice}€
		<br />
		{props.lDescription}
		<br />
		{props.lOwner}
		<br />
		Published: {props.lDateAdded}
		<br />
		{props.lStatus}
	</div>;
}
