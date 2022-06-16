import Image from "next/image";

import { backgroundPicture } from "../../utils/bgp-map";

import styles from "./styles.module.scss";

const getImageByColor = (bgpName: string) => {
  const imageSrc = backgroundPicture[bgpName];

  if (!imageSrc) {
    return backgroundPicture["darkgray"];
  }

  return imageSrc;
};

export const BGP = ({ bgpName = "texturedDarkGrayWall" }) => {
  const image = getImageByColor(bgpName);
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
