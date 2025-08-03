document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "Uploading... please wait...";

    const formData = new FormData();
    formData.append('certificate', document.getElementById('certificate').files[0]);
    formData.append('certificateType', document.getElementById('certificateType').value);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {

        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        let color = 'green';
        if (data.status === 'Exists') color = 'orange';

        resultDiv.innerHTML = `
          <p>Status: <strong style="color: ${color};">${data.status}</strong></p>
          <p>${data.message}</p>
          ${data.qrCodeUrl ? `<img src="${data.qrCodeUrl}" width="200" />` : ''}
          ${data.uniqueId ? `<p>Unique ID: <strong>${data.uniqueId}</strong></p>` : ''}
        `;
      } else {
        resultDiv.innerHTML = `
          <p>Status: <strong style="color: red;">${data.status}</strong></p>
          <p>${data.message}</p>
        `;
      }

    } catch (err) {
      console.error('Error during fetch:', err);
      resultDiv.innerHTML = `<p style="color: red;">Upload failed. Please try again later.</p>`;
    }
  });
});
