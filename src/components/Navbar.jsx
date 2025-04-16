import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styles } from '../style';
import { navLinks } from '../constant';
import { logo, menu, close } from '../assets';

const Navbar = () => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const [typedText, setTypedText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const phrases = [
    'Revolutionizing Surveillance...',
    'Securing Tomorrow...',
    'Empowering Insights...',
  ];

  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const delayBetweenPhrases = 1500;
    let timeout;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(type, typingSpeed);
        } else {
          isDeleting = true;
          timeout = setTimeout(type, delayBetweenPhrases);
        }
      } else {
        if (charIndex > 0) {
          setTypedText(currentPhrase.slice(0, charIndex - 1));
          charIndex--;
          timeout = setTimeout(type, deletingSpeed);
        } else {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeout = setTimeout(type, typingSpeed);
        }
      }
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  const handleNavClick = (link) => {
    setActive(link.title);
    setToggle(false);

    if (link.id === 'STREAM') {
      navigate('/livestream'); // Navigate to the livestream page
    }else if (link.id === 'Aialerts') {
      navigate('/aialert'); // Navigate to the livestream page
    }else {
      navigate('/'); // Ensure we're on the home page first
      setTimeout(() => {
        const section = document.getElementById(link.id);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Delay to ensure the page has loaded
    }
  };

  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive('');
            window.scrollTo(0, 0);
          }}
        >
          <img src="/icon.jpeg" alt="logo" className="w-10 h-10 object-contain" />
          <p className="text-white text-[18px] font-bold cursor-pointer">
            SurveilX <span className="sm:block hidden">| {typedText}</span>
          </p>
        </Link>

        {/* Desktop Nav */}
        <ul className='list-none hidden sm:flex flex-row gap-10'>
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`${
                active === link.title ? 'text-white' : 'text-secondary'
              } hover:text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => handleNavClick(link)}
            >
              {link.id === 'STREAM' ? 'Livestream' : link.title}
            </li>
          ))}
        </ul>

        {/* Mobile Nav */}
        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img
            src={toggle ? close : menu}
            alt="menu"
            className='w-[28px] h-[28px] object-contain cursor-pointer'
            onClick={() => setToggle(!toggle)}
          />
          <div className={`${!toggle ? 'hidden' : 'flex'} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
            <ul className='list-none flex justify-end items-start flex-col gap-4'>
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  className={`${
                    active === link.title ? 'text-white' : 'text-secondary'
                  } font-poppins font-medium cursor-pointer text-[16px]`}
                  onClick={() => handleNavClick(link)}
                >
                  {link.id === 'STREAM' ? 'Livestream' : link.title}
                  {link.id === 'Aialerts' ? 'AiAlerts' : link.title}

                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
