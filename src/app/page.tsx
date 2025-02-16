import Gradient from "@/components/Gradient";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Events from "@/components/home/Events";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main>
      <Gradient />
      <Navbar />
      <Hero />
      <About />
      <Events />
      <Contact />
      <Footer />
    </main>
  );
}
