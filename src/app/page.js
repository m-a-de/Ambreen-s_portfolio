import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Approach from '../components/Approach';
import Sessions from '../components/Sessions';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Approach />
      <Sessions />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingButtons />
    </main>
  );
}
