import React from 'react';

// ============================================================================
// PROSPERNEST PRIVACY POLICY
// ============================================================================

export default function PrivacyPolicy({ theme, onBack }) {
  const currentTheme = theme || {
    bgMain: '#F5F6FA',
    bgCard: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    primary: '#4F46E5',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
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
    intro: {
      fontSize: '16px',
      lineHeight: 1.7,
      color: currentTheme.textSecondary,
      marginBottom: '32px',
    },
    faqSection: {
      background: currentTheme.bgMain,
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
    },
    faqTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: currentTheme.textPrimary,
      marginBottom: '16px',
    },
    faqItem: {
      marginBottom: '16px',
      paddingBottom: '16px',
      borderBottom: `1px solid ${currentTheme.borderLight}`,
    },
    faqQuestion: {
      fontSize: '15px',
      fontWeight: '600',
      color: currentTheme.textPrimary,
      marginBottom: '8px',
    },
    faqAnswer: {
      fontSize: '14px',
      color: currentTheme.textSecondary,
      lineHeight: 1.6,
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
          <h1 style={styles.title}>Privacy Policy</h1>
          <p style={styles.lastUpdated}>Last Updated: December 2, 2024</p>
        </div>

        <p style={styles.intro}>
          We at ProsperNest Technologies Inc. ("us," "we," "our" or "ProsperNest") respect your privacy, 
          and we are committed to protecting it by complying with this policy (our "Privacy Policy") and 
          being transparent about our privacy practices. In this policy, we explain how we collect, use, 
          process, and share your personal information when you communicate directly with us or within 
          our community, as well as when you access and use the websites, applications, and other offerings 
          we provide, including https://prospernest.io/, its related mobile applications and our API 
          (collectively, the "Services").
        </p>

        {/* Quick FAQ Section */}
        <div style={styles.faqSection}>
          <h2 style={styles.faqTitle}>🔒 Quick Privacy FAQs</h2>
          
          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>Can ProsperNest access my bank accounts?</p>
            <p style={styles.faqAnswer}>
              <strong>No.</strong> ProsperNest only has "read-only" access to your synced bank accounts 
              through our secure banking partners. We cannot move money or make transactions on your behalf.
            </p>
          </div>

          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>Does ProsperNest have access to my banking credentials?</p>
            <p style={styles.faqAnswer}>
              <strong>No.</strong> We never have access to your banking credentials. When you connect 
              your accounts, you authenticate directly with our secure banking partners (like Plaid), 
              who never share your login details with us.
            </p>
          </div>

          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>Does ProsperNest sell my data?</p>
            <p style={styles.faqAnswer}>
              <strong>Never.</strong> We do not (and will not!) sell any information about our customers 
              to others. Your financial data is yours, and we believe it should stay that way.
            </p>
          </div>

          <div style={{...styles.faqItem, borderBottom: 'none', marginBottom: 0, paddingBottom: 0}}>
            <p style={styles.faqQuestion}>Is my data secure?</p>
            <p style={styles.faqAnswer}>
              <strong>Yes.</strong> We use industry-standard security protocols including 256-bit 
              encryption across our entire platform. That, coupled with the fact we don't have access 
              to your bank credentials, means your information is safe and secure.
            </p>
          </div>
        </div>

        {/* Information We Collect */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
          <p style={styles.paragraph}>
            To provide our Services to you, we collect and receive the following information:
          </p>
          
          <p style={styles.paragraph}>
            <strong>Information About You (That You Provide Directly to Us):</strong>
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Account information such as your name, email address, and password</li>
            <li style={styles.listItem}>Profile information including your preferences and settings</li>
            <li style={styles.listItem}>Payment information when you subscribe to our paid services</li>
            <li style={styles.listItem}>Communications you send to us, including support requests and feedback</li>
          </ul>

          <p style={styles.paragraph}>
            <strong>Financial Information (From Your Connected Accounts):</strong>
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Transaction history including dates, amounts, and merchant names</li>
            <li style={styles.listItem}>Account balances and account type information</li>
            <li style={styles.listItem}>Category and description information for transactions</li>
          </ul>

          <p style={styles.paragraph}>
            <strong>Information Collected Automatically:</strong>
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Device information (browser type, operating system)</li>
            <li style={styles.listItem}>Log data (IP address, access times, pages viewed)</li>
            <li style={styles.listItem}>Usage information (features used, interactions with the Services)</li>
          </ul>
        </div>

        {/* How We Use Your Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
          <p style={styles.paragraph}>
            We use the information we collect to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Provide, maintain, and improve our Services</li>
            <li style={styles.listItem}>Process transactions and send related information</li>
            <li style={styles.listItem}>Send you technical notices, updates, and support messages</li>
            <li style={styles.listItem}>Respond to your comments, questions, and customer service requests</li>
            <li style={styles.listItem}>Analyze usage patterns to improve user experience</li>
            <li style={styles.listItem}>Detect, investigate, and prevent fraudulent or unauthorized activities</li>
            <li style={styles.listItem}>Comply with legal obligations</li>
          </ul>
        </div>

        {/* Information Sharing */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. How We Share Your Information</h2>
          <p style={styles.paragraph}>
            We may share your information only in the following circumstances:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>With Your Consent:</strong> We may share information when you explicitly authorize us to do so.
            </li>
            <li style={styles.listItem}>
              <strong>Service Providers:</strong> We work with trusted third-party service providers who 
              help us operate our Services (e.g., cloud hosting, payment processing, bank connections). 
              These providers are contractually obligated to protect your information.
            </li>
            <li style={styles.listItem}>
              <strong>Legal Requirements:</strong> We may disclose information if required by law or 
              in response to valid legal requests.
            </li>
            <li style={styles.listItem}>
              <strong>Business Transfers:</strong> If ProsperNest is involved in a merger, acquisition, 
              or sale of assets, your information may be transferred as part of that transaction.
            </li>
          </ul>
          <p style={styles.paragraph}>
            <strong style={styles.highlight}>We never sell your personal information to third parties for 
            advertising or marketing purposes.</strong>
          </p>
        </div>

        {/* Data Security */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Data Security</h2>
          <p style={styles.paragraph}>
            We take the security of your data seriously and implement industry-standard measures to 
            protect it:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>256-bit SSL/TLS encryption for all data in transit</li>
            <li style={styles.listItem}>AES-256 encryption for data at rest</li>
            <li style={styles.listItem}>Two-factor authentication (2FA) available for all accounts</li>
            <li style={styles.listItem}>Regular security audits and penetration testing</li>
            <li style={styles.listItem}>SOC 2 Type II compliant infrastructure</li>
          </ul>
        </div>

        {/* Cookies */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Cookies and Tracking Technologies</h2>
          <p style={styles.paragraph}>
            We use cookies and similar tracking technologies to collect information about your 
            browsing activities. Cookies are small data files stored on your device that help us 
            improve our Services and your experience.
          </p>
          <p style={styles.paragraph}>
            You can control cookies through your browser settings. However, disabling certain cookies 
            may limit your ability to use some features of our Services.
          </p>
        </div>

        {/* Data Retention */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Data Retention</h2>
          <p style={styles.paragraph}>
            We retain your information for as long as your account is active or as needed to provide 
            you Services. If you close your account, we will delete or anonymize your information 
            within 90 days, unless we are required to retain it for legal purposes.
          </p>
        </div>

        {/* Your Rights */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Your Rights and Choices</h2>
          <p style={styles.paragraph}>
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Access and receive a copy of your personal data</li>
            <li style={styles.listItem}>Correct inaccurate or incomplete information</li>
            <li style={styles.listItem}>Delete your personal information</li>
            <li style={styles.listItem}>Export your data in a portable format</li>
            <li style={styles.listItem}>Opt out of marketing communications</li>
          </ul>
          <p style={styles.paragraph}>
            To exercise any of these rights, please contact us at privacy@prospernest.io.
          </p>
        </div>

        {/* Children's Privacy */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Children's Privacy</h2>
          <p style={styles.paragraph}>
            Our Services are not intended for children under 18 years of age. We do not knowingly 
            collect personal information from children. If you believe we have collected information 
            from a child, please contact us immediately.
          </p>
        </div>

        {/* Changes to Policy */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Changes to This Privacy Policy</h2>
          <p style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes by posting the new Privacy Policy on this page and updating the "Last Updated" 
            date. We encourage you to review this Privacy Policy periodically.
          </p>
        </div>

        {/* Contact */}
        <div style={styles.contactBox}>
          <h3 style={styles.contactTitle}>📧 Contact Us</h3>
          <p style={styles.contactText}>
            If you have any questions about this Privacy Policy or our privacy practices, please 
            contact us at:<br /><br />
            <strong>ProsperNest Technologies Inc.</strong><br />
            Email: <a href="mailto:privacy@prospernest.io" style={styles.link}>privacy@prospernest.io</a><br />
            Website: <a href="https://prospernest.io" style={styles.link}>https://prospernest.io</a>
          </p>
        </div>
      </div>
    </div>
  );
}
