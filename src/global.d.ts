export {};

declare global {
  interface Window {
    cocoSsd: any; // You can replace `any` with the proper type once available
    tf: any;
  }
}
