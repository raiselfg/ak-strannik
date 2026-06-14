import { gratitudes } from "@/lib/constants";
import Image from "next/image";

export default function Gallery() {
  return (
    <>
      <ul className="container mx-auto grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-10">
        {gratitudes.map((g, i) => (
          <li key={g.image}>
            <Image
              src={g.image}
              alt={g.alt}
              width={500}
              height={666}
              className="aspect-3/4 w-full object-cover"
            />
          </li>
        ))}
      </ul>
    </>
  );
}
