import Nav_Bar from "../Component/SA_Header.jsx";
import Main_Contents from "../Component/S_Main.jsx";
import CopyRight from "../Component/HSA_Footer.jsx";
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Start_Page() {
  return (
    <div className="bg-white bg-gradient-to-r from-purple-300 via-pink-200 to-white opacity-90">
      <Nav_Bar />
      <Main_Contents />
      <CopyRight />
    </div>
  );
}

export default Start_Page;
