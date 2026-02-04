import React from 'react';
import { ArrowLeft, BookOpen, Shield, FileText, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSenseBanner } from '../components/AdSenseBanner';

const Layout = ({ title, icon, children }: { title: string, icon: any, children?: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-900 text-slate-300 p-4 md:p-8">
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
          <div className="p-3 bg-slate-700 rounded-xl text-white">
            {icon}
          </div>
          <h1 className="text-3xl font-display font-bold text-white">{title}</h1>
        </div>
        <div className="prose prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <Layout title="Privacy Policy" icon={<Shield />}>
    <h3>1. Information We Collect</h3>
    <p>We collect information you provide directly to us, such as when you create an account, update your profile, or request customer support. This includes your username, email address, and transaction history.</p>
    
    <h3>2. How We Use Your Information</h3>
    <p>We use the information we collect to provide, maintain, and improve our gaming services. We also use this data to detect and prevent fraud, specifically regarding multi-accounting and collusion.</p>

    <AdSenseBanner slot="1234567890" className="my-6" />

    <h3>3. Cookies and Advertising</h3>
    <p>We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. We also share information about your use of our site with our social media, advertising and analytics partners.</p>
  </Layout>
);

export const TermsOfService = () => (
  <Layout title="Terms of Service" icon={<FileText />}>
    <h3>1. Acceptance of Terms</h3>
    <p>By accessing NeonVegas, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.</p>
    
    <h3>2. Skill-Based Gaming</h3>
    <p>NeonVegas offers games of skill. Outcomes are determined primarily by the user's physical or mental skill, rather than chance. Users from states where skill-based gaming for money is prohibited are restricted to free-to-play modes.</p>

    <h3>3. User Conduct</h3>
    <p>Cheating, use of bots, or collusion is strictly prohibited. We employ IP tracking and behavioral analysis to detect fraud. Violators will be banned and funds forfeited.</p>
  </Layout>
);

export const AboutUs = () => (
  <Layout title="About NeonVegas" icon={<Info />}>
    <p className="lead text-lg text-white">NeonVegas is a premier destination for competitive skill-based gaming.</p>
    <p>Founded in 2024, our mission is to provide a fair, transparent, and exciting platform where players can compete in classic games like Ludo, Chess, and Card games using their strategic abilities.</p>
    
    <div className="my-8 p-6 bg-slate-900 rounded-xl border-l-4 border-purple-500">
      <h4 className="text-white font-bold mb-2">Our Commitment to Fair Play</h4>
      <p>We utilize advanced AI monitoring and strictly enforce our anti-collusion policies to ensure every game is decided by skill alone.</p>
    </div>
  </Layout>
);

export const BlogPost1 = () => (
  <Layout title="The Mathematics of Skill-based Gaming" icon={<BookOpen />}>
    <p>When we talk about "Skill Gaming," we aren't just using a buzzword. There is a mathematical distinction between games of chance (like a slot machine) and games of skill (like Poker or Fantasy Sports). In a skill game, the statistical variance can be overcome by optimal strategy over a large sample size.</p>
    
    <AdSenseBanner slot="9876543210" layout="in-article" />

    <h3>Understanding Variance</h3>
    <p>Even the best players lose. This is called variance. However, a skilled player understands that if they make the mathematically correct decision 100 times, they will come out ahead. In Ludo, for example, deciding which piece to move involves probability assessment: "What are the odds my opponent rolls a 6?"</p>

    <h3>The Law of Large Numbers</h3>
    <p>As you play more games, luck cancels out. This is why our platform focuses on retention and consistent play. Professional gamers don't rely on a single big win; they rely on a positive ROI (Return on Investment) over thousands of games.</p>
  </Layout>
);