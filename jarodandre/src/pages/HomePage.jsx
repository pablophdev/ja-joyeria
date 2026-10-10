import { Component } from 'react'
import HeroCarousel from '../components/home/HeroCarousel'
import { heroSlides } from '../data/heroSlides'
import CollectionBanners from '../components/home/CollectionBanners'
import FeaturedProducts from '../components/home/FeaturedProducts'
import InstagramGallery from '../components/home/InstagramGallery'
import { collectionBanners, instagramImages, productFilters } from '../data/homeContent'
import { getFeaturedProducts, subscribeToProducts } from '../data/products'
import '../components/home/HomeSections.css'

class HomePage extends Component {
  state = { featuredProducts: getFeaturedProducts() }

  componentDidMount() {
    this.unsubscribe = subscribeToProducts(this.refreshProducts)
    this.refreshProducts()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refreshProducts = () => {
    this.setState({ featuredProducts: getFeaturedProducts() })
  }

  render() {
    return (
      <>
        <h1 className="visually-hidden">JA Joyería — Alta joyería urbana</h1>
        <HeroCarousel slides={heroSlides} />
        <CollectionBanners collections={collectionBanners} />
        <FeaturedProducts products={this.state.featuredProducts} filters={productFilters} />
        <InstagramGallery images={instagramImages} />
      </>
    )
  }
}

export default HomePage
