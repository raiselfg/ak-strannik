import Image from "next/image";

export default function VkIcon() {
  return (
    <Image
      src={"/icons/vk.svg"}
      alt="vk"
      height={32}
      width={32}
      loading="lazy"
    />
  );
}
