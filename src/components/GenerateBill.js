import jsPDF from "jspdf";
import "jspdf-autotable";

const generateInvoice = () => {
  const doc = new jsPDF();

  // Add Title
  doc.setFontSize(18);
  doc.text("TAX INVOICE", 105, 10, { align: "center" });

  // Add Company Details with GST No. on top
  doc.setFontSize(12);
  doc.text("GST No.-08AAJCC2500M1ZP", 20, 20);  // GST No. above the company name
  
  // Bold the company name
  doc.setFont('helvetica', 'bold');
  doc.text("GOKUL KRIPA DEVELOPERS LLP", 20, 50); // Company name with 30px gap below GST No.
  
  // Reset font style to normal for other fields
  doc.setFont('helvetica', 'normal');
  
  // Indent remaining fields under the company name
  doc.text("GST No.-08AAKCR9676A1ZZ", 30, 56);   // Add the second GST number if needed
  doc.text("7th Floor, 709, Okay Plus Tower, Sector-7,", 30, 62);
  doc.text("Mansarovar, Jaipur, Rajasthan-302020", 30, 68);

  // Add Invoice Information
  doc.text("Invoice No.: 319/24", 150, 20);
  doc.text("Date: 07/09/2024", 150, 26);

  // Add Greeting
  doc.setFontSize(14);
  doc.text("Sir,", 20, 74);

  // Add Table with Item Details and Calculations
  doc.autoTable({
    startY: 80,
    head: [["S N", "SITE", "SCOPE OF WORK", "RATE", "AMOUNT"]],
    body: [
      [
        "1",
        "VATIKA",
        `Establishing and physically marking the location of proposed new 
roads ROW/Street markings line marking in accordance respective reference with 
Approved Master plan/Layout plans. On Dated-25/06/2024`,
        "₹ 7,500.00",
        "₹ 14,135.00",
      ],
      // Adding total calculations as rows in the table
      [
        "", "", "(A) Total Amount", "", "₹ 14,135.00",
      ],
      [
        "", "", "(B) (i) CGST 9% On Total Amount", "", "₹ 1,272.00",
      ],
      [
        "", "", "(ii) SGST 9% On Total Amount", "", "₹ 1,272.00",
      ],
      [
        "", "", "(C) Grand Total (A+B)", "", "₹ 16,679.00",
      ]
    ],
    theme: "grid",
    headStyles: { fillColor: [100, 100, 255] },
    bodyStyles: { valign: "middle" },
    columnStyles: {
      0: { halign: "center" }, // Serial number column
      1: { halign: "center" }, // Site column
      2: { halign: "left", cellWidth: 80 }, // Scope of work column with a fixed width
      3: { halign: "center" }, // Rate column
      4: { halign: "right", cellWidth: 60, overflow: "linebreak", font: "normal" }, // Adjust width for Amount column, ensure it fits
    },
    columnWidths: [20, 40, 100, 30, 60], // Manually define the width of each column (Amount has 60 now)
    styles: { fontSize: 12 },
  });

  // Add some margin above the Payment Details Box
  const marginTop = 10;
  const gap = 5;
  const paymentY = doc.lastAutoTable.finalY + marginTop;

  // Draw a box around Payment Details
  const boxX = 15;
  const boxY = paymentY;
  const boxWidth = 180;

  // Adjust the height based on the number of lines in the Payment Details
  const lineHeight = 6;  // Height of each line in Payment Details
  const numberOfLines = 6; // Number of lines in payment details (adjust as needed)
  const boxHeight = lineHeight * numberOfLines + 6; // Adding some padding to the box height

  // Draw the rectangle (box) around the Payment Details
  doc.rect(boxX, boxY, boxWidth, boxHeight);

  // Add Payment Details inside the box
  doc.setFontSize(12);
  doc.text("Cheque Favour of – Cad Max Projects Pvt. Ltd.", 20, paymentY + gap);
  doc.text("Bank Name: HDFC Bank Ltd.", 20, paymentY + gap + lineHeight);
  doc.text(
    "Branch: Near Laxmi Mandir Tiraha, Tonk Phatak, Jaipur",
    20,
    paymentY + gap + 2 * lineHeight
  );
  doc.text("A/c No.: 50200056245182", 20, paymentY + gap + 3 * lineHeight);
  doc.text("IFSC Code: HDFC0000644", 20, paymentY + gap + 4 * lineHeight);
  doc.text("PAN No.: AAJCC2500M", 20, paymentY + gap + 5 * lineHeight);
  
  // Save the PDF
  doc.save("Tax_Invoice.pdf");
};

export default generateInvoice;
