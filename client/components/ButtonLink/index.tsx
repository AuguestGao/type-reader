import Link from "next/link";

export const ButtonLink = ({
  dest,
  label,
  isOutlined = false,
}: {
  dest: string;
  label: string;
  isOutlined?: boolean;
}) => {
  return (
    <Link href={dest} passHref>
      <a
        className={`btn ${
          isOutlined ? "btn-outline-light" : "btn-light"
        } rounded-pill px-5 fs-5 fw-bold`}
        role="button"
        aria-disabled="true"
      >
        {label}
      </a>
    </Link>
  );
};
