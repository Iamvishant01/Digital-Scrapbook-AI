import React from 'react'

const alerts = () =>{
  alert("Comming Soon !");
}

export default function Navbar() {
  return (
    <div>
     <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <a className="navbar-brand" href="/">Digital ScrapBook AI<span id='logo'>.</span></a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                <a className="nav-link active" aria-current="page" onClick={alerts} href='#'>Docs</a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="https://linktr.ee/iamvishant02" target='about_blank'>Devloper's Contact</a>
                </li>
                <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Other
                </a>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="https://linktr.ee/iamvishant02" target='about-blank'>Contact</a></li>
                    <li><a className="dropdown-item" onClick={alerts} href="#">train this Model ?</a></li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><a className="dropdown-item" onClick={alerts} href="#">Technology Stack</a></li>
                </ul>
                </li>
            </ul>
            <div className="btns d-flex grid gap-1">
            <a href="#"><button type="button" onClick={alerts} class="btn btn-primary">Scrapy's Club</button></a>
            <a href="#"><button type="button" onClick={alerts} class="btn btn-success">Stories</button></a>
            </div>
            </div>
        </div>
     </nav>
    </div>
  )
}