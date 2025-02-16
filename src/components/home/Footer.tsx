import Citium from "@/components/svg/Citium";

export default function Footer() {
  return (
    <footer className="border-t border-t-chetwode-500/20">
      <div className="container mx-auto flex max-w-6xl items-center justify-center px-4 py-10">
        <div className="flex flex-col items-center">
          <a
            href="https://www.citium.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base font-bold text-chetwode-500"
          >
            Desarrollado por
            <Citium className="w-20 fill-chetwode-500" />
          </a>
        </div>
      </div>
    </footer>
  );
}
