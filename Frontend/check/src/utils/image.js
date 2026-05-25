export const fallbackImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 640">
      <rect width="900" height="640" fill="#eef3f8"/>
      <rect x="250" y="170" width="400" height="300" rx="24" fill="#d7e1ea"/>
      <circle cx="350" cy="260" r="48" fill="#9fb3c8"/>
      <path d="M285 410l115-110 80 78 55-52 80 84z" fill="#7893ac"/>
      <text x="450" y="535" text-anchor="middle" font-family="Arial" font-size="42" fill="#50677d">DeeMart</text>
    </svg>
  `);

export const productImageProps = (src) => ({
  src: src ?? fallbackImage,
  onError: (event) => {
    event.currentTarget.src = fallbackImage;
  },
});