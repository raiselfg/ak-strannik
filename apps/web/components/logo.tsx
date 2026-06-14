import Image from "next/image";

export default function Logo() {
  return (
    <a
      href="#"
      className="flex items-center gap-3"
      aria-label="Академия Странствий"
    >
      <Image
        src={"/images/logo.png"}
        alt="Академия странствий"
        width={48}
        height={48}
        fetchPriority="high"
        preload
        quality={75}
      />
      <span className="font-hand text-3xl leading-[0.95] font-bold">
        Академия
        <small className="text-muted-foreground mt-px block font-sans text-xs font-semibold tracking-[0.32em] uppercase">
          Странствий
        </small>
      </span>
    </a>
  );
}
