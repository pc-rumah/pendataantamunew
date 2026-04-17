import type { Guest, Aspiration } from './schema'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function generateGuestHTML(guests: Guest[]): string {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Data Tamu - Sistem Pendataan Digital</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a2e; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
        .header h1 { font-size: 24px; color: #1e3a5f; margin-bottom: 5px; }
        .header p { color: #64748b; font-size: 14px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #64748b; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #1e3a5f; color: white; padding: 12px 8px; text-align: left; font-size: 12px; font-weight: 600; }
        td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #e0f2fe; }
        .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>LAPORAN DATA TAMU</h1>
        <p><strong>Kantor Kecamatan Pecalungan</strong></p>
        <p>Sistem Pendataan Tamu Digital & Serap Aspirasi</p>
      </div>
      <div class="meta">
        <span>Tanggal Cetak: ${formatDate(new Date().toISOString())}</span>
        <span>Total Data: ${guests.length} tamu</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 30px;">No</th>
            <th>Nama</th>
            <th>NIK</th>
            <th>No. Telepon</th>
            <th>Instansi</th>
            <th>Tujuan</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          ${guests.map((guest, index) => `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${guest.nama}</strong><br><small style="color: #64748b;">${guest.alamat}</small></td>
              <td style="font-family: monospace;">${guest.nik}</td>
              <td>${guest.noTelp}</td>
              <td>${guest.instansi || '-'}</td>
              <td>${guest.tujuan}</td>
              <td>${guest.tanggal}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>Dokumen ini dicetak secara otomatis oleh Sistem Pendataan Tamu Digital - Kantor Kecamatan Pecalungan</p>
      </div>
    </body>
    </html>
  `
}

function generateAspirationHTML(aspirations: Aspiration[]): string {
  const statusLabels: Record<Aspiration['status'], string> = {
    baru: 'Baru',
    diproses: 'Diproses',
    selesai: 'Selesai',
  }

  const statusColors: Record<Aspiration['status'], string> = {
    baru: '#f59e0b',
    diproses: '#3b82f6',
    selesai: '#10b981',
  }

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Data Aspirasi - Sistem Pendataan Digital</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a2e; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #14b8a6; padding-bottom: 20px; }
        .header h1 { font-size: 24px; color: #0f766e; margin-bottom: 5px; }
        .header p { color: #64748b; font-size: 14px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #64748b; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #0f766e; color: white; padding: 12px 8px; text-align: left; font-size: 12px; font-weight: 600; }
        td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; vertical-align: top; }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #ccfbf1; }
        .status { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; color: white; }
        .category { display: inline-block; padding: 2px 6px; background: #e2e8f0; border-radius: 4px; font-size: 10px; color: #475569; }
        .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>LAPORAN DATA ASPIRASI</h1>
        <p><strong>Kantor Kecamatan Pecalungan</strong></p>
        <p>Sistem Pendataan Tamu Digital & Serap Aspirasi</p>
      </div>
      <div class="meta">
        <span>Tanggal Cetak: ${formatDate(new Date().toISOString())}</span>
        <span>Total Data: ${aspirations.length} aspirasi</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 30px;">No</th>
            <th>Judul</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          ${aspirations.map((asp, index) => `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${asp.judul}</strong><br><small style="color: #64748b; white-space: pre-wrap; word-break: break-word; max-width: 200px; display: block;">${asp.isi.substring(0, 100)}${asp.isi.length > 100 ? '...' : ''}</small></td>
              <td>${asp.nama}</td>
              <td>${asp.email}</td>
              <td><span class="category">${asp.kategori}</span></td>
              <td><span class="status" style="background: ${statusColors[asp.status]}">${statusLabels[asp.status]}</span></td>
              <td>${asp.tanggal}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>Dokumen ini dicetak secara otomatis oleh Sistem Pendataan Tamu Digital - Kantor Kecamatan Pecalungan</p>
      </div>
    </body>
    </html>
  `
}

export function generateGuestPDF(guests: Guest[]): void {
  const html = generateGuestHTML(guests)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  // Create download link and trigger automatic download
  const link = document.createElement('a')
  const timestamp = new Date().toISOString().split('T')[0]
  link.href = url
  link.download = `laporan-data-tamu-${timestamp}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL object after download
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

export function generateAspirationPDF(aspirations: Aspiration[]): void {
  const html = generateAspirationHTML(aspirations)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  // Create download link and trigger automatic download
  const link = document.createElement('a')
  const timestamp = new Date().toISOString().split('T')[0]
  link.href = url
  link.download = `laporan-data-aspirasi-${timestamp}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL object after download
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

export function printGuestData(guests: Guest[]): void {
  const html = generateGuestHTML(guests)
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}

export function printAspirationData(aspirations: Aspiration[]): void {
  const html = generateAspirationHTML(aspirations)
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}
