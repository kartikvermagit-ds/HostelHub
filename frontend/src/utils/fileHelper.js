/**
 * Utility to download resources directly to the user's device
 */
export const downloadResourceFile = (resource) => {
  if (!resource) return;

  const fileName = resource.fileName || `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

  // 1. If physical file blob / URL exists
  if (resource.file_url) {
    const link = document.createElement('a');
    link.href = resource.file_url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  if (resource.rawFile) {
    const url = URL.createObjectURL(resource.rawFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = resource.rawFile.name || fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return;
  }

  // 2. Generate downloadable academic summary document if no physical file was attached
  const content = `=====================================================
HOSTELHUB STUDY MATERIAL
=====================================================
Title: ${resource.title}
Subject: ${resource.subject || 'Academic'}
Author: ${resource.author || 'Hostel Student'}
Uploaded: ${resource.uploadedAt || resource.timeAgo || 'Recent'}
File Size: ${resource.size || '2.4 MB'}
Tags: ${(resource.tags || []).join(', ') || 'None'}

Description & Notes Overview:
-----------------------------------------------------
${resource.description || 'Verified academic resource uploaded to HostelHub for class test and semester preparation.'}

=====================================================
Downloaded from HostelHub - Your Hostel's Study Hub
=====================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Notes.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

/**
 * Open resource preview in a new window/tab
 */
export const openResourcePreview = (resource) => {
  if (!resource) return;

  if (resource.file_url) {
    window.open(resource.file_url, '_blank');
    return;
  }

  if (resource.rawFile) {
    const url = URL.createObjectURL(resource.rawFile);
    window.open(url, '_blank');
    return;
  }

  // Generate preview window for documents
  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resource.title} - HostelHub Preview</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 40px 20px; margin: 0; }
            .card { max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            .badge { display: inline-block; background: #00685f; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 12px; }
            h1 { margin: 0 0 8px; font-size: 24px; color: #0f172a; }
            .meta { font-size: 13px; color: #64748b; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }
            .content { line-height: 1.6; font-size: 15px; background: #f1f5f9; padding: 20px; border-radius: 12px; white-space: pre-wrap; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">${resource.subject || 'CS'} • ${resource.type || 'PDF'}</span>
            <h1>${resource.title}</h1>
            <div class="meta">
              Uploaded by: <strong>${resource.author || 'Kartik'}</strong> • Date: <strong>${resource.uploadedAt || resource.timeAgo || 'Just now'}</strong> • Size: <strong>${resource.size || '2.4 MB'}</strong>
            </div>
            <h3>Overview & Content Summary</h3>
            <div class="content">${resource.description || 'Comprehensive study notes uploaded for exam revision.'}</div>
          </div>
        </body>
      </html>
    `);
    previewWindow.document.close();
  }
};
