import React from 'react'

const NavBarMain = () => {
  return (
    <div className="categories-shop">
  <div className="container">
    <div className="row">
      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <div className="shop-cat-box">
          <img
            className="img-fluid"
            src="assets/img/product1.jpg"
            alt=""
          />
          <a className="btn hvr-hover" href="#">
            Lorem ipsum dolor
          </a>
        </div>
      </div>
      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <div className="shop-cat-box">
          <img
            className="img-fluid"
            src="images/categories_img_02.jpg"
            alt=""
          />
          <a className="btn hvr-hover" href="#">
            Lorem ipsum dolor
          </a>
        </div>
      </div>
      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <div className="shop-cat-box">
          <img
            className="img-fluid"
            src="images/categories_img_03.jpg"
            alt=""
          />
          <a className="btn hvr-hover" href="#">
            Lorem ipsum dolor
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

export default NavBarMain
