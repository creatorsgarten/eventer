"use client";

import React, { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { Button } from "@eventer/ui/button";
import styles from "./page.module.css";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
// Types and Interfaces
interface ThemeImageProps extends Omit<ImageProps, "src"> {
  srcLight: string;
  srcDark: string;
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

interface ShowcaseItemProps {
  title: string;
  description: string;
  imagePath: string;
}

// Utility Components
const ThemeImage = ({ srcLight, srcDark, ...rest }: ThemeImageProps) => (
  <>
    <Image {...rest} src={srcLight} className="imgLight" />
    <Image {...rest} src={srcDark} className="imgDark" />
  </>
);

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className={styles.featureItem}>
    <div className={styles.featureIcon}>
      <Image src={icon} alt="" width={100} height={100} />
    </div>
    <h3 className={styles.featureHeading}>{title}</h3>
    <p className={styles.featureDesc}>{description}</p>
  </div>
);

// Page Sections
const HeroSection = () => {
  const [{ heroVisible, headerVisible, leftVisible, rightVisible }, setVisibility] = useState({
    heroVisible: false,
    headerVisible: false,
    leftVisible: false,
    rightVisible: false
  });

  const [floatValues, setFloatValues] = useState({ mobile: 0, timer: 0 });

  // Animate on mount
  useEffect(() => {
    const timings = [
      { state: 'heroVisible', delay: 100 },
      { state: 'headerVisible', delay: 200 },
      { state: 'leftVisible', delay: 400 },
      { state: 'rightVisible', delay: 600 }
    ];

    timings.forEach(({ state, delay }) => {
      setTimeout(() => setVisibility(prev => ({ ...prev, [state]: true })), delay);
    });
  }, []);

  // Floating animation hook
  useEffect(() => {
    const createFloatingAnimation = (max: number, interval: number) => {
      let dir = 1;
      let pos = 0;
      return setInterval(() => {
        pos += dir;
        if (pos > max) dir = -1;
        if (pos < 0) dir = 1;
        return pos;
      }, interval);
    };

    const mobileInterval = setInterval(() => {
      setFloatValues(prev => ({ ...prev, mobile: createFloatingAnimation(10, 40) }));
    });

    const timerInterval = setInterval(() => {
      setFloatValues(prev => ({ ...prev, timer: createFloatingAnimation(8, 50) }));
    });

    return () => {
      clearInterval(mobileInterval);
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <div className={styles.heroContainer}>
      {/* Background Pattern */}
      <div className={styles.container}>
        {/* Header */}
        <header
          className={`${styles.header} ${headerVisible ? styles.fadeInDown : styles.hidden}`}
        >
          {/* <ThemeImage
            className={styles.logo}
            srcLight="/assets/images/eventer-cover.png"
            srcDark="/assets/images/eventer-cover.png"
            alt="Eventer Logo"
            width={40}
            height={40}
            priority
          /> */}
          <h1 className={styles.logoText}>Eventer</h1>
        </header>

        <div className={styles.heroGrid}>
          {/* Left Content */}
          <div
            className={`${styles.leftContent} ${leftVisible ? styles.slideInLeft : styles.hidden}`}
          >
            <div className={styles.textContent}>
              <h2 className={styles.heroTitle}>
                รับจบทุกงานใน
                <br />
                แพลตฟอร์มเดียว
              </h2>
              <p className={styles.heroDescription}>
                จัดการทุกอีเวนต์ได้ครบ จบในที่เดียว
                <br />
                ลดความยุ่งยากจากการใช้หลายเครื่องมือด้วย Eventer
              </p>
            </div>

            <div
              className={styles.ctaButtonWrapper}
              tabIndex={0}
              style={{ transition: "transform 0.1s", outline: "none" }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onFocus={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onBlur={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Button className={styles.ctaButton} appName="web">
                ทดลองใช้เลย
              </Button>
            </div>
          </div>
          {/* Right Content - Hero Images */}
          <div
            className={
              rightVisible
                ? `${styles.rightContent} ${styles.popUpFromBottom}`
                : `${styles.rightContent} ${styles.hidden}`
            }
          >
            {/* Mobile App Interface Image */}
            <div
              className={styles.mobileInterface}
            >
              <Image
                src="/mainpic.svg"
                alt="Eventer Mobile App Interface"
                width={1920}
                height={1080}
                className={styles.mobileImage}
                priority
              />
            </div>

            {/* Desktop Timer Widget Image */}
            <div
              className={styles.timerWidget}
              style={{
                transform: `translateY(-${floatValues.timer}px)`,
                transition: "transform 0.2s",
              }}
            >
              {/* You can add timer widget image or content here */}
            </div>
          </div>
        </div>
      </div>
      <Image
        src="/Union.png"
        alt="Eventer Mobile App Interface"
        width={1920}
        height={1080}
        className={styles.waveSvg}
        priority
      />
    </div>
  );
};

const FeatureSection = () => {
  const features: FeatureCardProps[] = [
    {
      icon: "/calendar-feature.svg",
      title: "จัดการตารางเวลา ณ วันงาน",
      description: "ปรับเปลี่ยนตารางเวลาแบบเรียลไทม์\nและสามารถ sync กับ Staff ทุกคนได้ทันที"
    },
    {
      icon: "/star-feature.svg",
      title: "สร้างเทมเพลตสำหรับสปอนเซอร์",
      description: "ลดเวลาในการทำเอกสารเพื่อผู้สนับสนุน ผู้น่ารักของคุณให้ติดต่อได้ง่ายขึ้น"
    },
    {
      icon: "/staff-feature.svg",
      title: "สภาพพร้อมงานได้ทันที",
      description: "คลิกเดียวเท่านั้น! Staff และอาสาสมัครทุกคน สามารถเข้าถึงข้อมูลของทั้งอีเวนต์ของคุณในทันที"
    },
    {
      icon: "/resource-feature.svg",
      title: "บริหารข้อมูลทรัพยากร",
      description: "ห้องที่ใช้, อาหาร, ที่จอดรถ รายชื่อ Staff\nและบทบาททั้งหมด แบบมัดรวมในที่เดียว"
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.featuresTitle}>
        เราจะช่วยให้การจัดอีเวนต์สะดวกขึ้นได้อย่างไร
      </h2>
      <p className={styles.featuresSubtitle}>
        เราออกแบบโดยอิงพื้นฐานจาก Pain Point นักจัดอีเวนต์หลากๆ ที่
      </p>
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

const ShowcaseSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgKey, setImgKey] = useState(0);

  const showcaseItems: ShowcaseItemProps[] = [
    {
      title: "สร้างตารางอีเวนท์",
      description: "วางแผนกิจกรรมแต่ละวันได้อย่างชัดเจน\nพร้อมกำหนดเวลาและลำดับงานที่เป็นระบบ",
      imagePath: "/showcase1.svg",
    },
    {
      title: "แบ่งหน้าที่เป็นทีม",
      description: "มอบหมายงานให้แต่ละฝ่ายได้ชัดเจน ไม่ว่าจะเป็น\nContent, Support หรือ Organizer",
      imagePath: "/showcase2.svg",
    },
    {
      title: "ปรับแต่งได้ตามต้องการ",
      description: "สร้าง แก้ไข หรือลบงานได้อิสระ\nรองรับการทำงานที่ยืดหยุ่นและคล่องตัว",
      imagePath: "/showcase3.svg",
    },
  ];

  // Auto-advance showcase every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [showcaseItems.length]);

  // Change key to trigger animation on image change
  useEffect(() => {
    setImgKey(prev => prev + 1);
  }, [activeIndex]);

  return (
    <section className={styles.showcaseSection}>
      <h2 className={styles.showcaseTitle}>พวกเราทำอะไรได้บ้าง ?</h2>
      <div className={styles.showcaseRow}>
        {/* Left: List */}
        <div className={styles.showcaseList}>
          {showcaseItems.map((item, idx) => (
            <button
              key={item.title}
              className={`${styles.showcaseListItem} ${
                activeIndex === idx ? styles.showcaseListItemActive : ""
              }`}
              onClick={() => setActiveIndex(idx)}
              type="button"
            >
              <div className={styles.showcaseListBar} />
              <div>
                <h3 className={styles.showcaseListTitle}>{item.title}</h3>
                <p className={styles.showcaseListDesc}>
                  {item.description.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < item.description.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Image */}
        <div className={styles.showcaseImageWrapper} key={imgKey}>
          <Image
            src={showcaseItems[activeIndex].imagePath}
            alt={showcaseItems[activeIndex].title}
            width={400}
            height={400}
            className={styles.showcaseImage}
            priority
          />
        </div>
      </div>
    </section>
  );
}

const TestimonialSection: React.FC = () => {
  // Example logos, replace with your own logo paths
  const logos = [
    "/cuslogo/creatorsgarten.svg",
    "/cuslogo/cuee.png",
    "/cuslogo/ioic_black.png",
    "/cuslogo/thinc.png",
    "/cuslogo/esc.png",
    "/cuslogo/techsauce.png",
    "/cuslogo/eventpop.png",
    "/cuslogo/rabbitstart.png",
  ];

  // Duplicate logos for seamless infinite scroll effect
  const scrollingLogos = [...logos, ...logos];

  return (
    <section className={styles.testimonialSection}>
      <h2 className={styles.testimonialTitle}>ลูกค้าของเรา*</h2> 
      <div className={styles.testimonialScrollerWrapper}>
        <div className={styles.testimonialScroller}>
          {scrollingLogos.map((logo, idx) => (
            <div className={styles.testimonialLogoItem} key={idx}>
              <Image
                src={logo}
                alt={`Company logo ${idx % logos.length + 1}`}
                width={120}
                height={60}
                className={styles.testimonialLogoImg}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      <p className={styles.testimonialNote}>
        *หมายเหตุ: ลูกค้าในอนาคต (fraud จัด) </p>
    </section>
  );
};


const DemoSection: React.FC = () => {
  return (
    <section className={styles.demoSection}>
      <div className={styles.demoLeft}>
        <Image
          src="/demo-img.png"
          alt="Demo image"
          width={1200}
          height={1000}
          className={styles.demoImg}
          priority
        />
      </div>
      <div className={styles.demoRight}>
        <h2 className={styles.demoTryTitle}>
          บริหารเวลาอีเวนต์ได้แม่นยำ<br />ไม่หลุดไทม์ไลน์
        </h2>
        <p className={styles.demoTryDesc}>
          ช่วยให้ทีมของคุณทำงานราบรื่น ตรงเวลา และมั่นใจในทุกช่วงของอีเวนต์
        </p>
        <Link href="#" className={styles.demoTryButton}>
          ทดลองใช้เลย <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}




const EmailSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
  };

  return (
    <section className={styles.emailSection}>
      <div className={styles.emailleft}>
      <h3 className={styles.emailTitle}>
        สนับสนุนข่าวสารจากเรา
        <br />
        เพื่อไม่พลาดอัปเดต ฟีเจอร์ใหม่
      </h3>
      </div>
      <div className={styles.emailright}>
      <form onSubmit={handleSubmit} className={styles.emailForm}>
        <div className={styles.emailInputGroup}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.emailEmailInput}
            required
          />
          <button type="submit" className={styles.emailSubmitButton}>
            สมัครเลย   →
          </button>
        </div>
      </form>
      </div>
    </section>
  );
};

const FooterSection: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footercontainer}>
        <div className={styles.footerleft}>
          <h2 className={styles.footerlogo}>Eventer</h2>
          <p className={styles.footerdescription}>
            จัดการทุกอีเวนต์ได้ครบ จบในที่เดียว
            <br />
            ลดความยุ่งยากจากการใช้หลายอุปกรณ์ด้วย Eventer
          </p>
          <div className={styles.footersocialIcons}>
            <FaTwitter />
            <FaFacebookF />
            <FaInstagram />
          </div>
        </div>

        <div className={styles.footerright}>
          <div>
            <h4>Company</h4>
            <Link href="#">About us</Link>
            <Link href="#">Contact us</Link>
          </div>
          <div>
            <h4>Product</h4>
            <Link href="#">Features</Link>
            <Link href="#">News</Link>
            <Link href="#">Support</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms & Conditions</Link>
            <Link href="#">Return Policy</Link>
          </div>
        </div>
      </div>
      <div className={styles.footercopyRight}>
        © 2024 Copyright, All Right Reserved, Eventer
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className={styles.page}>
      <HeroSection />
      <FeatureSection />
      <ShowcaseSection />
      <DemoSection />
      <TestimonialSection />
      <EmailSection/>
      <FooterSection />
    </div>
  );
}