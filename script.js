const codeReader = new ZXing.BrowserQRCodeReader();
const videoElement = document.getElementById('video');
const output = document.getElementById('output');

codeReader
  .decodeFromVideoDevice(null, 'video', (result, err) => {
    if (result) {
      const vin = result.text.trim();
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`)
        .then(res => res.json())
        .then(data => {
          const vehicle = data.Results.filter(r => r.Value && r.Variable)
            .map(r => `<strong>${r.Variable}</strong>: ${r.Value}`)
            .join('<br>');
          output.innerHTML = `<h2>Vehicle Info for VIN: ${vin}</h2>${vehicle}`;
        });
      codeReader.reset(); // Stop scanning after successful read
    }
  })
  .catch(err => {
    output.innerHTML = `<p style="color:red;">Camera error: ${err}</p>`;
  });
