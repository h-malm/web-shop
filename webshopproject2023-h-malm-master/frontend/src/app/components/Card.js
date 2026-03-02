import { Button } from "primereact/button";
import Label from "./Label";
import Square from "./Square";
import styles from './../page.module.css';
import React from "react";

export default function Card ( props ) {
	const handleClick = () => {
		if ( props.clickHandler ) {
			props.clickHandler();
		}
	};

	const handleEdit = () => {
		if ( props.editHandler ) {
			props.editHandler();
		}
	};

	const handleDelete = () => {
		if ( props.deleteHandler ) {
			props.deleteHandler();
		}
	};

	return (
		<div className={styles.cardStyle} onClick={handleClick}>
			<Square sColor={props.cColor} />
			<Label
				lColor={props.cColor}
				lOwner={props.cOwner}
				lPrice={props.cPrice}
				lTitle={props.cTitle}
				lDateAdded={props.cDateAdded}
				lDescription={props.cDescription}
				lStatus={props.cStatus}
			/>
			<div className={styles.pairOfButtons}>
				{!props.isEditable && (
					<Button
						label="Add to Cart"
						className="p-button saveButton"
					/>
				)}
				{props.isEditable && (
					<Button
						label='Edit'
						onClick={handleEdit}
						className="p-button saveButton"
					/>
				)}
				{props.isDeletable && (
					<Button
						severity="danger"
						label="Delete"
						onClick={handleDelete}
						className="p-button cancelButton"
					/>
				)}
			</div>
		</div>
	);
}
