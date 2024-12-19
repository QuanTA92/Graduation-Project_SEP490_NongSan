import React from 'react'
import Banner from '../components/Banner'
import CarouselNavbar from '../components/CarouselNavbar'
import Category from '../components/Category'
import Filters from '../components/Filters'

import Rentals from '../pages/Rentals'

const HomePage = () => {
  return (
    <div>
      <Filters />
      <CarouselNavbar />
      <Category />
      <Banner />
      {/* <Rentals /> */}
    </div>
  )
}

export default HomePage;
