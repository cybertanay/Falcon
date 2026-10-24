import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { LegalPage, Pending, Fact, H2, List } from '../components/LegalPage';
import { LEGAL_FACTS } from '../data/legal';
import { COMPANY_INFO } from '../data/company';

/**
 * Website Terms & Conditions for a B2B export enquiry website.
 * These terms govern use of the website only. Sales are governed by the written
 * quotation and sales contract agreed for each order (see OrderPolicyPage).
 */
export const TermsConditionsPage: React.FC = () => (
  <LegalPage icon={FileText} eyebrow="Website Terms" title="Terms & Conditions">
    <p>
      These terms apply to your use of this website. Please read them with our{' '}
      <Link to="/privacy" className="text-[#f2a900] underline">Privacy Policy</Link> and our{' '}
      <Link to="/order-policy" className="text-[#f2a900] underline">Order, Cancellation &amp; Claims Policy</Link>.
    </p>

    <H2 id="who-we-are">1. About us</H2>
    <p>
      This website is operated by <Fact value={LEGAL_FACTS.legalEntityName} missing="registered legal name of the business" />,
      trading as Falcon International Traders, registered address{' '}
      <Fact value={LEGAL_FACTS.registeredAddress} missing="registered business address" />.
      {' '}Contact: {COMPANY_INFO.email ? <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#f2a900] underline">{COMPANY_INFO.email}</a> : <Pending>business contact email</Pending>}.
    </p>

    <H2 id="purpose">2. Purpose of the website</H2>
    <p>
      The website provides general information about the agricultural commodities and spices we may supply
      and lets business buyers send enquiries. It is intended for businesses, not consumers. Nothing on the
      website is an offer to sell that you can accept by submitting a form.
    </p>

    <H2 id="enquiries">3. Enquiries, quotations and orders</H2>
    <List>
      <li>Submitting an enquiry form does not create an order or a contract, and does not oblige either of us to trade.</li>
      <li>A quotation is an invitation to agree terms. It is valid only for the period and on the terms stated in it, and is subject to availability.</li>
      <li>An order is accepted only when both parties confirm it in writing, for example by a signed sales contract or our written order confirmation (such as a proforma invoice accepted by both sides).</li>
      <li>The agreed sales contract governs price, specification, quantity, packaging, Incoterms, delivery, payment, inspection, documents, claims and liability. If anything on this website differs from the contract, the contract prevails.</li>
    </List>

    <H2 id="product-info">4. Product information and specifications</H2>
    <p>
      Product descriptions, specification tables, downloadable specification sheets and images on this website
      are indicative only. Agricultural products vary naturally by crop, season and origin. Images may be
      illustrative and may not show the actual goods supplied. Binding specifications, test methods and
      tolerances are only those written into the agreed sales contract.
    </p>
    <p>
      Guidance produced by the AI specification advisor is generated automatically, may be inaccurate, and is
      not a specification, quotation or advice you should rely on.
    </p>

    <H2 id="prices">5. Prices, minimum quantities and packaging</H2>
    <p>
      The website does not publish prices. Any minimum order quantities, sample sizes and packaging formats
      shown are indicative and are confirmed in each quotation.
    </p>

    <H2 id="compliance">6. Import requirements and certificates</H2>
    <p>
      The buyer is responsible for confirming that goods, labels and documents meet the import, food-safety and
      labelling requirements of the destination country, and for any import licences, permits, duties and
      taxes, unless the sales contract says otherwise. Certificates, test reports and treatments are provided
      only where agreed in the sales contract or required by law. Nothing on this website is a guarantee that
      goods will be approved for import, meet a particular regulation, or arrive by a particular date.
    </p>

    <H2 id="use">7. Permitted use of the website</H2>
    <List>
      <li>You may view and print pages for your own business purposes.</li>
      <li>You must not misuse the website, including by attempting unauthorised access, introducing malicious code, submitting false or automated enquiries, or scraping content at scale.</li>
      <li>The staff dashboard is for authorised Falcon personnel only.</li>
    </List>

    <H2 id="ip">8. Intellectual property</H2>
    <p>
      The website content, design and Falcon name and logo belong to us or our licensors. Third-party
      materials are used under their own licences. You may not copy or reuse website content for commercial
      purposes without our written permission.
    </p>

    <H2 id="availability">9. Availability and third-party services</H2>
    <p>
      We aim to keep the website available but do not promise it will be uninterrupted or error-free. The
      website relies on third-party services (such as hosting, database, email and AI providers) and links to
      third-party sites such as WhatsApp, which we do not control and for which we are not responsible.
    </p>

    <H2 id="liability">10. Liability</H2>
    <p>
      The website and its information are provided for general information. To the extent permitted by law, we
      are not liable for losses arising from reliance on website content rather than on an agreed sales
      contract. Nothing in these terms excludes or limits liability that cannot lawfully be excluded or limited.{' '}
      <Pending>liability wording to be settled by legal counsel</Pending>
    </p>

    <H2 id="law">11. Governing law and disputes</H2>
    <p>
      <Pending>governing law and dispute resolution for these website terms, to be decided by management and
      legal counsel. Governing law, jurisdiction or arbitration for sales are set in each sales contract</Pending>
    </p>

    <H2 id="changes">12. Changes to these terms</H2>
    <p>
      We may update these terms from time to time. The version shown on this page, with its "last updated"
      date, applies to your use of the website from that date.
    </p>
  </LegalPage>
);
