
import { jsPDF } from "jspdf";
import { format } from "date-fns";

export interface CertificateData {
  studentName: string;
  studentId: string;
  completionDate: string;
  certificateId: string;
}

export const generateClearanceCertificate = (data: CertificateData): Blob => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Set background color
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");
  
  // Add border
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 20, "S");
  
  // Add header
  doc.setFontSize(24);
  doc.setTextColor(75, 75, 75);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE OF CLEARANCE", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
  
  // Add university/institution name
  doc.setFontSize(18);
  doc.text("CLEARPASS UNIVERSITY", doc.internal.pageSize.getWidth() / 2, 50, { align: "center" });
  
  // Add content
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This is to certify that",
    doc.internal.pageSize.getWidth() / 2,
    70,
    { align: "center" }
  );
  
  // Student name
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(
    data.studentName,
    doc.internal.pageSize.getWidth() / 2,
    80,
    { align: "center" }
  );
  
  // More content
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `with Student ID: ${data.studentId} has successfully completed all departmental clearances`,
    doc.internal.pageSize.getWidth() / 2,
    90,
    { align: "center" }
  );
  doc.text(
    `as of ${format(new Date(data.completionDate), "MMMM dd, yyyy")}`,
    doc.internal.pageSize.getWidth() / 2,
    100,
    { align: "center" }
  );
  
  // Certificate ID
  doc.setFontSize(10);
  doc.text(
    `Certificate ID: ${data.certificateId}`,
    doc.internal.pageSize.getWidth() / 2,
    110,
    { align: "center" }
  );
  
  // Add signatures
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  
  // Registrar signature
  doc.line(60, 140, 110, 140);
  doc.text("University Registrar", 85, 148, { align: "center" });
  
  // Dean signature
  doc.line(190, 140, 240, 140);
  doc.text("Dean of Students", 215, 148, { align: "center" });
  
  // Date and verification info
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Issued on: ${format(new Date(), "MMMM dd, yyyy")}`,
    doc.internal.pageSize.getWidth() / 2,
    170,
    { align: "center" }
  );
  doc.text(
    "This certificate can be verified online at clearpass.edu/verify",
    doc.internal.pageSize.getWidth() / 2,
    180,
    { align: "center" }
  );
  
  // Generate QR code placeholder (in a real implementation, you would generate an actual QR code)
  doc.setFillColor(0, 0, 0);
  doc.roundedRect(doc.internal.pageSize.getWidth() - 50, 160, 30, 30, 1, 1, "F");
  
  // Return as blob
  return doc.output("blob");
};
