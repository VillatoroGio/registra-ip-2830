import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export const generarCertificadoPDF = async (obra) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const ancho = 297;
  const alto = 210;

  doc.setDrawColor(48, 40, 48);
  doc.setLineWidth(2);
  doc.rect(10, 10, ancho - 20, alto - 20);

  doc.setLineWidth(0.6);
  doc.rect(13, 13, ancho - 26, alto - 26);

  const esquinero = (x, y) => {
    doc.setFillColor(48, 40, 48);
    doc.rect(x, y, 4, 4, 'F');
  };
  esquinero(14, 14);
  esquinero(ancho - 18, 14);
  esquinero(14, alto - 18);
  esquinero(ancho - 18, alto - 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('SISTEMA INSTITUCIONAL DE PROTECCIÓN Y REGISTRO DE AUTORÍA • REGISTRA-IP', ancho / 2, 25, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(48, 40, 48);
  doc.text('CERTIFICADO DE REGISTRO DE AUTORÍA', ancho / 2, 38, { align: 'center' });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(70, 43, ancho - 70, 43);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(70, 70, 70);
  doc.text('Por medio del presente documento oficial, se certifica el depósito legal y registro de la obra titulada:', ancho / 2, 54, { align: 'center' });

  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.text(`"${obra.titulo || 'Obra Sin Título'}"`, ancho / 2, 68, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(110, 110, 110);
  doc.text(`Categoría: ${obra.categoria || 'Registro General'}`, ancho / 2, 76, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(70, 70, 70);
  doc.text('Declarada bajo la legítima autoría de:', ancho / 2, 92, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(48, 40, 48);
  doc.text(obra.autor || 'Creador Independiente', ancho / 2, 103, { align: 'center' });

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(100, 107, ancho - 100, 107);

  try {
    const qrDataUrl = await QRCode.toDataURL(obra.folio, {
      margin: 1,
      width: 256,
      color: {
        dark: '#302830',
        light: '#ffffff'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', 28, 125, 42, 42);
  } catch (error) {
    console.error('Error generando QR:', error);
  }

  const xInfo = 78;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(48, 40, 48);
  doc.text('FOLIO ÚNICO REGISTRAL:', xInfo, 134);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text(obra.folio, xInfo, 141);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`, xInfo, 149);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(48, 40, 48);
  doc.text('Registrado por: Villatoro Santiago Giovani', xInfo, 158);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Este certificado cuenta con validez digital verificable mediante el código QR lateral.', xInfo, 166);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Documento expedido por el sistema REGISTRA-IP • UPIICSA IPN • Uso académico y demostrativo', ancho / 2, 195, { align: 'center' });

  doc.save(`certificado-${obra.folio}.pdf`);
};