import React from 'react'
import Filters from '../components/Filters'
import Slider from '../components/Slider'
import NavBarMain from '../components/test'
import Rentals from './Rentals'

const HomePage = () => {
  return (
    <div>
        {/* <Slider /> */}
        {/* <NavBarMain /> */}
      <Filters />
      <Rentals />
    </div>
  )
}

export default HomePage;
