'use client';
////////////// USE IT LIKE THIS ///////////////////////
///    import InfiniteCarousel from '../Components/InfiniteCarousel';
///
///    <InfiniteCarousel height={200} speed={1}/> 
///
//////////////////////



import React, { useRef, useEffect } from 'react';
import Link from "next/link";

const events = [
  {
    Name: 'McDonald', img: "../Images/McDonald's_logo.png", link: 'https://www.mcdonalds.com/', bgColor: "red"},
  { Name: "Wendy's", img: "../Images/Wendy's_logo.png", link: 'https://www.wendys.com/', bgColor: "red"},
  { Name: 'KFC', img: "../Images/kfc_img.png", link: 'https://www.kfc.co.uk/', bgColor: "red"},
  { Name: 'Burger King', img: "../Images/Burger_King_img.png", link: 'https://www.burgerking.co.uk/', bgColor: "red"},
  { Name: "Amazon", img: "../Images/Amazon_logo.png", link: "https://www.amazon.co.uk/", bgColor: "orange"},
  { Name: "Asos", img: "../Images/Asos_logo.png", link: "https://www.asos.com/", bgColor: "yellow"},
  { Name: "Apple", img: "../Images/apple_logo.png", link: "https://www.apple.com/uk/", bgColor: "lightblue"},
  { Name: "Deliveroo", img: "../Images/deliveroo_logo.png", link: "https://deliveroo.co.uk/", bgColor: "lightgreen"},
  { Name: "Wagamama", img: "../Images/wagamama_logo.png", link: "https://www.wagamama.com/", bgColor: "red"},
  // Add more events as needed 
  // { Name: "", img: "../Images/", link: ""},
];

const InfiniteCarousel = ({ speed = 1, cardWidth = 200, gap = 20 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let animationId;

    const scroll = () => {
      if (!container) return;

      container.scrollLeft += speed;

      // Reset scroll when reaching half of the scrollWidth
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [speed]);

  // Duplicate events for seamless looping
  const allEvents = [...events, ...events, ...events, ...events];

  return (
    <>
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          overflowX: 'hidden',
          width: '100%',
          gap: `${gap}px`,
          padding: '20px 0',
        }}
      >
        {allEvents.map((event, index) => (
          <div
            key={index}
            style={{
              flex: '0 0 auto',
              width: `${cardWidth}px`,
              backgroundColor: event.bgColor,
              border: '2px solid rgba(183,148,165,0.9)',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            <Link href={event.link}>
              <img
                src={event.img}
                alt={`${event.Name} LOGO`}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  objectFit: 'cover',
                  marginRight: '10px',
                }}
              />
            </Link>
            <div style={{ 
  whiteSpace: 'nowrap', 
  textAlign: 'center' 
}}>
  <Link href={event.link}>
    <h1 style={{ fontSize: '1rem', color: 'black' }}>
      {event.Name}
    </h1>
  </Link>

  {/* <h2 style={{ fontSize: '0.8rem', color: 'gray' }}>{event.attendees} attendees</h2> */}

  {event.link && (
    <a
      href={event.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#f72585',
        textDecoration: 'underline',
        fontSize: '0.8rem',
        display: 'block',
        marginTop: '4px'
      }}
    >
    </a>
  )}
</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InfiniteCarousel;