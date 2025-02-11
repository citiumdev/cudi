import Image from "next/image";
import AboutImage from "@/assets/about.png";

export default function About() {
  return (
    <section
      id="about"
      className="container mx-auto mb-40 flex min-h-screen max-w-6xl items-center px-2 py-32"
    >
      <div className="flex w-full flex-wrap">
        <div className="flex w-full flex-col p-4">
          <h1 className="mb-4 text-6xl font-bold">Nosotros</h1>
          <div className="space-y-6">
            <p className="leading-loose">
              Comunidad Universitaria Desarrollo e Innovación (CUDI) Nace con la
              finalidad de ser un espacio dirigido por estudiantes para
              contribuir en los procesos de formación y difusión en el área de
              la informática para estudiantes de la UNEG de Ingeniería en
              Informática y de otras carreras en general a quienes les llame la
              atención la programación en cada una de sus ramas y compartir sus
              experiencias y conocimientos mediante actividades socioculturales
              en el ámbito tecnológico.
            </p>
            <p className="leading-loose">
              La misión de CUDI es brindar herramientas y oportunidades a
              estudiantes universitarios de la UNEG en el área de la tecnología
              u otras, fomentando así la participación activa y colectiva de los
              mismos en su comunidad.
            </p>
            <p className="leading-loose">
              La visión es alcanzar el reconocimiento y participación activa de
              los estudiantes universitarios de la UNEG, creando espacios para
              discutir temas de interés en la actualidad en el ámbito
              tecnológico, actividades de formación y retos de desarrollo e
              innovación. Alcanzando un impacto no solo en los estudiantes de la
              UNEG si no en todos los interesados de la comunidad universitaria
              de Ciudad Guayana.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col p-4">
          <div className="max-h-[650px] rounded-lg bg-chetwode-500">
            <Image
              src={AboutImage}
              alt="About"
              className="h-full w-full rounded-lg object-cover object-bottom mix-blend-multiply grayscale"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
