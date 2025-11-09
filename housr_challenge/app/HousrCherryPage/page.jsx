"use client";
import { useState } from "react";
import LogoLink from "../Components/LogoLink.jsx";

import SpinningWheel from "../Components/SpinningWheel";
// import InfiniteCarousel from '../Components/InfiniteCarousel';

export default function HousrCherryPage() {
  return (
<div className="flex flex-col items-center min-h-screen bg-green-500">

   <SpinningWheel />;
  {/* <InfiniteCarousel height={200} speed={1}/> */}

</div>
  );
}
