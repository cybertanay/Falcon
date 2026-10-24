import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { LegalPage, Pending, Fact, H2, H3, List } from '../components/LegalPage';
import { LEGAL_FACTS } from '../data/legal';
import { COMPANY_INFO } from '../data/company';

/**
 * Privacy Policy.
 *
 * Written from the application's actual data flows (see the audit report, Oct 2026):
 * enquiry forms -> Express API -> Supabase (PostgreSQL) + Resend email; AI advisor -> Gemini;
 * fonts from Google Fonts; some product photos from Unsplash. If any of these change,
 * update this page in the same change.
 */
export const PrivacyPolicyPage: React.FC = () => {
  const privacyContact = LEGAL_FACTS.privacyEmail || COMPANY_INFO.email;

  return (
    <LegalPage icon={ShieldCheck} eyebrow="Privacy" title="Privacy Policy">
      <p>
        This policy explains what personal information Falcon International Traders collects through this
        website, why, who receives it, how long it is kept and what rights you have. The website is intended
        for business buyers; it does not sell goods online.
      </p>

      <H2 id="who-we-are">1. Who is responsible for your information</H2>
      <p>
        The business responsible for personal information collected on this website is{' '}
        <Fact value={LEGAL_FACTS.legalEntityName} missing="registered legal name of the business" />
        {LEGAL_FACTS.registrationNumber && <> (registration number {LEGAL_FACTS.registrationNumber})</>}
        {!LEGAL_FACTS.registrationNumber && <> (<Pending>company / business registration number</Pending>)</>}
        , trading as Falcon International Traders, with its registered address at{' '}
        <Fact value={LEGAL_FACTS.registeredAddress} missing="registered business address" />.
      </p>
      <p>
        For privacy questions or requests, contact{' '}
        {privacyContact ? (
          <a href={`mailto:${privacyContact}`} className="text-[#f2a900] underline">{privacyContact}</a>
        ) : (
          <Pending>privacy contact email address</Pending>
        )}
        .
      </p>

      <H2 id="what-we-collect">2. Information we collect</H2>
      <H3>Quotation and contact enquiries</H3>
      <p>When you submit the quotation form or the contact form, we collect:</p>
      <List>
        <li>Required: your full name, business email address, destination country or port, the product you are interested in and an estimated order quantity.</li>
        <li>Optional: your company name, WhatsApp or phone number, packaging preference and any message you write.</li>
        <li>An enquiry reference number and the date and time of your enquiry, which we create.</li>
      </List>
      <p>
        Please do not include sensitive personal information (for example health or financial details) in
        the message field. Our staff may later add internal notes and a status (for example "Contacted" or
        "Quotation Sent") to your enquiry record.
      </p>

      <H3>AI specification advisor</H3>
      <p>
        If you use the AI specification advisor, the product, destination market and requirement you type
        are sent to Google's Gemini AI service to generate a reply. We do not store these answers in our
        database. Please do not enter names, contact details or confidential commercial information into the
        advisor.
      </p>

      <H3>Technical information</H3>
      <List>
        <li>
          Like any website, our server receives your IP address and basic request information (such as the
          page requested and browser type) when you visit. Our application uses IP addresses temporarily in
          memory to limit repeated submissions and protect the site from abuse. It does not store your IP
          address with your enquiry.
        </li>
        <li>
          Our hosting provider may keep standard server logs. <Pending>hosting provider name and its log retention period</Pending>
        </li>
      </List>

      <H3>Staff accounts</H3>
      <p>
        For authorised Falcon staff who sign in to the internal dashboard, we store their email address, name,
        role, an encrypted (hashed) password and the time of their last sign-in. When staff change products,
        enquiries or settings, we keep an audit record of the staff email address, the action, the time and
        the IP address used. Audit records about enquiries contain the enquiry reference and workflow details,
        not the buyer's contact details.
      </p>

      <H2 id="why">3. Why we use your information</H2>
      <List>
        <li>To respond to your enquiry, prepare a quotation and discuss a possible order.</li>
        <li>To send you an automatic email confirming we received your enquiry, and to notify our export desk.</li>
        <li>To keep a record of enquiries and our dealings with business customers.</li>
        <li>To keep the website and our systems secure, prevent spam and investigate misuse.</li>
        <li>To meet legal, tax and export record-keeping obligations that apply to us.</li>
      </List>
      <p>
        We do not use enquiry information for marketing newsletters, and submitting an enquiry does not sign
        you up to receive marketing. If we introduce marketing emails in future, we will ask separately where
        the law requires it.
      </p>
      <p>
        Legal basis: <Pending>legal bases to be confirmed by legal counsel. Proposed: steps taken at your
        request before entering into a contract and our legitimate interests in responding to business
        enquiries and securing our systems, for visitors where UK or EU data protection law applies; and the
        applicable grounds under India's Digital Personal Data Protection Act, 2023</Pending>
      </p>

      <H2 id="recipients">4. Who receives your information</H2>
      <p>
        We do not sell your personal information. We share it only with service providers that help us run
        this website and respond to you, and only as needed for that purpose:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-[#154736]">
          <caption className="sr-only">Service providers that process personal information</caption>
          <thead className="bg-[#05140f] text-[#f2a900]">
            <tr>
              <th scope="col" className="p-2.5">Provider</th>
              <th scope="col" className="p-2.5">What they do</th>
              <th scope="col" className="p-2.5">Information involved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#154736]">
            <tr>
              <td className="p-2.5">Supabase</td>
              <td className="p-2.5">Database and file storage for enquiries, product data, staff accounts and audit records</td>
              <td className="p-2.5">Enquiry details, staff account details, audit records. Data location: <Pending>Supabase project region</Pending></td>
            </tr>
            <tr>
              <td className="p-2.5">Resend</td>
              <td className="p-2.5">Sends the confirmation email to you and the notification email to our export desk</td>
              <td className="p-2.5">Your name, email, phone (if given), company, country, product, quantity, packaging and message</td>
            </tr>
            <tr>
              <td className="p-2.5">Google (Gemini API)</td>
              <td className="p-2.5">Generates AI specification guidance</td>
              <td className="p-2.5">Only the three answers typed into the AI advisor</td>
            </tr>
            <tr>
              <td className="p-2.5">Google Fonts</td>
              <td className="p-2.5">Delivers the typefaces used on this site</td>
              <td className="p-2.5">Your IP address and browser information, sent by your browser when a page loads</td>
            </tr>
            <tr>
              <td className="p-2.5">Unsplash</td>
              <td className="p-2.5">Hosts some product photographs</td>
              <td className="p-2.5">Your IP address and browser information, sent by your browser when those images load</td>
            </tr>
            <tr>
              <td className="p-2.5"><Pending>hosting provider</Pending></td>
              <td className="p-2.5">Hosts the website and server</td>
              <td className="p-2.5">All information sent to the website</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        If you click a WhatsApp link, WhatsApp (Meta) handles that conversation under its own privacy policy.
        We may also disclose information where required by law, or to professional advisers, insurers or
        authorities where needed to establish or defend legal claims.
      </p>

      <H2 id="transfers">5. International transfers</H2>
      <p>
        Some of our service providers process information outside India and outside your country, including
        in the United States. <Pending>safeguards relied on for international transfers (for example
        contractual clauses in each provider's data processing terms), to be confirmed by legal counsel</Pending>
      </p>

      <H2 id="retention">6. How long we keep information</H2>
      <List>
        <li>
          Enquiries: kept while we deal with your enquiry and any resulting order, and afterwards for{' '}
          <Pending>enquiry retention period, e.g. a set number of years after last contact, and any longer period required for orders, tax or export records</Pending>.
        </li>
        <li>Staff accounts: kept while the staff member has access, then deleted or deactivated.</li>
        <li>Audit records: <Pending>audit log retention period</Pending>.</li>
        <li>AI advisor answers: not stored by us. Google's retention is set by its Gemini API terms.</li>
        <li>Emails: copies remain in our mailboxes and with Resend according to <Pending>mailbox and email-provider retention</Pending>.</li>
      </List>

      <H2 id="cookies">7. Cookies and similar technologies</H2>
      <p>
        Public pages of this website do not set cookies and do not use analytics, advertising or tracking
        technologies. The only cookie we use is a strictly necessary sign-in cookie
        (<code>falcon_admin_token</code>, expires after 8 hours) set when authorised staff sign in to the
        internal dashboard. Because it is strictly necessary, it does not require consent. If we add any
        optional technologies in future, we will ask for your consent before using them where the law
        requires it.
      </p>

      <H2 id="rights">8. Your rights</H2>
      <p>
        Depending on the law that applies to you, you may have the right to ask for access to your
        information, to correct it, to have it deleted, to restrict or object to how we use it, to receive a
        copy in a portable format, and to withdraw any consent you have given. You can also nominate another
        person to exercise your rights in the event of death or incapacity where Indian law provides for it.
      </p>
      <p>
        To make a request, contact us using the details in section 1. We may need to confirm your identity
        before acting. We will respond within the time required by applicable law. You also have the right to
        complain to a data protection authority, such as the Data Protection Board of India, the UK
        Information Commissioner's Office, or the supervisory authority in your EU country.{' '}
        <Pending>grievance officer / privacy contact details required under Indian law, if applicable</Pending>
      </p>

      <H2 id="security">9. Security</H2>
      <p>
        We use measures appropriate to a business website to protect information, including encrypted
        connections, access limited to authorised staff with role-based permissions, hashed passwords,
        input validation and rate limiting. No system is completely secure; if a personal data breach occurs
        we will act as required by applicable law.
      </p>

      <H2 id="children">10. Children</H2>
      <p>This website is for business buyers and is not directed at children.</p>

      <H2 id="changes">11. Changes to this policy</H2>
      <p>
        We may update this policy when our website or the way we handle information changes. The "last
        updated" date at the top shows when it was last revised. Please also read our{' '}
        <Link to="/terms" className="text-[#f2a900] underline">Terms &amp; Conditions</Link>.
      </p>
    </LegalPage>
  );
};
