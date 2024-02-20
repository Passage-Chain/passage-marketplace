import { useEffect } from 'react';
import lottieWeb from 'lottie-web';
import './loader.scss';

function Loader() {
  useEffect(() => {
    const animation = lottieWeb.loadAnimation({
      container: document.getElementById('loader-anim'),
      path: 'https://assets3.lottiefiles.com/packages/lf20_wpcqzpnk.json',
      renderer: 'svg',
      loop: true,
      autoplay: true,
      name: 'Demo Animation'
    });
    return () => {
      animation.destroy();
    };
  }, []);
  return (
    <div id="loader-anim" className="loader-anim"></div>
  );
}

export default Loader;
