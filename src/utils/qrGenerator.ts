
import QRCode from 'qrcode';

export const generateQRCode = async (text: string, options = {}): Promise<string> => {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      ...options,
    });
    return dataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateVerificationURL = (certificateId: string): string => {
  // In a real application, this would generate a URL to verify the certificate
  return `https://clearpass.edu/verify/${certificateId}`;
};
