import HeroCarousel from '../components/home/HeroCarousel'
import { heroSlides } from '../data/heroSlides'
import CollectionBanners from '../components/home/CollectionBanners'
import FeaturedProducts from '../components/home/FeaturedProducts'
import InstagramGallery from '../components/home/InstagramGallery'
import { collectionBanners, featuredProducts, instagramImages, productFilters } from '../data/homeContent'
import '../components/home/HomeSections.css'

function HomePage() {
  return (
    <>
      <h1 className="visually-hidden">JA Joyería — Alta joyería urbana</h1>
      <HeroCarousel slides={heroSlides} />
      <CollectionBanners collections={collectionBanners} />
      <FeaturedProducts products={featuredProducts} filters={productFilters} />
      <InstagramGallery images={instagramImages} />
    </>
  )
}

export default HomePage
