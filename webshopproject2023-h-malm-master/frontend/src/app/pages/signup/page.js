"use client";
import { useState } from "react";
import { API_BASE } from "@/utils/api";
import NavigationBar from "./../../components/NavigationBar";
import styles from './../../page.module.css';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";

const RegisterPage = () => {
	const [info, setInfo] = useState( "" );

	const register = async ( { username, password, email } ) => {
		const res = await fetch( `${API_BASE}/register/`, {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify( { username, password, email } ),
		} );
		const data = await res.json();
		setInfo( JSON.stringify( data ) );
	}

	return (
		<div className={styles.outerDivStyle}>
			<NavigationBar></NavigationBar>
			<div>
				<div className={styles.subHeader}>
					Register a new User
				</div>
				<div className={styles.loginContainer}>
					<form
						onSubmit={( e ) => {
							e.preventDefault();
							const form = e.target;
							// @ts-ignore
							const formData = new FormData( form );
							// @ts-ignore
							const formJson = Object.fromEntries( formData.entries() );
							// @ts-ignore
							register( formJson )
						}}

					>
						<div>
							<InputText
								type="text"
								className="p-input"
								name="username"
								placeholder="Username"
							/>
						</div>
						<div>
							<InputText
								type="email"
								className="p-input"
								name="email"
								placeholder="Email"
							/>
						</div>
						<div>
							<InputText
								type="password"
								name="password"
								className="p-input"
								placeholder="Password"
							/>
						</div>
						<Button
							type="submit"
							className="p-button"
						>
							Register
						</Button>
					</form>
				</div>
			</div>
			<div>
				<p>{info}</p>
			</div>
		</div>
	);
};
export default RegisterPage;
