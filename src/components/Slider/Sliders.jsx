import { useState, useEffect } from 'react';
import SliderItem from './SliderItem';
import './Sliders.css';

const Sliders = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/slider');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSlides(data);
        localStorage.setItem('slides', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching slides: ', error);
        const cachedSlides = localStorage.getItem('slides');
        if (cachedSlides) {
          setSlides(JSON.parse(cachedSlides));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = () => setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  const prevSlide = () => setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);

  if (isLoading) {
    return <div className="slider-loading">Loading slides...</div>; // Implement skeleton or spinner here
  }

  if (slides.length === 0) {
    return <div>No slides available</div>;
  }

  const currentSlide = slides[currentSlideIndex];
  const imageUrl = currentSlide ? currentSlide.imageUrl : '';
  const nextImageUrl = slides.length > 1 ? slides[(currentSlideIndex + 1) % slides.length].imageUrl : '';

  return (
    <section className="slider">
      <div className="slider-elements">
        {slides.length > 0 && (
          <>
            <link rel="preload" href={nextImageUrl} as="image" />
            <SliderItem
              key={imageUrl}
              imageUrl={imageUrl}
              loading="lazy"
              {...currentSlide}
            />
          </>
        )}
        <div className="slider-buttons">
          <button onClick={prevSlide}><i className="bi bi-chevron-left"></i></button>
          <button onClick={nextSlide}><i className="bi bi-chevron-right"></i></button>
        </div>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${currentSlideIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentSlideIndex(index)}
            >
              <span></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sliders;
