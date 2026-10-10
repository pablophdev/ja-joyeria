import HeroCarousel from '../components/home/HeroCarousel'
import { heroSlides } from '../data/heroSlides'

function HomePage() {
  return (
    <>
      <h1 className="visually-hidden">JA Joyería — Alta joyería urbana</h1>
      <HeroCarousel slides={heroSlides} />
    </>
  )
}

export default HomePage
