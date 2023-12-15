"use client";

import Carousel from "react-material-ui-carousel";

function Home() {
  return (
    <div className="w-full min-h-full bg-slate-50">
      <div className="w-full">
        <Carousel>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </Carousel>
      </div>
    </div>
  );
}

export default Home;
