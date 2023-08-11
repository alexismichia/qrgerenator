import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import qrcodeSVG from 'qrcode-svg';
import qrcode from 'qrcode';

function App() {
  const [codeInput, setCodeInput] = useState('');
  const [formatSelect, setFormatSelect] = useState('png');
  const [qrCodes, setQRCodes] = useState([]);

  const generateQRCodes = () => {
    const codesList = codeInput.split(',').map(code => code.trim());

    const newQRCodes = codesList.map((code, index) => {
      if (code.length !== 8 || isNaN(code)) {
        console.log(`El código '${code}' no tiene 8 dígitos numéricos y será omitido.`);
        return null;
      }

      return (
        <div key={index} style={{ marginBottom: '20px' }}>
          <QRCode
            value={`https://www.ppol.io/u/${code}`}
            size={250}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>
      );
    });

    setQRCodes(newQRCodes);
  };

  const downloadQRCode = async (svgData, index, format) => {
    if (format === 'svg') {
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      saveAs(blob, `qr_${index}.svg`);
    } else if (format === 'png') {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 250;
        canvas.height = 250;
  
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
  
        img.onload = () => {
          context.drawImage(img, 0, 0, 250, 250);
  
          canvas.toBlob((blob) => {
            saveAs(blob, `qr_${index}.png`);
          });
        };
      } catch (error) {
        console.error('Error generating PNG:', error);
      }
    }
  };
  

  const downloadAllQRCodes = () => {
    const qrSVG = new qrcodeSVG({
      content: 'https://www.ppol.io/u/12345678',
      padding: 0,
      width: 250,
      height: 250,
      color: '#000000',
      background: '#ffffff',
    });
  
    const svgData = qrSVG.svg();
  
    qrCodes.forEach((_, index) => {
      downloadQRCode(svgData, index, formatSelect);
    });
  };
  

  return (
    <div>
      <h1>Generador de Códigos QR</h1>
      <label htmlFor="codeInput">Ingresa un código de 8 dígitos:</label>
      <input
        type="text"
        id="codeInput"
        value={codeInput}
        onChange={e => setCodeInput(e.target.value)}
      />

      <label htmlFor="formatSelect">Selecciona el formato de descarga:</label>
      <select
        id="formatSelect"
        value={formatSelect}
        onChange={e => setFormatSelect(e.target.value)}
      >
        <option value="png">PNG</option>
        <option value="svg">SVG</option>
      </select>
      <button onClick={generateQRCodes}>Generar Código QR</button>
      <button onClick={downloadAllQRCodes}>Descargar Todos los QR</button>

      <div id="qrCodeContainer">{qrCodes}</div>
    </div>
  );
}

export default App;
