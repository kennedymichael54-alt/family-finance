import React from 'react';

// ============================================================================
// PROSPERNEST TERMS OF SERVICE
// ============================================================================

export default function TermsOfService({ theme, onBack }) {
  const currentTheme = theme || {
    bgMain: '#F5F6FA',
    bgCard: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    primary: '#4F46E5',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    warning: '#F59E0B',
    danger: '#EF4444',
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: currentTheme.bgMain,
      padding: '40px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      background: currentTheme.bgCard,
      borderRadius: '16px',
      padding: '48px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: `1px solid ${currentTheme.borderLight}`,
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      background: currentTheme.bgMain,
      border: `1px solid ${currentTheme.border}`,
      borderRadius: '8px',
      color: currentTheme.textPrimary,
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      marginBottom: '24px',
    },
    header: {
      marginBottom: '32px',
      paddingBottom: '24px',
      borderBottom: `1px solid ${currentTheme.borderLight}`,
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: currentTheme.textPrimary,
      marginBottom: '8px',
    },
    lastUpdated: {
      fontSize: '14px',
      color: currentTheme.textMuted,
    },
    importantBox: {
      background: `${currentTheme.warning}15`,
      border: `1px solid ${currentTheme.warning}40`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '32px',
    },
    importantText: {
      fontSize: '14px',
      lineHeight: 1.7,
      color: currentTheme.textPrimary,
      margin: 0,
    },
    intro: {
      fontSize: '16px',
      lineHeight: 1.7,
      color: currentTheme.textSecondary,
      marginBottom: '32px',
    },
    section: {
      marginBottom: '32px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: currentTheme.textPrimary,
      marginBottom: '16px',
    },
    paragraph: {
      fontSize: '15px',
      lineHeight: 1.7,
      color: currentTheme.textSecondary,
      marginBottom: '16px',
    },
    list: {
      paddingLeft: '24px',
      marginBottom: '16px',
    },
    listItem: {
      fontSize: '15px',
      lineHeight: 1.7,
      color: currentTheme.textSecondary,
      marginBottom: '8px',
    },
    highlight: {
      color: currentTheme.primary,
      fontWeight: '500',
    },
    warningText: {
      color: currentTheme.danger,
      fontWeight: '500',
    },
    capsSection: {
      background: currentTheme.bgMain,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      fontSize: '13px',
      lineHeight: 1.6,
      color: currentTheme.textSecondary,
    },
    contactBox: {
      background: `${currentTheme.primary}10`,
      border: `1px solid ${currentTheme.primary}30`,
      borderRadius: '12px',
      padding: '20px',
      marginTop: '32px',
    },
    contactTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: currentTheme.textPrimary,
      marginBottom: '8px',
    },
    contactText: {
      fontSize: '14px',
      color: currentTheme.textSecondary,
    },
    link: {
      color: currentTheme.primary,
      textDecoration: 'none',
    },
    tableOfContents: {
      background: currentTheme.bgMain,
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
    },
    tocTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: currentTheme.textPrimary,
      marginBottom: '12px',
    },
    tocList: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    tocItem: {
      fontSize: '14px',
      color: currentTheme.primary,
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {onBack && (
          <button style={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        )}

        <div style={styles.header}>
          <h1 style={styles.title}>Terms of Service</h1>
          <p style={styles.lastUpdated}>Last Updated: December 2, 2024</p>
        </div>

        {/* Important Notice */}
        <div style={styles.importantBox}>
          <p style={styles.importantText}>
            <strong>⚠️ IMPORTANT:</strong> BY USING THE SERVICES OR BY CLICKING TO ACCEPT THESE TERMS, 
            YOU ACCEPT AND AGREE TO BE BOUND AND COMPLY WITH THESE TERMS AND CONDITIONS AND ALL OTHER 
            TERMS AND POLICIES INCORPORATED HEREIN BY REFERENCE. IF YOU DO NOT AGREE TO THESE TERMS 
            AND CONDITIONS, YOU MUST NOT ACCESS, USE OR MAKE ANY PURCHASES THROUGH THE SERVICES.
          </p>
        </div>

        <p style={styles.intro}>
          These terms of service ("Terms" or "Agreement") are entered into by and between you and 
          ProsperNest Technologies Inc. ("we," "us," or the "Company"). These Terms grant you access 
          to, offer and govern your use of the website, applications, and other offerings we provide, 
          including https://prospernest.io/ and its related web and mobile applications (our "Services").
        </p>

        {/* Table of Contents */}
        <div style={styles.tableOfContents}>
          <h3 style={styles.tocTitle}>📋 Table of Contents</h3>
          <ul style={styles.tocList}>
            <li style={styles.tocItem}>1. Eligibility</li>
            <li style={styles.tocItem}>2. Account Registration</li>
            <li style={styles.tocItem}>3. Our Services</li>
            <li style={styles.tocItem}>4. Financial Data Access</li>
            <li style={styles.tocItem}>5. Subscription & Billing</li>
            <li style={styles.tocItem}>6. User Conduct</li>
            <li style={styles.tocItem}>7. Intellectual Property</li>
            <li style={styles.tocItem}>8. Third-Party Services</li>
            <li style={styles.tocItem}>9. Disclaimers</li>
            <li style={styles.tocItem}>10. Limitation of Liability</li>
            <li style={styles.tocItem}>11. Indemnification</li>
            <li style={styles.tocItem}>12. Termination</li>
            <li style={styles.tocItem}>13. Governing Law</li>
            <li style={styles.tocItem}>14. Contact Information</li>
          </ul>
        </div>

        {/* 1. Eligibility */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Eligibility</h2>
          <p style={styles.paragraph}>
            You may not order or obtain products or services from the Services if you:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Do not agree to these Terms</li>
            <li style={styles.listItem}>Are not at least 18 years of age</li>
            <li style={styles.listItem}>Are prohibited from accessing or using the Services under applicable law</li>
          </ul>
          <p style={styles.paragraph}>
            By using our Services, you represent and warrant that you meet all eligibility requirements.
          </p>
        </div>

        {/* 2. Account Registration */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Account Registration</h2>
          <p style={styles.paragraph}>
            To access certain features of our Services, you must register for an account. When you 
            register, you agree to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Provide accurate, current, and complete information</li>
            <li style={styles.listItem}>Maintain and promptly update your account information</li>
            <li style={styles.listItem}>Keep your password secure and confidential</li>
            <li style={styles.listItem}>Accept responsibility for all activities under your account</li>
            <li style={styles.listItem}>Notify us immediately of any unauthorized access</li>
          </ul>
          <p style={styles.paragraph}>
            We reserve the right to suspend or terminate accounts that violate these Terms or that 
            we believe are being used for fraudulent purposes.
          </p>
        </div>

        {/* 3. Our Services */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Our Services</h2>
          <p style={styles.paragraph}>
            ProsperNest provides personal finance management tools that allow you to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Track personal and business income and expenses</li>
            <li style={styles.listItem}>Connect and sync bank accounts (read-only access)</li>
            <li style={styles.listItem}>Create and manage budgets</li>
            <li style={styles.listItem}>Set and track financial goals</li>
            <li style={styles.listItem}>Generate financial reports and insights</li>
            <li style={styles.listItem}>Manage bills and payment reminders</li>
          </ul>
          <p style={styles.paragraph}>
            While we strive to offer continuous access to our Services, they may be unavailable from 
            time to time for maintenance or other reasons. We will not be liable if your access or 
            use of our Services is interrupted. We reserve the right to change, modify, or discontinue 
            any feature of our Services at our sole discretion.
          </p>
        </div>

        {/* 4. Financial Data Access */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Financial Data Access</h2>
          <p style={styles.paragraph}>
            When you use our Services to import information from financial institutions, you agree that:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              We may collect this information from our service providers (like Plaid) who deliver it to us
            </li>
            <li style={styles.listItem}>
              We may use this information for the purpose of delivering our Services to you and in 
              compliance with our Privacy Policy
            </li>
            <li style={styles.listItem}>
              You will abide by those service providers' terms in addition to our Terms
            </li>
          </ul>
          <p style={styles.paragraph}>
            <strong>Important:</strong> ProsperNest only has read-only access to your financial accounts. 
            We cannot initiate transactions, transfers, or make any changes to your accounts.
          </p>
        </div>

        {/* 5. Subscription & Billing */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Subscription & Billing</h2>
          <p style={styles.paragraph}>
            <strong>Free Trial:</strong> We may offer a free trial period for new users. At the end of 
            your trial, you will need to subscribe to continue using premium features.
          </p>
          <p style={styles.paragraph}>
            <strong>Subscription Plans:</strong> We offer various subscription plans with different 
            features and pricing. Current pricing is available on our website.
          </p>
          <p style={styles.paragraph}>
            <strong>Billing:</strong> Subscriptions are billed in advance on a recurring basis 
            (monthly or annually, depending on your plan). You authorize us to charge your payment 
            method for all fees incurred.
          </p>
          <p style={styles.paragraph}>
            <strong>Cancellation:</strong> You may cancel your subscription at any time. Upon 
            cancellation, you will retain access until the end of your current billing period. 
            We do not provide refunds for partial billing periods.
          </p>
          <p style={styles.paragraph}>
            We may cancel or suspend your subscription if:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>You fail to pay applicable fees in a timely manner</li>
            <li style={styles.listItem}>You violate these Terms</li>
          </ul>
          <p style={styles.paragraph}>
            If you have billing issues, please contact us at <a href="mailto:billing@prospernest.io" style={styles.link}>billing@prospernest.io</a>.
          </p>
        </div>

        {/* 6. User Conduct */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6. User Conduct</h2>
          <p style={styles.paragraph}>
            You agree not to use our Services to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Violate any applicable laws, regulations, or third-party rights</li>
            <li style={styles.listItem}>Upload or transmit viruses, malware, or other harmful code</li>
            <li style={styles.listItem}>Attempt to gain unauthorized access to our systems</li>
            <li style={styles.listItem}>Interfere with or disrupt the Services</li>
            <li style={styles.listItem}>Use automated means to access the Services without permission</li>
            <li style={styles.listItem}>Impersonate others or provide false information</li>
            <li style={styles.listItem}>Use the Services for any illegal or fraudulent purpose</li>
          </ul>
          <p style={styles.paragraph}>
            We reserve the right to take any action we believe is necessary to protect ProsperNest, 
            our users, or anyone else who may be adversely affected by your conduct.
          </p>
        </div>

        {/* 7. Intellectual Property */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Intellectual Property</h2>
          <p style={styles.paragraph}>
            The Services, including all content, features, and functionality (including but not limited 
            to all information, software, text, displays, images, video, and audio, and the design, 
            selection, and arrangement thereof), are owned by ProsperNest, its licensors, or other 
            providers of such material and are protected by copyright, trademark, patent, trade secret, 
            and other intellectual property laws.
          </p>
          <p style={styles.paragraph}>
            You may not copy, modify, distribute, sell, or lease any part of our Services without our 
            prior written consent. The ProsperNest name, logo, and all related names, logos, product 
            and service names, designs, and slogans are trademarks of ProsperNest or its affiliates.
          </p>
        </div>

        {/* 8. Third-Party Services */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Third-Party Services</h2>
          <p style={styles.paragraph}>
            Our Services may contain links to or integrate with third-party websites, services, or 
            applications (such as bank connection services, payment processors, etc.). We are not 
            responsible for the content, terms, or practices of any third-party services.
          </p>
          <p style={styles.paragraph}>
            Your use of third-party services is at your own risk and subject to those third parties' 
            terms and privacy policies.
          </p>
        </div>

        {/* 9. Disclaimers */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Disclaimers</h2>
          <div style={styles.capsSection}>
            <p style={{margin: 0}}>
              THE SERVICES, ITS CONTENT, AND ANY SERVICES OR ITEMS FOUND OR ATTAINED THROUGH THE 
              SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES 
              OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED INCLUDING, BUT NOT LIMITED TO, 
              THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR 
              NON-INFRINGEMENT.
            </p>
          </div>
          <p style={styles.paragraph}>
            <strong>Not Financial Advice:</strong> ProsperNest provides tools for tracking and 
            organizing your finances. We do not provide financial, investment, tax, or legal advice. 
            The information provided through our Services is for informational purposes only and 
            should not be relied upon for making financial decisions. Consult with qualified 
            professionals for financial advice.
          </p>
          <p style={styles.paragraph}>
            <strong>Data Accuracy:</strong> While we strive to provide accurate information, we 
            cannot guarantee the accuracy, completeness, or timeliness of data synced from third-party 
            financial institutions.
          </p>
        </div>

        {/* 10. Limitation of Liability */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Limitation of Liability</h2>
          <div style={styles.capsSection}>
            <p style={{margin: 0}}>
              TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL PROSPERNEST, ITS AFFILIATES, 
              DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, 
              LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR 
              ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICES.
            </p>
          </div>
          <p style={styles.paragraph}>
            Our total liability for any claims arising from or related to these Terms or your use of 
            the Services shall not exceed the amount you paid to us in the twelve (12) months preceding 
            the claim.
          </p>
        </div>

        {/* 11. Indemnification */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>11. Indemnification</h2>
          <p style={styles.paragraph}>
            You agree to indemnify, defend, and hold harmless ProsperNest and its directors, officers, 
            employees, and agents from and against any and all claims, damages, obligations, losses, 
            liabilities, costs, and expenses arising from:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Your use of the Services</li>
            <li style={styles.listItem}>Your violation of these Terms</li>
            <li style={styles.listItem}>Your violation of any third-party rights</li>
            <li style={styles.listItem}>Any content you submit or share through the Services</li>
          </ul>
        </div>

        {/* 12. Termination */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>12. Termination</h2>
          <p style={styles.paragraph}>
            We may terminate or suspend your account and access to the Services at any time, with or 
            without cause, and with or without notice. Upon termination:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Your right to use the Services will immediately cease</li>
            <li style={styles.listItem}>We may delete your account and data in accordance with our Privacy Policy</li>
            <li style={styles.listItem}>Any provisions of these Terms that by their nature should survive will survive</li>
          </ul>
          <p style={styles.paragraph}>
            You may terminate your account at any time by contacting us or through your account settings.
          </p>
        </div>

        {/* 13. Governing Law */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>13. Governing Law</h2>
          <p style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of the State of 
            Delaware, United States, without regard to its conflict of law provisions. Any disputes 
            arising from or relating to these Terms or the Services shall be resolved in the state or 
            federal courts located in Delaware.
          </p>
          <p style={styles.paragraph}>
            The Services are intended for use in the United States. If you access the Services from 
            outside the United States, you do so at your own risk and are responsible for compliance 
            with local laws.
          </p>
        </div>

        {/* 14. Changes to Terms */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>14. Changes to These Terms</h2>
          <p style={styles.paragraph}>
            We may update these Terms from time to time. We will notify you of any material changes 
            by posting the new Terms on our website and updating the "Last Updated" date. Your 
            continued use of the Services after such changes constitutes your acceptance of the 
            new Terms.
          </p>
        </div>

        {/* Contact */}
        <div style={styles.contactBox}>
          <h3 style={styles.contactTitle}>📧 Contact Us</h3>
          <p style={styles.contactText}>
            If you have any questions about these Terms of Service, please contact us at:<br /><br />
            <strong>ProsperNest Technologies Inc.</strong><br />
            Email: <a href="mailto:legal@prospernest.io" style={styles.link}>legal@prospernest.io</a><br />
            Support: <a href="mailto:support@prospernest.io" style={styles.link}>support@prospernest.io</a><br />
            Website: <a href="https://prospernest.io" style={styles.link}>https://prospernest.io</a>
          </p>
        </div>
      </div>
    </div>
  );
}
