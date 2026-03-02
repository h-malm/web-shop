import Link from "next/link";
import styles from './../page.module.css';
import React from "react";

export default function NavigationBar () {
    return (
        <>
            <div className={styles.mainHeader}>Web Shop</div>
            <div className={styles.navBar}>
                <div className={styles.navItem}>
                    <Link className={styles.links} href="/">HOME PAGE</Link>
                </div>
                <div className={styles.navItem}>
                    <Link className={styles.links} href="/pages/login/">SIGN IN</Link>
                </div>
                <div className={styles.navItem}>
                    <Link className={styles.links} href="/pages/signup/">REGISTER</Link>
                </div>
                <div className={styles.navItem}>
                    <Link className={styles.links} href="/pages/myitems/">MY ITEMS</Link>
                </div>
                <div className={styles.navItem}>
                    <Link className={styles.links} href="/pages/account/">ACCOUNT</Link>
                </div>
            </div>
        </>
    );
}
