"use client";
import BrowseCards from "@/app/components/BrowseCards";
import styles from './page.module.css';
import NavigationBar from "./components/NavigationBar";
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import React from "react";
import LoginPage from "./components/Login";

export default function Home () {

	return (
		<main>
			<div className={styles.outerDivStyle}>
				<NavigationBar></NavigationBar>
				<LoginPage />
				<div className={styles.innerDivStyle}>
					<BrowseCards></BrowseCards>
				</div>
			</div>
		</main>
	);
}
