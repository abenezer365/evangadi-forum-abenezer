import React from 'react'
import evangadi_logo_w from '../../assets/evangadi-logo-w.png'
import { SiYoutube, SiInstagram, SiFacebook } from 'react-icons/si';
import css from './Footer.module.css'
function Footer() {
  return (
    <footer>
      <div className={css.left}>
        <img src={evangadi_logo_w} alt="Evangadi Logo" />
        <div className={css.links}>
          <SiFacebook />
          <SiInstagram />
          <SiYoutube />
         </div>
      </div>
      <div className={css.center}>
        <span className={css.title}>Usefull Links</span>
        <p>How it work?</p>
        <p>Terms of service</p>
        <p>Privacy Policy</p>
      </div>
      <div className={css.right}>
        <span className={css.title}>Contact Information</span>
        <p>Evangadi networks</p>
        <p>support@evangadi.com</p>
        <p>+1-(202)-386-2702</p>
      </div>
    </footer>
  )
}

export default Footer
