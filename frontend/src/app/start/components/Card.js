import { Button } from "primereact/button";
import Label from "./Label";
import Square from "./Square";
import styles from './../../page.module.css';

export default function Card( props ) {
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
		<div className={ styles.cardStyle } onClick={ handleClick }>
			<Square sColor={ props.cColor } />
			<Label
				lColor={ props.cColor }
				lOwner={ props.cOwner }
				lPrice={ props.cPrice }
				lTitle={ props.cTitle }
				lDateAdded={ props.cDateAdded }
				lDescription={ props.cDescription }
				lStatus={ props.cStatus }
			/>
			<div className={ styles.pairOfButtons }>
				{ props.isEditable && (
					<Button
						icon="pi pi-pencil"
						onClick={ handleEdit }
						className="p-button saveButton"
					/>
				) }
				{ props.isDeletable && ( <Button
					severity="danger"
					icon="pi pi-trash"
					onClick={ handleDelete }
					className="p-button cancelButton"
				/>
				) }
			</div>
		</div>
	);
}
