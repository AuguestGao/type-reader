import Image from "next/image";

import { backgroundPicture } from "../../utils/bgp-map";

import styles from "./styles.module.scss";

const getBgp = (bgpName: string) => {
  const imageSrc = backgroundPicture[bgpName];

  if (!imageSrc) {
    return backgroundPicture["texturedDarkGrayWall"];
  }

  return imageSrc;
};

export const BGP = ({ bgpName }: { bgpName: string }) => {
  const image = getBgp(bgpName);
  return (
    <div className={styles.bgwrap}>
      <Image
        alt={image.alt}
        src={image.src}
        layout="fill"
        objectFit="cover"
        quality={100}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM0+Q8AAW0BNbM5dTkAAAAASUVORK5CYII="
      />
    </div>
  );
};
