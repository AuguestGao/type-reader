// choose background image by supply a color name

interface ColorImageMap {
  [key: string]: {
    src: string;
    alt: string;
  };
}

const colorImageMap: ColorImageMap = {
  darkgray: {
    src: "/images/annie-spratt-6a3nqQ1YwBw-unsplash.jpg",
    alt: "textured darkgray wall",
  },
};

export { colorImageMap };
