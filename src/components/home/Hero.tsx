import Logo from "../svg/Logo";

export default function Hero() {
  return (
    <section className="hero-height">
      <section id="home" className="relative">
        <div className="hero-height container mx-auto flex max-w-6xl items-center justify-center px-4">
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full justify-center overflow-hidden">
              <Logo className="size-52 fill-white" />
            </div>
            <h1 className="text-center text-4xl font-bold text-white md:text-6xl">
              Comunidad Universitaria
            </h1>
            <p className="mt-2 text-lg italic text-chetwode-500 md:text-xl">
              &quot; En busca de la excelencia &quot;
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
