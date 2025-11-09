"use client";
import { useState, useEffect } from "react";
import Navbar from "../navBar/page.jsx";
import InfiniteCarousel from '../Components/InfiniteCarousel';
import PopupModal from "../Components/PopupModal";

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    getUserLocation();
  }, []);

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          loadSponsors(location.lat, location.lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Showing all sponsors.');
          loadSponsors();
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      loadSponsors();
    }
  }

  async function loadSponsors(lat = null, lng = null) {
    try {
      let url = `${API_URL}/api/sponsors`;
      if (lat && lng) {
        url += `?lat=${lat}&lng=${lng}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setSponsors(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading sponsors:', error);
      setLoading(false);
    }
  }

  function initMap() {
    if (!window.google || !userLocation) return;

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: userLocation,
      zoom: 14,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // User location marker
    new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Your Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4CAF50',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      }
    });

    // Sponsor markers
    sponsors.forEach(sponsor => {
      const marker = new window.google.maps.Marker({
        position: { lat: sponsor.lat, lng: sponsor.lng },
        map: map,
        title: sponsor.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10b981',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        setSelectedSponsor(sponsor);
      });
    });
  }

  useEffect(() => {
    if (!loading && sponsors.length > 0) {
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (userLocation) {
          initMap();
        }
      };
      document.head.appendChild(script);
    }
  }, [loading, sponsors, userLocation]);

  const categories = ['All', ...new Set(sponsors.map(s => s.category))];
  const filteredSponsors = selectedCategory === 'All' 
    ? sponsors 
    : sponsors.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading sponsors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-0">
          <h1 className="text-3xl font-bold text-gray-900">Partner Sponsors</h1>
          <p className="text-gray-600 mt-1">Discover nearby locations and exclusive offers</p>
        </div>

  <InfiniteCarousel height={200} speed={1}/>


        {locationError && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
            {locationError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div 
                id="map" 
                className="w-full h-96 bg-gray-200 flex items-center justify-center"
              >
                {!userLocation ? (
                  <div className="text-gray-600 text-center p-8">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">Map View</p>
                    <p className="text-sm mt-2">Allow location access to see sponsors on map</p>
                  </div>
                ) : (
                  <div className="text-gray-600">Loading map...</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedSponsor && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedSponsor.name}</h3>
                  <button 
                    onClick={() => setSelectedSponsor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Category</div>
                    <div className="text-gray-600">{selectedSponsor.category}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700">Address</div>
                    <div className="text-gray-600">{selectedSponsor.address}</div>
                  </div>
                  
                  {selectedSponsor.distance && (
                    <div>
                      <div className="font-medium text-gray-700">Distance</div>
                      <div className="text-gray-600">{selectedSponsor.distance} km away</div>
                    </div>
                  )}
                  
                  <div>
                    <div className="font-medium text-gray-700">Phone</div>
                    <div className="text-gray-600">{selectedSponsor.phone}</div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="font-medium text-green-700 mb-2">Exclusive Offer</div>
                    <div className="bg-green-50 p-3 rounded-lg text-green-800">
                      {selectedSponsor.offers}
                    </div>
                  </div>
                </div>

                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSponsor.lat},${selectedSponsor.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
                >
                  Get Directions
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSponsors.map(sponsor => (
            <div 
              key={sponsor.id}
              onClick={() => setSelectedSponsor(sponsor)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{sponsor.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">{sponsor.category}</div>
                </div>
                {sponsor.distance && (
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {sponsor.distance} km
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-3">
                {sponsor.address}
              </div>

              <div className="bg-green-50 rounded-lg p-3 mb-3">
                <div className="text-xs font-medium text-green-700 mb-1">Special Offer</div>
                <div className="text-sm text-green-800">{sponsor.offers}</div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">{sponsor.phone}</div>
                <button className="text-green-600 hover:text-green-700 font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSponsors.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No sponsors found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}