import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { LegalPage, Pending, H2, List } from '../components/LegalPage';

/**
 * B2B Order, Cancellation, Returns & Claims Policy (DRAFT).
 *
 * Falcon has no online checkout: every sale is agreed separately in writing. This page
 * therefore sets out the general framework only. Every period, percentage and remedy is a
 * management decision and is marked Pending until approved; none has been invented.
 */
export const OrderPolicyPage: React.FC = () => (
  <LegalPage icon={ClipboardCheck} eyebrow="B2B Trade" title="Order, Cancellation & Claims Policy">
    <p>
      Falcon International Traders supplies business buyers only and does not sell through online checkout.
      This policy explains how enquiries become orders and how cancellations, quality claims and returns are
      handled. The written sales contract for each order takes priority over this page. See also our{' '}
      <Link to="/terms" className="text-[#f2a900] underline">Terms &amp; Conditions</Link>.
    </p>

    <H2 id="enquiry-vs-order">1. Enquiries, quotations and accepted orders</H2>
    <List>
      <li><strong>Enquiry:</strong> a request sent through this website, by email or by WhatsApp. It creates no obligation for either party.</li>
      <li><strong>Quotation:</strong> our written offer of price and terms, valid for <Pending>standard quotation validity period</Pending> unless the quotation states otherwise, and subject to availability.</li>
      <li><strong>Accepted order:</strong> created only when both parties confirm the order in writing, for example a signed sales contract or a proforma invoice accepted by both sides.</li>
    </List>

    <H2 id="payment">2. Deposits and payment</H2>
    <p>
      Payment terms, any advance or deposit, and the payment method (for example letter of credit or bank
      transfer) are set in each sales contract. <Pending>standard payment and deposit terms, if any</Pending>
    </p>

    <H2 id="cancellation">3. Cancellation</H2>
    <List>
      <li>Before an order is accepted, either party may withdraw at any time without cost.</li>
      <li>After acceptance, an order may be cancelled only as allowed by the sales contract or by agreement in writing. <Pending>cancellation terms after acceptance, including treatment of deposits and costs already incurred (raw material, processing, packaging, freight bookings)</Pending></li>
      <li>Custom, blended or private-label goods, and packaging printed to the buyer's design, are made to order. <Pending>cancellation terms for custom and private-label goods</Pending></li>
    </List>

    <H2 id="inspection">4. Samples and inspection</H2>
    <p>
      Pre-shipment samples, inspection by the buyer or an independent inspection agency, and the tests and
      laboratory used are agreed in the sales contract. Where the contract names a pre-shipment inspection or
      Certificate of Analysis as final for quality, that contract term applies.
    </p>

    <H2 id="claims">5. Quality, quantity and damage claims</H2>
    <p>If goods arrive damaged, contaminated, short, or not matching the agreed specification:</p>
    <List>
      <li>Notify us in writing within <Pending>claim notification period after discharge or delivery</Pending>, quoting the contract and container numbers.</li>
      <li>Provide evidence such as photographs, the survey or inspection report, laboratory results from an accredited laboratory using the agreed method, and the retained or sealed samples. <Pending>evidence requirements and whether a joint survey is required</Pending></li>
      <li>Keep the goods in suitable storage and do not process, sell or dispose of them until we have had a reasonable opportunity to inspect, unless food-safety law requires otherwise.</li>
      <li>Damage caused in transit after risk has passed under the agreed Incoterm is normally a matter for the carrier or cargo insurer.</li>
    </List>

    <H2 id="disputes">6. Quality disputes</H2>
    <p>
      If we disagree about test results, the dispute will be handled as set out in the sales contract.{' '}
      <Pending>default approach, e.g. referee testing of sealed samples by an agreed independent laboratory, and who bears the cost</Pending>
    </p>

    <H2 id="returns">7. Returns</H2>
    <p>
      Goods may be returned only with our prior written return authorisation. Because these are food products
      shipped internationally, returns are often impractical; agreed remedies may instead include
      replacement, credit, a price adjustment or local disposal under supervision.{' '}
      <Pending>who pays return freight, customs and disposal costs</Pending>
    </p>

    <H2 id="remedies">8. Refunds, replacement or credit</H2>
    <p>
      Where a claim is accepted, the remedy is as set out in the sales contract or agreed in writing at the
      time. <Pending>standard remedies and any limit on liability (for example, up to the invoice value of the affected goods)</Pending>
    </p>

    <H2 id="shipping">9. Shipping, customs and duties</H2>
    <p>
      Delivery terms follow the Incoterm agreed in the sales contract. Unless the contract says otherwise, the
      buyer is responsible for import clearance, duties, taxes and destination-country approvals. Shipping
      dates are estimates that depend on vessel schedules and authorities outside our control.
    </p>

    <H2 id="statutory">10. Rights under law</H2>
    <p>
      This policy does not exclude or limit any rights or liabilities that cannot lawfully be excluded or
      limited under the law that applies to the sales contract.
    </p>

    <H2 id="contact">11. How to raise a claim</H2>
    <p>
      Send claims in writing to <Pending>claims contact email address</Pending>, quoting your contract number.
    </p>
  </LegalPage>
);
