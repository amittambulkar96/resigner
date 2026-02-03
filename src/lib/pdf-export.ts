import jsPDF from "jspdf";

export interface PDFExportOptions {
  title?: string;
  author?: string;
  subject?: string;
  filename?: string;
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  fontSize?: number;
  lineHeight?: number;
  showPageNumbers?: boolean;
  showDate?: boolean;
  showWatermark?: boolean;
}

export interface PDFLine {
  text: string;
  style?: "normal" | "bold" | "italic";
  size?: number;
}

const defaultOptions: PDFExportOptions = {
  title: "Document",
  author: "Resigner",
  subject: "",
  filename: "document.pdf",
  margins: {
    top: 40,
    bottom: 30,
    left: 20,
    right: 20,
  },
  fontSize: 12,
  lineHeight: 7,
  showPageNumbers: true,
  showDate: true,
  showWatermark: false,
};

/**
 * Export content to PDF format with proper formatting and layout
 */
export function exportToPDF(
  content: string,
  options: PDFExportOptions = {}
): void {
  const mergedOptions = { ...defaultOptions, ...options };
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: mergedOptions.title,
    author: mergedOptions.author,
    subject: mergedOptions.subject,
  });

  const margins = mergedOptions.margins!;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxLineWidth = pageWidth - margins.left - margins.right;
  
  // Add header to first page
  const addHeader = (pageNum: number, totalPages: number) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(mergedOptions.title || "", margins.left, 15);
    
    if (mergedOptions.showPageNumbers) {
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margins.right - 25, 15);
    }
    
    // Header line
    doc.setDrawColor(200, 200, 200);
    doc.line(margins.left, 20, pageWidth - margins.right, 20);
  };
  
  // Add footer to page
  const addFooter = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margins.left, pageHeight - margins.bottom + 10, pageWidth - margins.right, pageHeight - margins.bottom + 10);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    
    if (mergedOptions.showWatermark) {
      doc.text(`Generated with ${mergedOptions.author}`, margins.left, pageHeight - margins.bottom + 5);
    }
    
    if (mergedOptions.showDate) {
      const dateText = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(dateText, pageWidth - margins.right - 40, pageHeight - margins.bottom + 5);
    }
  };
  
  // Process content - handle paragraphs
  const paragraphs = content.split("\n\n");
  let currentPage = 1;
  let y = margins.top + 10; // Extra space for title
  
  doc.setFontSize(mergedOptions.fontSize!);
  doc.setFont("helvetica", "normal");
  
  // Add document title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const titleY = margins.top - 5;
  doc.text(mergedOptions.title || "", pageWidth / 2, titleY, { align: "center" });
  
  // Reset font for content
  doc.setFontSize(mergedOptions.fontSize!);
  doc.setFont("helvetica", "normal");
  
  paragraphs.forEach((paragraph) => {
    if (paragraph.trim()) {
      // Split paragraph into lines
      const lines = doc.splitTextToSize(paragraph, maxLineWidth);
      
      lines.forEach((line: string) => {
        // Check if we need a new page
        if (y + mergedOptions.lineHeight! > pageHeight - margins.bottom) {
          addFooter();
          doc.addPage();
          currentPage++;
          y = margins.top;
          addHeader(currentPage, 1);
        }
        
        doc.text(line, margins.left, y);
        y += mergedOptions.lineHeight!;
      });
      
      // Add extra space between paragraphs
      y += mergedOptions.lineHeight!;
    }
  });
  
  // Update all page headers with correct total pages
  const totalPages = currentPage;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(mergedOptions.title || "", margins.left, 15);
    
    if (mergedOptions.showPageNumbers) {
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margins.right - 25, 15);
    }
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margins.left, 20, pageWidth - margins.right, 20);
    
    // Add footer to last page
    if (i === totalPages) {
      addFooter();
    }
  }
  
  // Save the PDF
  doc.save(mergedOptions.filename || "document.pdf");
}

/**
 * Export HTML content to PDF (converts HTML to plain text first)
 */
export function exportHTMLToPDF(
  htmlContent: string,
  options: PDFExportOptions = {}
): void {
  // Convert HTML to plain text
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const plainText = tempDiv.textContent || tempDiv.innerText || "";
  
  exportToPDF(plainText, options);
}

/**
 * Export TipTap editor content to PDF
 */
export function exportEditorContentToPDF(
  editor: { getText: () => string; getHTML: () => string },
  options: PDFExportOptions = {}
): void {
  exportToPDF(editor.getText(), {
    ...options,
    title: options.title || "Resignation Letter",
    filename: options.filename || "resignation-letter.pdf",
  });
}
