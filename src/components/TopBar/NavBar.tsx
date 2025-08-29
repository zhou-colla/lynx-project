// NavBar.tsx
import { useState } from '@lynx-js/react';
import './NavBar.css';
import addIconCircle from '../../assets/add-icon-circle.png'
import menuIcon from '../../assets/menu-icon.png'

import { useNavigation } from '../NavigationContext.jsx';

export function NavBar() {
  const { setCurrentPage } = useNavigation();

  const handleClick = () => {
    alert(`Check`)
  }

  return (
    <view className="nav-bar">
      <view bindtap={()=> setCurrentPage('menudisplay')}>
        <image src={menuIcon} className="left-icon" />
      </view>
      <view bindtap={handleClick}>
        <image src={addIconCircle} className="right-icon"/>
      </view>
    </view>
  );
}