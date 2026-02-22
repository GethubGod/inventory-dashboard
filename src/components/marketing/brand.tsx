import Image from "next/image";

type BrandVariant = "light" | "dark";

interface BrandProps {
  variant?: BrandVariant;
  text?: string;
  textClassName?: string;
  className?: string;
}

const logoByVariant: Record<BrandVariant, string> = {
  light: "/brand/logo-white.png",
  dark: "/brand/logo-black.png",
};

export function Brand({
  variant = "light",
  text = "Babytuna Systems",
  textClassName = "text-xl leading-none whitespace-nowrap",
  className = "",

}: BrandProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-bold tracking-tight transition-opacity hover:opacity-80 ${className}`}
    >
      <Image
        src={logoByVariant[variant]}
        alt=""
        aria-hidden
        width={28}
        height={28}
        className="h-7 w-7 shrink-0"
        priority
      />
      <span className={textClassName}>{text}</span>
    </span>

  );
}
