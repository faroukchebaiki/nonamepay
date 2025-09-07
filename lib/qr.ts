import QRCode from 'qrcode'

export async function qrSvg(text: string, size = 288) {
  return QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: size,
  })
}

