import Image from "next/image";

import { colorImageMap } from "../../utils/color-image-map";

import styles from "./styles.module.scss";

const getImageByColor = (color: string) => {
  const imageSrc = colorImageMap[color];

  if (!imageSrc) {
    return colorImageMap["darkgray"];
  }

  return imageSrc;
};

export const BGP = ({ color = "darkgray" }: { color?: string }) => {
  const image = getImageByColor(color);
  return (
    <div className={styles.bgwrap}>
      <Image
        alt={image.alt}
        src={image.src}
        layout="fill"
        objectFit="cover"
        quality={100}
      />
    </div>
  );
};
