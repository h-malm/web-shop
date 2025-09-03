import Link from "next/link";
import styles from './../../page.module.css';

export default function NavigationBar() {
    return (
        <main>
            <div className={ styles.outerDivStyle }>
                <div className={ styles.mainHeader }>Web Shop</div>
                <div className={ styles.navBar }>
                    <div className={ styles.navItem }>
                        <Link className={ styles.links } href="/">WEB SHOP</Link>
                    </div>
                    <div className={ styles.navItem }>
                        <Link className={ styles.links } href="/login/">SIGN IN</Link>
                    </div>
                    <div className={ styles.navItem }>
                        <Link className={ styles.links } href="/signup/">SIGN UP</Link>
                    </div>
                    <div className={ styles.navItem }>
                        <Link className={ styles.links } href="/myitems/">MY ITEMS</Link>
                    </div>
                    <div className={ styles.navItem }>
                        <Link className={ styles.links } href="/account/">ACCOUNT</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
