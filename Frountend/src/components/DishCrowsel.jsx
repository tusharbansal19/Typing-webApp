import React, { useEffect, useRef } from 'react';

const DishCarousel = () => {
  const carouselRef = useRef(null);

  const dishes = [
    {
      name: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta with eggs, cheese, pancetta, and pepper.',
      image: 'https://drive.google.com/uc?export=view&id=1nQLtLrcsnsWmbYDa7gwGhkAgg64oTCOE',
      price: '$12',
    },
    {
      name: 'Margherita Pizza',
      description: 'Pizza with fresh tomatoes, mozzarella, basil, and olive oil.',
      image: 'https://example.com/pizza.jpg',
      price: '$10',
    },
    {
      name: 'Caesar Salad',
      description: 'Crispy romaine lettuce, parmesan cheese, and Caesar dressing.',
      image: 'https://example.com/salad.jpg',
      price: '$8',
    },
    {
      name: 'Grilled Salmon',
      description: 'Salmon grilled to perfection with a side of lemon butter sauce.',
      image: 'https://example.com/salmon.jpg',
      price: '$18',
    },
    {
      name: 'Tacos al Pastor',
      description: 'Mexican tacos with marinated pork, pineapple, and cilantro.',
      image: 'https://example.com/tacos.jpg',
      price: '$7',
    },
    {
      name: 'Beef Burger',
      description: 'Juicy beef patty with lettuce, tomato, and cheese in a toasted bun.',
      image: 'https://example.com/burger.jpg',
      price: '$9',
    },
    {
      name: 'Pad Thai',
      description: 'Thai stir-fried noodles with shrimp, tofu, and peanuts.',
      image: 'https://example.com/padthai.jpg',
      price: '$11',
    },
    {
      name: 'Chicken Curry',
      description: 'Spicy Indian chicken curry with a rich, creamy sauce.',
      image: 'https://example.com/curry.jpg',
      price: '$15',
    },
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += 2; // Adjust speed by changing value
      }
    }, 20); // Adjust interval speed for smoother scrolling

    return () => clearInterval(scrollInterval); // Cleanup interval on unmount
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= 300; // Adjust scroll distance
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += 300; // Adjust scroll distance
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 flex justify-center items-center">
      <div className="relative w-full overflow-hidden">
        <h2 className="text-center text-4xl text-orange-400 font-bold mb-10">Popular Dishes</h2>
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide px-10 pb-8"
          style={{ scrollBehavior: 'smooth' }}
        >
          {dishes.map((dish, index) => (
            <div
              key={index}
              className="min-w-[300px] md:min-w-[350px] lg:min-w-[400px] bg-[#001F3F] rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              <img
                src={dish.image}
                alt={"no ome image"}
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-xl text-orange-400 font-bold">{dish.name}</h3>
                <p className="text-sm text-gray-300 mt-2">{dish.description}</p>
                <p className="text-orange-500 font-bold mt-4">{dish.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
          >
            &lt;
          </button>
        </div>

        {/* Right Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCarousel;
