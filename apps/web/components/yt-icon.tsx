import Image from "next/image";

export default function YoutubeIcon() {
  return (
    <Image
      src={"/icons/youtube.svg"}
      alt="youtube"
      height={32}
      width={32}
      loading="lazy"
    />
  );
}
