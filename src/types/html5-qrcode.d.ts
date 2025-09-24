declare module 'html5-qrcode' {
  export class Html5QrcodeScanner {
    constructor(
      elementId: string,
      config: {
        fps: number;
        qrbox: { width: number; height: number };
        formatsToSupport: any[];
        experimentalFeatures?: {
          useBarCodeDetectorIfSupported?: boolean;
        };
      },
      verbose?: boolean
    );
    
    render(onScanSuccess: (decodedText: string) => void, onScanError: (errorMessage: string) => void): void;
    clear(): Promise<void>;
  }

  export class Html5QrcodeSupportedFormats {
    static QR_CODE: any;
    static EAN_13: any;
    static CODE_128: any;
    static CODE_39: any;
  }
}

declare global {
  interface Window {
    Html5QrcodeScanner: any;
    Html5QrcodeSupportedFormats: any;
  }
}
