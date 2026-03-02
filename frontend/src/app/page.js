"use client";
import BrowseCards from "@/app/components/BrowseCards";
import styles from './page.module.css';
import NavigationBar from "./components/NavigationBar";
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import React from "react";

export default function Home () {

	return (
		<main>
			<div className={styles.outerDivStyle}>
				<NavigationBar></NavigationBar>
				<div className={styles.innerDivStyle}>
					<BrowseCards></BrowseCards>
				</div>
			</div>
		</main>
	);
}
