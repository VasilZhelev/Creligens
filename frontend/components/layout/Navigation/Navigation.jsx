import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const selectorRef = useRef(null);

  const navItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/address', icon: 'far fa-address-book', label: 'Address Book' },
    { path: '/components', icon: 'far fa-clone', label: 'Components' },
    { path: '/calendar', icon: 'far fa-calendar-alt', label: 'Calendar' },
    { path: '/charts', icon: 'far fa-chart-bar', label: 'Charts' },
    { path: '/documents', icon: 'far fa-copy', label: 'Documents' }
  ];

  const updateSelector = (element) => {
    const selector = selectorRef.current;
    if (!selector || !element) return;

    const { top, left, height, width } = element.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();

    selector.style.top = `${top - navRect.top}px`;
    selector.style.left = `${left - navRect.left}px`;
    selector.style.height = `${height}px`;
    selector.style.width = `${width}px`;
  };

  useEffect(() => {
    const activeItem = navRef.current?.querySelector('.active');
    if (activeItem) {
      updateSelector(activeItem);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const activeItem = navRef.current?.querySelector('.active');
      if (activeItem) {
        updateSelector(activeItem);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (path, e) => {
    const items = navRef.current.querySelectorAll('.nav-item');
    items.forEach(item => item.classList.remove('active'));
    e.currentTarget.classList.add('active');
    updateSelector(e.currentTarget);
    navigate(path);
  };

  return (
    <nav className="navbar navbar-expand-custom navbar-mainbg">
      <a className="navbar-brand navbar-logo" href="/">
        Smart Car Check
      </a>
      <button 
        className="navbar-toggler" 
        type="button" 
        aria-label="Toggle navigation"
        onClick={() => {
          navRef.current.classList.toggle('show');
          setTimeout(() => {
            const activeItem = navRef.current?.querySelector('.active');
            if (activeItem) updateSelector(activeItem);
          });
        }}
      >
        <i className="fas fa-bars text-white"></i>
      </button>
      <div className="navbar-collapse" id="navbarSupportedContent" ref={navRef}>
        <ul className="navbar-nav ml-auto">
          <div className="hori-selector" ref={selectorRef}>
            <div className="left"></div>
            <div className="right"></div>
          </div>
          {navItems.map((item, index) => (
            <li 
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={(e) => handleNavClick(item.path, e)}
            >
              <a className="nav-link" href={item.path} onClick={(e) => e.preventDefault()}>
                <i className={item.icon}></i>{item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;