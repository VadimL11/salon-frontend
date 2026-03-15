import Link from 'next/link';
import React from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>SALON</div>
      <div className={styles.navLinks}>
        <Link href="/" className={styles.navLink}>Home</Link>
        <Link href="/clients" className={styles.navLink}>Clients</Link>
        <Link href="/admin" className={styles.navLink}>Admin</Link>
      </div>
      <Link href="/booking" className={styles.cta}>Book Now</Link>
    </nav>
  );
}
