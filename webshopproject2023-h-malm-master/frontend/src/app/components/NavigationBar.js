import Link from "next/link";
import styles from './../page.module.css';
import React from "react";

export default function NavigationBar () {
    return (
        <div className={styles.navContainer}>
            <div className={styles.mainHeader}>The Green Thumbelinas</div>
            <div className={styles.navBar}>
                <div className={styles.navItem} >
                    <Link className={styles.links} href="/">Homepage</Link>
                </div>
                <div className={styles.navItem}>
                    <Link className={styles.links} href="/pages/signup/">Register</Link>
                </div>
                <div className={styles.navItem}>
                    <Link className={styles.links} href="/pages/myitems/">My items</Link>
                </div>
                <div className={styles.navItem}>
                    <Link className={styles.links} href="/pages/account/">Account</Link>
                </div>
            </div>
        </div>
    );
}
