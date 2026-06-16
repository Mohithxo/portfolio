import Navbar from "@/components/ui/Navbar";
import PageLoader from "@/components/ui/PageLoader";
import ScrollScene from "@/components/three/ScrollScene";
import EyeScene from "@/components/three/EyeScene";
import SkewScroll from "@/components/providers/SkewScroll";
import SectionRail from "@/components/ui/SectionRail";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Quote from "@/components/sections/Quote";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <PageLoader />
      <ScrollScene />
      <EyeScene />
      <Navbar />
      <SectionRail />
      <SkewScroll>
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Quote />
          <Contact />
        </main>
      </SkewScroll>
    </>
  );
}
