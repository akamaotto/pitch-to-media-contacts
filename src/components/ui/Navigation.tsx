import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { cx } from '../../utils/cx';

// Top-level app navigation
// Only includes primary surfaces: Contacts and Inbox
// Composer is accessed after selecting contacts and is not listed here
export const Navigation = () => {
  const location = useLocation();

  const pathname = location.pathname;
  const activePath = (() => {
    if (pathname === '/contacts' || pathname === '/contacts/') return '/contacts';
    if (pathname.startsWith('/contacts/pitched')) return '/contacts/pitched';
    if (pathname.startsWith('/contacts/recommended')) return '/contacts/recommended';
    if (pathname.startsWith('/contacts/myContacts')) return '/contacts/myContacts';
    return undefined;
  })();

  const navItems = [
    { path: '/contacts/pitched', label: 'Pitched' },
    { path: '/contacts/recommended', label: 'AI Recommended' },
    { path: '/contacts', label: 'All Contacts' },
    { path: '/contacts/myContacts', label: 'My Contacts' },
  ];

  return (
    <nav className="app-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={(item.path as unknown) as any}
          className={cx('nav-item', activePath === item.path && 'nav-item-active')}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
