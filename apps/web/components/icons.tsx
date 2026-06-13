import Image from "next/image"

interface IconProps {
  className?: string
}

export function VkIcon({ className }: IconProps) {
  return (
    <Image
      src={"/icons/vk.svg"}
      alt="vk"
      height={32}
      width={32}
      className={className}
    />
  )
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <Image
      src={"/icons/youtube.svg"}
      alt="youtube"
      height={32}
      width={32}
      className={className}
    />
  )
}
