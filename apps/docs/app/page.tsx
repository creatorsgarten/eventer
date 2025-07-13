import Image from "next/image";
import { Button } from "@eventer/component/button";
import styles from "./page.module.css";
import express from "express";
import dotenv from "dotenv";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/assets/images/eventer-cover.png"
          alt="Your Logo2"
          width={160}
          height={40}
          priority
        />
        <h1 className={styles.title}>Eventer</h1>
        <h1 className={styles.headline}>One click. One Event</h1>
        <p className={styles.subtext}>
          A modern platform to organize your events effortlessly
        </p>

        <div className={styles.ctas}>
          <a href="/get-started" className={styles.primaryButton}>
            Get Started
          </a>
          <a href="/docs" className={styles.secondaryButton}>
            Read Docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>© 2025 Eventer. All rights reserved.</p>
      </footer>
    </div>
  );
}

await fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
