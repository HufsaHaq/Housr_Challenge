'use client';

import React, { useRef, useEffect } from 'react';

const events = [
  {
    Name: 'McDonald',
    attendees: 200,
    img: "../Images/McDonald's_logo.png",
    link: 'https://2016fgreatunihack.devpost.com/',
    bgColor: '#f9e7c6'
  },
  {
    Name: "Wendy's",
    attendees: 130,
    img: "../Images/Wendy's_logo.png",
    link: 'https://greatunihack17.devpost.com/',
    bgColor: 'black'
  },
  {
    Name: 'KFC',
    attendees: 225,
    img: "../Images/kfc_img.png",
    link: 'https://greatunihack.devpost.com/',
    bgColor: 'black'
  },
  {
    Name: 'Burger King',
    attendees: 218,
    img: "../Images/Burger_King_img.png",
    link: 'https://greatunihack19.devpost.com/',
    bgColor: '#f0efed'
  },
  // Add more events as needed
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
              backgroundColor: 'black',
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
            <img
              src={event.img}
              alt={`${event.year} LOGO`}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '4px',
                backgroundColor: event.bgColor || 'black',
                objectFit: 'cover',
                marginRight: '10px',
              }}
            />
            <div style={{ whiteSpace: 'nowrap' }}>
              <h1 style={{ fontSize: '1rem', color: 'white' }}>{event.Name}</h1>
              <h2 style={{ fontSize: '0.8rem', color: 'gray' }}>{event.attendees} attendees</h2>
              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#f72585',
                    textDecoration: 'underline',
                    fontSize: '0.8rem',
                  }}
                >
                  View Event
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
        &lt;-- Swipe to see more --&gt;
      </h1>
    </>
  );
};

export default InfiniteCarousel;


// "use client"; // required for React hooks
// import React, { useEffect, useRef } from 'react';

// const events = [
//   {
//     year: '2016',
//     attendees: 200,
//     img: "../Images/McDonald's_img.svg",
//     link: 'https://2016fgreatunihack.devpost.com/',
//     bgColor: '#f9e7c6'
//   },
//   {
//     year: '2017',
//     attendees: 130,
//     img: "../Images/Wendy's_img.svg",
//     link: 'https://greatunihack17.devpost.com/',
//     bgColor: 'black'
//   },
//   {
//     year: '2018',
//     attendees: 225,
//     img: "../Images/kfc_img.png",
//     link: 'https://greatunihack.devpost.com/',
//     bgColor: 'black'
//   },
//   {
//     year: '2019',
//     attendees: 218,
//     img: "../Images/Burger_King_img.png",
//     link: 'https://greatunihack19.devpost.com/',
//     bgColor: '#f0efed'
//   },
//   // Add more events as needed
// ];

// const InfiniteCarousel = ({ speed = 1, cardWidth = 200, gap = 20 }) => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     let animationId;

//     const scroll = () => {
//       if (!container) return;
//       container.scrollLeft += speed;

//       // Infinite scroll effect
//       if (container.scrollLeft >= container.scrollWidth / 2) {
//         container.scrollLeft = 0;
//       }

//       animationId = requestAnimationFrame(scroll);
//     };

//     animationId = requestAnimationFrame(scroll);

//     return () => cancelAnimationFrame(animationId);
//   }, [speed]);

//   // Duplicate events array for seamless scrolling
//   const allEvents = [...events, ...events];

//   return (
//     <>
//       <div
//         ref={containerRef}
//         style={{
//           display: 'flex',
//           overflowX: 'hidden',
//           width: '100%',
//           gap: `${gap}px`,
//           padding: '20px 0',
//         }}
//       >
//         {allEvents.map((event, index) => (
//           <div
//             key={index}
//             style={{
//               flex: '0 0 auto',
//               width: `${cardWidth}px`,
//               backgroundColor: 'black',
//               border: '2px solid rgba(183,148,165,0.9)',
//               borderRadius: '12px',
//               boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
//               overflow: 'hidden',
//               display: 'flex',
//               flexDirection: 'row',
//               alignItems: 'center',
//               padding: '10px',
//             }}
//           >
//             <img
//               src={event.img}
//               alt={`${event.year} LOGO`}
//               style={{
//                 width: '60px',
//                 height: '60px',
//                 borderRadius: '4px',
//                 backgroundColor: event.bgColor || 'black',
//                 objectFit: 'cover',
//                 marginRight: '10px',
//               }}
//             />
//             <div style={{ whiteSpace: 'nowrap' }}>
//               <h1 style={{ fontSize: '1rem', color: 'white' }}>GUH {event.year}</h1>
//               <h2 style={{ fontSize: '0.8rem', color: 'gray' }}>{event.attendees} attendees</h2>
//               {event.link && (
//                 <a
//                   href={event.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{
//                     color: '#f72585',
//                     textDecoration: 'underline',
//                     fontSize: '0.8rem',
//                   }}
//                 >
//                   View Event
//                 </a>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//       <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
//         &lt;-- Swipe to see more --&gt;
//       </h1>
//     </>
//   );
// };

// export default InfiniteCarousel;
