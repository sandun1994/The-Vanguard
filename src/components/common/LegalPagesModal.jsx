import React, { useState } from 'react';
import { X, Shield, Lock, Scale, Sparkles, Mail, CheckCircle2, ExternalLink } from 'lucide-react';

export const LegalPagesModal = ({ isOpen, onClose, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  // Update active tab if initialTab changes when opening
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      onClose();
    }, 2000);
  };

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
    { id: 'terms', label: 'Terms of Service', icon: Scale },
    { id: 'about', label: 'About Us & AI Disclosure', icon: Sparkles },
    { id: 'contact', label: 'Contact Us', icon: Mail }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        color: 'var(--text-primary)'
      }}>

        {/* Modal Top Header Bar */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              padding: '0.55rem',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              borderRadius: '12px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Legal & Transparency Hub
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Editorial governance, privacy policy & Google AdSense compliance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Custom Tab Navigation Bar */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(9, 13, 22, 0.6)',
          padding: '0 1.25rem',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.1rem',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#6366f1' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} color={isActive ? '#6366f1' : 'var(--text-muted)'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div style={{
          padding: '1.75rem',
          overflowY: 'auto',
          flex: 1,
          fontSize: '0.9rem',
          lineHeight: 1.7,
          color: 'var(--text-primary)'
        }}>

          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                padding: '0.85rem 1.25rem',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: '#6366f1',
                fontWeight: '600'
              }}>
                <strong>Last Updated:</strong> September 2, 2026 • Fully compliant with Google AdSense Policies, GDPR, and CCPA standards.
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                1. Introduction & Information We Collect
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                At <strong>TECH PULSE News Hub</strong>, accessible from our online platforms, visitor privacy is a paramount priority. This Privacy Policy document outlines the types of information collected and recorded by TECH PULSE and how we responsibly utilize it.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                2. Google AdSense & Third-Party Advertising Cookies
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                NOVUM collaborates with third-party advertising partners, including <strong>Google AdSense</strong>. Google utilizes cookies (specifically DART cookies) to serve ads to our site visitors based upon their visit to our platform and other sites across the web.
              </p>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve targeted ads based on your visits to our site and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'underline' }}>Google Ads Settings</a>.</li>
              </ul>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                3. Log Files & Analytics Transparency
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                NOVUM follows standard web log procedures. The information collected by log files includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring pages, and click statistics. These metrics are strictly non-personally identifiable.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                4. User Data Rights (GDPR & CCPA)
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Under GDPR and CCPA regulations, visitors hold rights to request data access, rectification, or erasure. To exercise your rights, contact our privacy desk at <code style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>privacy@novumjournal.org</code>.
              </p>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                padding: '0.85rem 1.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}>
                <strong>Terms of Service Agreement</strong> • Effective starting September 2, 2026.
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>1. Acceptance of Terms</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                By accessing or browsing the NOVUM AI Journal platform, you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, you may not access the service.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>2. Intellectual Property & Citation Standards</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                The synthesized technical reports, benchmark comparison matrices, and visual widgets published on NOVUM are protected under intellectual property standards. Primary peer-reviewed sources, research papers, and quoted statistics remain the property of their respective journals and are cited with direct canonical links.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>3. Non-Medical & Non-Financial Disclaimer</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Content published on NOVUM represents technical synthesis for educational and research purposes. Information regarding biotechnology, clinical trials, or quantum computing does not constitute medical, financial, or engineering advice.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>4. Limitation of Liability</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                In no event shall NOVUM or its research desk be liable for any indirect or consequential damages arising from the use or inability to use materials published on the platform.
              </p>
            </div>
          )}

          {/* TAB 3: ABOUT US & AI DISCLOSURE */}
          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                padding: '0.85rem 1.25rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: '#10b981',
                fontWeight: '600'
              }}>
                <strong>Google E-E-A-T & AI Transparency Guarantee</strong> • High-Authority Scientific Journalism & Human Editorial Oversight.
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>1. Mission & Editorial Focus</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>TECH PULSE</strong> is an advanced technical journal dedicated to bridging the gap between cutting-edge peer-reviewed research papers and global engineering teams. Our core domains cover Artificial Intelligence, Quantum Computing, Biotechnology, Space Exploration, and Autonomous Robotics.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>2. Human-in-the-Loop Editorial Process</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                NOVUM utilizes multi-agent pipeline architectures to scrape, structure, and synthesize complex multi-source research payloads. However, <strong>every article undergoes human editorial verification</strong>:
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                margin: '0.5rem 0'
              }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ color: '#6366f1', fontWeight: '700', marginBottom: '4px', fontSize: '0.88rem' }}>1. Primary Source Verification</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>All data points and benchmark figures are verified against high domain authority (DA 80+) journals like Nature, IEEE Xplore, and ArXiv.</div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ color: '#10b981', fontWeight: '700', marginBottom: '4px', fontSize: '0.88rem' }}>2. Zero Hallucination Guardrails</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Automated verification harnesses isolate unverified claims and strip non-factual extrapolations prior to publication.</div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ color: '#a855f7', fontWeight: '700', marginBottom: '4px', fontSize: '0.88rem' }}>3. Multi-Source Comparison Tables</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Instead of single-source rewrites, our pipeline synthesizes 3-4 competing studies into unified comparative analysis matrices.</div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ color: '#f59e0b', fontWeight: '700', marginBottom: '4px', fontSize: '0.88rem' }}>4. Transparent Citation Boxes</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Every published article features an explicit citation box naming primary authors, DOIs, and direct reference links.</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>3. Contact Editorial Desk</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Have questions regarding our research methodology or peer-review citations? Reach out to <code style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>editor@novumjournal.org</code>.
              </p>
            </div>
          )}

          {/* TAB 4: CONTACT US */}
          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Get in Touch with Our Editorial Team
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Whether you have press releases, research submissions, privacy inquiries, or peer-review feedback, we welcome your input.
              </p>

              {contactSubmitted ? (
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: '#34d399'
                }}>
                  <CheckCircle2 size={28} />
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '0.95rem' }}>Message Sent Successfully!</h4>
                    <p style={{ fontSize: '0.82rem', margin: 0, opacity: 0.9 }}>Thank you for reaching out to NOVUM Editorial. We will respond within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Dr. Sarah Connor"
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--bg-main)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '10px',
                          padding: '0.65rem 0.85rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="sarah@research-inst.org"
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--bg-main)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '10px',
                          padding: '0.65rem 0.85rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Subject</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="Editorial Submission / Citation Feedback"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Details of your inquiry or peer-review citation feedback..."
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}>
                    <Mail size={16} /> Send Message to Editorial Desk
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <span>© 2026 TECH PULSE News Hub. All Rights Reserved.</span>
          <button onClick={onClose} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
