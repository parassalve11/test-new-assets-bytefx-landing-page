import Image from "next/image";
import Link from "next/link";
import { BrandGlyph } from "@/components/ui/brand-icons";
import styles from "./MobileTrading.module.css";

function StoreBadge({ apple = false }) {
  return (
    <Link
      href={apple ? "/download#ios" : "/download#android"}
      className={styles.storeBadge}
      aria-label={apple ? "Download on the App Store" : "Get it on Google Play"}
    >
      {apple ? (
        <BrandGlyph name="apple" className={styles.storeIcon} />
      ) : (
        <svg className={styles.storeIcon} viewBox="0 0 40 44" aria-hidden="true">
          <path fill="#00d5ff" d="M2 1 24 22 2 43Z" />
          <path fill="#00ef76" d="M2 1 29 16 24 22Z" />
          <path fill="#ffce00" d="m29 16 9 5a1.2 1.2 0 0 1 0 2l-9 5-5-6Z" />
          <path fill="#ff3a62" d="M2 43 24 22l5 6Z" />
        </svg>
      )}
      <span>
        <span className={styles.storeEyebrow}>
          {apple ? "Download on the" : "GET IT ON"}
        </span>
        <span className={styles.storeName}>{apple ? "App Store" : "Google Play"}</span>
      </span>
    </Link>
  );
}

// The previous campaign remains available in MobileDownload.jsx.
export function MobileTrading() {
  return (
    <section id="download-app" aria-labelledby="mobile-trading-title" className={styles.section}>
      <div className={styles.stage}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Mobile trading</p>
          <h2 id="mobile-trading-title" className={styles.title}>
            Markets<br />
            In <span>Your Hand</span>
          </h2>
          <p className={styles.description}>
            Trade global markets, manage your accounts and stay connected — anytime,
            anywhere. A powerful trading experience designed for your mobile lifestyle.
          </p>
          <div className={styles.stores}>
            <StoreBadge apple />
            <StoreBadge />
          </div>
          <div className={styles.downloadDetails}>
            <Link href="/download" className={styles.qrLink} aria-label="Download the ByteFX mobile app">
              {/* Use the existing download QR so it stays crisp and scannable. */}
              <Image
                src="/assets/bytefx-app-qr.svg"
                alt="Scan to download the ByteFX app"
                width={168}
                height={168}
                className={styles.qr}
              />
              <span className={styles.qrTitle}>Scan to Download</span>
              <span className={styles.qrCaption}>Trade Anytime, Anywhere</span>
            </Link>
            <div className={styles.rating}>
              <Image
                src="/assets/mobile/rating.png"
                alt="4.9 out of 5. Platinum Rated by Traders."
                width={1448}
                height={1086}
                sizes="(max-width: 767px) 180px, (max-width: 1200px) 260px, 310px"
                className={styles.ratingImage}
              />
            </div>
          </div>
        </div>
        <div className={styles.phone}>
          <Image
            src="/assets/mobile/mobile.png"
            alt="A hand holding the ByteFX mobile app with a live trading chart"
            width={1086}
            height={1448}
            sizes="(max-width: 767px) 100vw, 54vw"
            className={styles.phoneImage}
          />
        </div>
      </div>
    </section>
  );
}
