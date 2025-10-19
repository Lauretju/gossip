// src/utils/exportUtils.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (sales, filename) => {
  try {
    const headers = ['Fecha', 'Total', 'Estado Pago', 'Items', 'Usuario', 'ID Pago'];
    
    const csvData = sales.map(sale => [
      sale.date?.toDate().toLocaleString() || 'Fecha no disponible',
      sale.total || 0,
      sale.paymentStatus || 'pending',
      sale.items?.map(item => `${item.name} (x${item.quantity})`).join('; ') || 'Sin items',
      sale.userEmail || 'Anónimo',
      sale.paymentId || 'Sin ID'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exportando CSV:', error);
    alert('Error al exportar CSV');
  }
};

export const exportToPDF = (sales, filename) => {
  try {
    const doc = new jsPDF();
    
    // Título
    doc.text('Reporte de Ventas', 14, 15);
    
    // Tabla
    const tableData = sales.map(sale => [
      sale.date?.toDate().toLocaleDateString() || 'N/A',
      `$${sale.total?.toLocaleString() || 0}`,
      sale.paymentStatus || 'pending',
      sale.items?.length || 0,
      sale.userEmail || 'Anónimo'
    ]);

    doc.autoTable({
      head: [['Fecha', 'Total', 'Estado', 'Items', 'Usuario']],
      body: tableData,
      startY: 20,
    });

    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exportando PDF:', error);
    alert('Error al exportar PDF');
  }
};