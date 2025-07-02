import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CarouselComponent = ({darkMode,contest}) => {
  const carouselItems = contest

  return (
    <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
      {carouselItems.map((item) => (
        <div key={item.id} className={`p-4  min-h-[400px] min-w-[80vw] w-full    rounded-lg bg-[url(https://i.ytimg.com/vi/vPlb8IwJIzY/maxresdefault.jpg)] bg-contain bg-center  bg-no-repeat text-white `}>
          <h3 className="text-xl font-bold  text-red-500 ">{item.title}</h3>
          <p className="">{item.description}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
