import React from 'react'

const Slider = () => {
  return (
    <div id="slides-shop" className="cover-slides">
    <ul className="slides-container">
      <li className="text-center">
        <img src="assets/img/product1.jpg" alt="" />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="m-b-20">
                <strong>
                  Welcome To <br /> Freshshop
                </strong>
              </h1>
              <p className="m-b-40">
                See how your users experience your website in realtime or view{" "}
                <br /> trends to see any changes in performance over time.
              </p>
              <p>
                <a className="btn hvr-hover" href="#">
                  Shop New
                </a>
              </p>
            </div>
          </div>
        </div>
      </li>
     
    </ul>
    <div className="slides-navigation">
      <a href="#" className="next">
        <i className="fa fa-angle-right" aria-hidden="true" />
      </a>
      <a href="#" className="prev">
        <i className="fa fa-angle-left" aria-hidden="true" />
      </a>
    </div>
  </div>
  
  )
}

export default Slider
