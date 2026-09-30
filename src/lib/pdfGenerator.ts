import { jsPDF } from 'jspdf';
import { Product } from '../types';
import { COMPANY_INFO } from '../data/company';
import { trackEvent } from './analytics';

export function generateProductSpecPDF(product: Product): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    let y = margin;

    // Header Background Accent (Deep Forest Green)
    doc.setFillColor(5, 20, 15); // #05140f
    doc.rect(0, 0, pageWidth, 38, 'F');

    // Header Gold Stripe
    doc.setFillColor(242, 169, 0); // #f2a900
    doc.rect(0, 38, pageWidth, 2, 'F');

    // Header Title
    doc.setTextColor(253, 252, 240); // Ivory
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('FALCON INTERNATIONAL TRADERS', margin, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(163, 184, 153);
    doc.text('Agricultural Commodities & Indian Spices Export Desk', margin, 24);
    doc.text('Navi Mumbai / Cochin Port Hub, India | export@falconspices.com', margin, 29);

    // Document Meta (Right aligned)
    const docDate = new Date().toISOString().split('T')[0];
    const docRef = `SPEC-${product.slug.toUpperCase()}-2026`;
    doc.setFontSize(8);
    doc.setTextColor(242, 169, 0);
    doc.text(`DOC REF: ${docRef}`, pageWidth - margin, 22, { align: 'right' });
    doc.setTextColor(253, 252, 240);
    doc.text(`ISSUE DATE: ${docDate}`, pageWidth - margin, 27, { align: 'right' });
    doc.text('VERSION: 2.4 (EXPORT GRADE)', pageWidth - margin, 32, { align: 'right' });

    y = 50;

    // Product Title Box
    doc.setTextColor(5, 20, 15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(product.name, margin, y);

    y += 6;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Botanical Name: ${product.specifications.botanicalName || 'Not specified'} | Category: ${product.category} | Origin: ${product.origin}`, margin, y);

    y += 10;
    // Short Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    const descLines = doc.splitTextToSize(product.fullDescription || product.shortDescription, pageWidth - (margin * 2));
    doc.text(descLines.slice(0, 4), margin, y);
    y += (Math.min(descLines.length, 4) * 4.5) + 6;

    // Section 1: Technical & Quality Parameters Table
    doc.setFillColor(11, 35, 24);
    doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
    doc.setTextColor(242, 169, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('OFFICIAL EXPORT SPECIFICATION & PARAMETERS', margin + 3, y + 5);
    y += 9;

    const specs = [
      ['Product Commodity', product.name],
      ['Botanical Name', product.specifications.botanicalName || 'Botanical Standard'],
      ['Country of Origin', product.origin],
      ['Physical Form', product.specifications.form || product.form],
      ['Natural Color & Aroma', `${product.specifications.color || 'Natural characteristic'} | ${product.specifications.aroma || 'Warm characteristic aroma'}`],
      ['Moisture Limit', product.specifications.moistureMax || 'Max 10.0%'],
      ['Active Chemical Component', product.specifications.keyActiveComponent || 'Standard Natural Potency'],
      ['ASTA Color Value', product.specifications.astaColorValue || 'N/A for Whole Seed'],
      ['Mesh / Granulation Size', product.specifications.meshSize || 'Standard Export Mesh / Whole Form'],
      ['Extraneous Matter', product.specifications.extraneousMatterMax || 'Max 0.5% (Destoned & Cleared)'],
      ['Shelf Life', product.specifications.shelfLife || '24 Months from production date'],
      ['Storage Recommendations', product.specifications.storageConditions || 'Cool, dry hygienic warehouse away from sunlight'],
      ['Standard Export MOQ', product.minimumOrderQuantity || '1 Metric Ton']
    ];

    specs.forEach(([label, value], idx) => {
      // Row background
      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 248);
        doc.rect(margin, y - 3, pageWidth - (margin * 2), 6, 'F');
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(20, 20, 20);
      doc.text(label, margin + 3, y + 1);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(value, margin + 70, y + 1);

      y += 6;
    });

    y += 4;

    // Section 2: Formats & Packaging
    doc.setFillColor(11, 35, 24);
    doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
    doc.setTextColor(242, 169, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('AVAILABLE COMMERCIAL FORMATS & EXPORT PACKAGING', margin + 3, y + 5);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(5, 20, 15);
    doc.text('Available Formats:', margin + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const formatsText = product.availableFormats.join(', ') || 'Whole, Standard Fine Ground Powder';
    doc.text(formatsText, margin + 45, y);

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 20, 15);
    doc.text('Packaging Options:', margin + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const packagingText = product.packagingOptions.slice(0, 3).join('; ');
    doc.text(packagingText, margin + 45, y);

    y += 12;

    // Section 3: Statutory Certification & Quality Guarantee
    doc.setDrawColor(242, 169, 0);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, pageWidth - (margin * 2), 22);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(5, 20, 15);
    doc.text('Consignment Quality Clearances & Statutory Documentation:', margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text('• Every export consignment is issued with an official batch Certificate of Analysis (COA) and Statutory Phytosanitary Certificate.', margin + 3, y + 10);
    doc.text('• Multi-stage micro-reduction steam sterilization applied to meet destination-country microbiological parameters.', margin + 3, y + 14);
    doc.text('• Certified container fumigation certificate and Certificate of Origin (COO) furnished with shipping documents.', margin + 3, y + 18);

    // Footer
    const footerY = pageHeight - 12;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('Falcon International Traders | Confidential Export Technical Specification | For Contractual Inquiry Purposes Only', margin, footerY);
    doc.text(`Page 1 of 1`, pageWidth - margin, footerY, { align: 'right' });

    // Save and track
    doc.save(`Falcon_${product.slug}_Technical_Spec.pdf`);
    trackEvent('technical_pdf_download', { productId: product.id, productName: product.name });
    return true;
  } catch (err) {
    console.error('Error generating product PDF specification:', err);
    return false;
  }
}
