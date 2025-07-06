"use client";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { Button } from "@eventer/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className="text-3xl font-bold mt-6">Welcome to Eventer</h1>
        <p className="text-lg text-gray-600 mt-2">
          Your all-in-one event planning and ticketing platform.
        </p>

        <ol className="mt-6 text-left max-w-md">
          <li>📅 Create and manage events</li>
          <li>🎫 Sell tickets and check-in attendees</li>
          <li>📊 Track event performance and feedback</li>
        </ol>

        <div className={styles.ctas}>
          <Link href="/dashboard" className={styles.primary}>
            <Image
              className={styles.logo}
              src="/calendar.svg"
              alt="Dashboard icon"
              width={20}
              height={20}
            />
            Go to Dashboard
          </Link>

          <Link href="/docs" className={styles.secondary}>
            Read the docs
          </Link>
        </div>

        <Button appName="web" className={styles.secondary}>
          Try Demo Event
        </Button>
      </main>

      <footer className={styles.footer}>
        <Link
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/vercel.svg" alt="Vercel" width={16} height={16} />
          Deploy with Vercel
        </Link>
        <Link
          href="https://github.com/creatorsgarten/eventer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/github.svg" alt="GitHub" width={16} height={16} />
          Star us on GitHub →
        </Link>
      </footer>
    </div>
  );
}
