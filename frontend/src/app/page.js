"use client";
import BrowseCards from "@/app/start/components/BrowseCards";
import styles from './page.module.css';
import NavigationBar from "./start/components/NavigationBar";
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function Home() {

	return (
		<main>
			<div className={ styles.outerDivStyle }>
				<NavigationBar></NavigationBar>
				<div className={ styles.innerDivStyle }>
					<BrowseCards></BrowseCards>
				</div>
			</div>
		</main>
	);
}
