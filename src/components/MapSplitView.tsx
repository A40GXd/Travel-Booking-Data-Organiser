import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { ItineraryEvent } from '../types';

export interface TouristSpot {
  id: string;
  name: string;
  japaneseName: string;
  category: 'landmark' | 'temple' | 'tech' | 'market' | 'itinerary';
  categoryLabel: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: string;
  address: string;
  tagline: string;
  highlights: string[];
  bestTime: string;
  nearestStation: string;
  pnr?: string;
}

const FAMOUS_TOKYO_SPOTS: TouristSpot[] = [
  {
    id: 'spot-shibuya-crossing',
    name: 'Shibuya Scramble Crossing & Hachiko',
    japaneseName: '渋谷スクランブル交差点',
    category: 'landmark',
    categoryLabel: 'Iconic Landmark',
    lat: 35.6595,
    lng: 139.7005,
    rating: 4.8,
    reviewsCount: '84,000+',
    address: '2 Chome Dogenzaka, Shibuya City, Tokyo',
    tagline: 'The beating pulse of Tokyo with up to 3,000 people crossing every green light.',
    highlights: ['Hachiko Bronze Statue', 'Mag’s Park Rooftop View', 'Neon Cyberpunk Atmosphere'],
    bestTime: '19:00 - 22:00 (Night lights peak)',
    nearestStation: 'JR Shibuya Station (Hachiko Exit)',
  },
  {
    id: 'spot-sensoji',
    name: 'Sensō-ji Temple & Kaminarimon',
    japaneseName: '浅草寺・雷門',
    category: 'temple',
    categoryLabel: 'Ancient Temple & Heritage',
    lat: 35.7148,
    lng: 139.7967,
    rating: 4.7,
    reviewsCount: '65,000+',
    address: '2-3-1 Asakusa, Taito City, Tokyo',
    tagline: 'Tokyo’s oldest Buddhist temple founded in 645 AD, famed for the giant red lantern.',
    highlights: ['Kaminarimon Thunder Gate', 'Nakamise Shopping Dori', 'Five-Story Pagoda'],
    bestTime: '06:00 - 08:30 (Quiet morning stroll) or 20:00 (Illuminated)',
    nearestStation: 'Tokyo Metro Asakusa Station (Exit 1)',
  },
  {
    id: 'spot-skytree',
    name: 'Tokyo Skytree & Solamachi',
    japaneseName: '東京スカイツリー',
    category: 'landmark',
    categoryLabel: 'Skyline Observation',
    lat: 35.7101,
    lng: 139.8107,
    rating: 4.6,
    reviewsCount: '52,000+',
    address: '1-1-2 Oshiage, Sumida City, Tokyo',
    tagline: 'World’s tallest freestanding broadcast tower (634m) offering 360° Kanto plain panoramas.',
    highlights: ['Tembo Deck (350m)', 'Tembo Galleria (450m)', 'Mt. Fuji view on clear days'],
    bestTime: '16:30 (Sunset into dusk golden hour)',
    nearestStation: 'Oshiage (SKYTREE) Station',
  },
  {
    id: 'spot-tokyo-tower',
    name: 'Tokyo Tower',
    japaneseName: '東京タワー',
    category: 'landmark',
    categoryLabel: 'Retro Skyline Icon',
    lat: 35.6586,
    lng: 139.7454,
    rating: 4.5,
    reviewsCount: '71,000+',
    address: '4-2-8 Shibakoen, Minato City, Tokyo',
    tagline: 'The iconic 333m white and international-orange communications beacon of Showa romance.',
    highlights: ['Main Deck (150m)', 'Diamond Veil seasonal lighting', 'FootTown entertainment center'],
    bestTime: 'Sunset to midnight (Night illumination)',
    nearestStation: 'Akabanebashi Station or Onarimon Station',
  },
  {
    id: 'spot-meiji-shrine',
    name: 'Meiji Jingu Shrine & Forest',
    japaneseName: '明治神宮',
    category: 'temple',
    categoryLabel: 'Spiritual Sanctuary',
    lat: 35.6764,
    lng: 139.6993,
    rating: 4.7,
    reviewsCount: '48,000+',
    address: '1-1 Yoyogikamizonocho, Shibuya City, Tokyo',
    tagline: '170-acre man-made primeval forest containing 120,000 trees shielding a sacred Shinto shrine.',
    highlights: ['Massive Japanese Cypress Torii Gate', 'Sake Barrel Wall', 'Inner Garden Iris Field'],
    bestTime: 'Early morning (06:30 - 08:30)',
    nearestStation: 'JR Harajuku Station or Meiji-jingumae Station',
  },
  {
    id: 'spot-teamlab-borderless',
    name: 'teamLab Borderless (Azabudai Hills)',
    japaneseName: 'チームラボボーダレス',
    category: 'tech',
    categoryLabel: 'Digital Art & Tech',
    lat: 35.6605,
    lng: 139.7428,
    rating: 4.9,
    reviewsCount: '38,000+',
    address: 'Azabudai Hills Garden Plaza B B1F, 1-2-4 Azabudai, Minato-ku',
    tagline: 'A mapless world of boundary-pushing digital artworks that interact, transform, and influence one another.',
    highlights: ['Forest of Resonating Lamps', 'Infinite Crystal World', 'Bubble Universe'],
    bestTime: 'Advance ticket required; late morning slot',
    nearestStation: 'Kamiyacho Station (Direct underground exit)',
    pnr: 'PASS-TL-5519',
  },
  {
    id: 'spot-akihabara',
    name: 'Akihabara Electric Town',
    japaneseName: '秋葉原電気街',
    category: 'tech',
    categoryLabel: 'Tech, Anime & Subculture',
    lat: 35.6997,
    lng: 139.7714,
    rating: 4.5,
    reviewsCount: '45,000+',
    address: 'Sotokanda, Chiyoda City, Tokyo',
    tagline: 'Global ground-zero for retro computing, robotics components, maker culture, and Japanese anime lore.',
    highlights: ['Radio Kaikan', 'Yodobashi Camera Mega-Store', 'Super Potato Retro Arcade'],
    bestTime: '13:00 - 18:00 (Pedestrian zone on Sundays)',
    nearestStation: 'JR Akihabara Station (Electric Town Exit)',
  },
  {
    id: 'spot-shinjuku-gyoen',
    name: 'Shinjuku Gyoen National Garden',
    japaneseName: '新宿御苑',
    category: 'landmark',
    categoryLabel: 'Botanical Oasis',
    lat: 35.6852,
    lng: 139.7101,
    rating: 4.6,
    reviewsCount: '39,000+',
    address: '11 Naitomachi, Shinjuku City, Tokyo',
    tagline: 'Masterful blend of traditional Japanese landscape, English formal, and French formal garden styles.',
    highlights: ['Historic Taiwan Pavilion', 'Greenhouse botanical collection', 'Fall foliage & Momiji'],
    bestTime: '09:00 - 16:00 (Closed Mondays)',
    nearestStation: 'Shinjuku-gyoemmae Station (Exit 1)',
  },
  {
    id: 'spot-tsukiji-market',
    name: 'Tsukiji Outer Market',
    japaneseName: '築地場外市場',
    category: 'market',
    categoryLabel: 'Gastronomy & Street Food',
    lat: 35.6655,
    lng: 139.7708,
    rating: 4.5,
    reviewsCount: '41,000+',
    address: '4 Chome Tsukiji, Chuo City, Tokyo',
    tagline: 'Bustling food bazaar lined with hundreds of specialized fishmongers, wagyu stalls, and sushi counters.',
    highlights: ['Fresh Otoro Tuna Rice Bowls', 'Grilled Tamagoyaki Omelets', 'Japanese Chef Knives'],
    bestTime: '07:30 - 11:30 (Morning before stalls sell out)',
    nearestStation: 'Tsukiji Station or Tsukijishijo Station',
  },
  {
    id: 'spot-imperial-palace',
    name: 'Tokyo Imperial Palace & East Gardens',
    japaneseName: '皇居東御苑',
    category: 'temple',
    categoryLabel: 'Imperial Castle & Moats',
    lat: 35.6852,
    lng: 139.7528,
    rating: 4.6,
    reviewsCount: '35,000+',
    address: '1-1 Chiyoda, Chiyoda City, Tokyo',
    tagline: 'Primary residence of the Emperor of Japan, surrounded by massive stone ramparts and water moats.',
    highlights: ['Nijubashi Double Bridge', 'Edo Castle Tenshudai Foundation', 'Wadakura Fountain Park'],
    bestTime: '10:00 - 15:00 (Free entrance to East Gardens)',
    nearestStation: 'Tokyo Station (Marunouchi Exit) or Otemachi Station',
  },
  {
    id: 'spot-trunk-hotel',
    name: 'TRUNK(HOTEL) Yoyogi Park (Base)',
    japaneseName: 'トランクホテル 代々木公園',
    category: 'itinerary',
    categoryLabel: 'Your Expedition Base',
    lat: 35.6698,
    lng: 139.6881,
    rating: 4.8,
    reviewsCount: 'Expedition Base',
    address: '1-15-2 Tomigaya, Shibuya City, Tokyo',
    tagline: 'Boutique design retreat directly facing the greenery of Yoyogi Park with heated rooftop infinity pool.',
    highlights: ['Park View Balcony Suite', 'PIZZERIA e TRATTORIA L’OMBELICO', 'Digital Key Access'],
    bestTime: 'Check-in 15:00 · Digital NFC key active',
    nearestStation: 'Yoyogi-Koen Station or Yoyogi-Hachiman Station',
    pnr: 'TK-9921',
  },
  {
    id: 'spot-uobei-sushi',
    name: 'Uobei Sushi Dogenzaka (Reserved)',
    japaneseName: '魚べい 渋谷道玄坂店',
    category: 'itinerary',
    categoryLabel: 'Itinerary Dine Spot',
    lat: 35.6596,
    lng: 139.6975,
    rating: 4.4,
    reviewsCount: '8,200+',
    address: '2-29-11 Dogenzaka, Shibuya City, Tokyo',
    tagline: 'High-speed triple-tier bullet train conveyor sushi delivering fresh Nigiri directly to your touch screen seat.',
    highlights: ['Touchscreen ordering', 'Triple bullet train tracks', 'Seared Salmon with cheese'],
    bestTime: 'Reservation Day 1 at 20:00 JST',
    nearestStation: 'Shibuya Station',
    pnr: 'TC-8812',
  },
];

// Helper to calculate haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Inner camera pan component to manipulate Google Map instance smoothly
function MapCameraController({
  targetCoords,
}: {
  targetCoords: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (map && targetCoords) {
      map.panTo(targetCoords);
      map.setZoom(14);
    }
  }, [map, targetCoords]);

  return null;
}

interface MapSplitViewProps {
  onSelectEvent: (category: string, eventId: string) => void;
  events?: ItineraryEvent[];
}

export const MapSplitView: React.FC<MapSplitViewProps> = ({ onSelectEvent }) => {
  const GOOGLE_MAPS_API_KEY =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDSiWTkTMzu0nuqdeh6Afeqf2rUxLJlNe8';

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSpot, setActiveSpot] = useState<TouristSpot>(FAMOUS_TOKYO_SPOTS[0]);
  const [panTarget, setPanTarget] = useState<{ lat: number; lng: number } | null>(null);

  // Live Location State
  const [liveLocation, setLiveLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    heading: number | null;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isTrackingLive, setIsTrackingLive] = useState(false);

  // InfoWindow state
  const [infoWindowSpot, setInfoWindowSpot] = useState<TouristSpot | null>(null);

  // Request or toggle live location
  const handleRequestLiveLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring high-precision GPS telemetry...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          heading: pos.coords.heading,
        };
        setLiveLocation(coords);
        setIsLocating(false);
        setIsTrackingLive(true);
        setLocationStatus(`Locked GPS fix ±${coords.accuracy}m`);
        setPanTarget({ lat: coords.lat, lng: coords.lng });
      },
      (err) => {
        setIsLocating(false);
        setIsTrackingLive(false);
        let errorMsg = 'Failed to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied by browser. Check device settings.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = 'GPS satellite telemetry unavailable. Retrying with network tri-angulation.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'GPS positioning timed out. Please try again.';
        }
        setLocationStatus(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000,
      }
    );
  }, []);

  // Continuous live watch if tracking active
  useEffect(() => {
    if (!isTrackingLive || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLiveLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          heading: pos.coords.heading,
        });
      },
      (err) => {
        console.warn('Live tracking warning:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isTrackingLive]);

  // Center back on Tokyo Central
  const handleCenterTokyo = () => {
    setPanTarget({ lat: 35.6762, lng: 139.6993 });
  };

  // Filter spots
  const filteredSpots = useMemo(() => {
    if (selectedCategory === 'all') return FAMOUS_TOKYO_SPOTS;
    return FAMOUS_TOKYO_SPOTS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Distance from user to active spot
  const distanceToActiveSpot = useMemo(() => {
    if (!liveLocation) return null;
    return calculateDistanceKm(
      liveLocation.lat,
      liveLocation.lng,
      activeSpot.lat,
      activeSpot.lng
    );
  }, [liveLocation, activeSpot]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Controls Bento Bar */}
      <div className="bg-[#1a1c20] p-4 rounded-2xl border border-[#282a2e] flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#282a2e] border border-[#c3f400]/40 flex items-center justify-center text-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.25)]">
            <span className="material-symbols-outlined text-lg">map</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-['Space_Mono'] text-xs font-bold text-[#c3f400] uppercase tracking-wider">
                GOOGLE MAPS // LIVE TELEMETRY & TOURIST MATRIX
              </span>
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
            </div>
            <span className="font-['DM_Sans'] text-xs text-[#c4c9ac]">
              Explore Tokyo’s iconic landmarks, sacred heritage, subcultures, and your live position.
            </span>
          </div>
        </div>

        {/* Live Location Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestLiveLocation}
            disabled={isLocating}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-['DM_Sans'] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              liveLocation
                ? 'bg-[#1e2024] text-[#7df4ff] border border-[#7df4ff]/40 shadow-[0_0_12px_rgba(125,244,255,0.2)]'
                : 'bg-[#c3f400] text-[#161e00] hover:opacity-90 shadow-[0_0_14px_rgba(195,244,0,0.25)]'
            }`}
            type="button"
          >
            {isLocating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                <span>ACQUIRING GPS...</span>
              </>
            ) : liveLocation ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#7df4ff] animate-ping"></span>
                <span>GPS ACTIVE ({liveLocation.lat.toFixed(4)}, {liveLocation.lng.toFixed(4)})</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">my_location</span>
                <span>ENABLE LIVE GPS LOCATION</span>
              </>
            )}
          </button>

          <button
            onClick={handleCenterTokyo}
            className="p-2 rounded-full bg-[#1e2024] hover:bg-[#282a2e] text-[#c4c9ac] hover:text-white border border-[#282a2e] transition-colors cursor-pointer"
            title="Reset Center to Tokyo Hub"
            aria-label="Center on Tokyo"
            type="button"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Geolocation Telemetry Feedback Notice */}
      {locationStatus && (
        <div className="px-4 py-2 rounded-xl bg-[#1e2024] border border-[#282a2e] flex items-center justify-between text-xs font-['Space_Mono']">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#7df4ff]">satellite_alt</span>
            <span className="text-[#e2e2e8]">{locationStatus}</span>
          </div>
          {liveLocation && (
            <span className="text-[#c3f400] text-[11px] font-bold">
              ACCURACY: ±{liveLocation.accuracy} METERS
            </span>
          )}
        </div>
      )}

      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Tokyo Highlights (12)', icon: 'apps' },
          { id: 'landmark', label: 'Top Landmarks', icon: 'tower' },
          { id: 'temple', label: 'Heritage & Temples', icon: 'temple_buddhist' },
          { id: 'tech', label: 'Digital Art & Tech', icon: 'memory' },
          { id: 'market', label: 'Markets & Food', icon: 'restaurant' },
          { id: 'itinerary', label: 'Your Itinerary Pins', icon: 'flag' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-['DM_Sans'] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
              selectedCategory === tab.id
                ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] font-bold shadow-[0_0_12px_rgba(195,244,0,0.25)]'
                : 'bg-[#1a1c20] text-[#c4c9ac] border-[#282a2e] hover:border-[#333539] hover:text-[#e2e2e8]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Google Map Canvas + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Google Map Container with explicit height */}
        <div className="lg:col-span-8 bg-[#0c0e12] rounded-3xl border border-[#282a2e] p-2 relative min-h-[520px] h-[580px] overflow-hidden shadow-2xl flex flex-col">
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={{ lat: 35.6762, lng: 139.6993 }}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              gestureHandling="greedy"
              disableDefaultUI={false}
              style={{ width: '100%', height: '100%', borderRadius: '1.25rem' }}
            >
              <MapCameraController targetCoords={panTarget} />

              {/* Live Location Marker if enabled */}
              {liveLocation && (
                <AdvancedMarker
                  position={{ lat: liveLocation.lat, lng: liveLocation.lng }}
                  title="Your Live Location"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-[#7df4ff]/40 animate-ping"></span>
                    <span className="absolute w-5 h-5 rounded-full bg-[#7df4ff]/60 animate-pulse"></span>
                    <div className="w-4 h-4 rounded-full bg-[#7df4ff] border-2 border-white shadow-[0_0_12px_#7df4ff]"></div>
                  </div>
                </AdvancedMarker>
              )}

              {/* Famous Tourist Spot Markers */}
              {filteredSpots.map((spot) => {
                const isSelected = activeSpot.id === spot.id;
                const isItinerary = spot.category === 'itinerary';
                const isTech = spot.category === 'tech';

                return (
                  <AdvancedMarker
                    key={spot.id}
                    position={{ lat: spot.lat, lng: spot.lng }}
                    onClick={() => {
                      setActiveSpot(spot);
                      setInfoWindowSpot(spot);
                      setPanTarget({ lat: spot.lat, lng: spot.lng });
                    }}
                    title={spot.name}
                  >
                    <Pin
                      background={
                        isSelected ? '#c3f400' : isItinerary ? '#ddb7ff' : isTech ? '#7df4ff' : '#1e2024'
                      }
                      borderColor={isSelected ? '#161e00' : '#ffffff'}
                      glyphColor={
                        isSelected ? '#161e00' : isItinerary ? '#111317' : isTech ? '#111317' : '#c3f400'
                      }
                      scale={isSelected ? 1.25 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}

              {/* Info Window on Selected Marker */}
              {infoWindowSpot && (
                <InfoWindow
                  position={{ lat: infoWindowSpot.lat, lng: infoWindowSpot.lng }}
                  onCloseClick={() => setInfoWindowSpot(null)}
                >
                  <div className="p-1 max-w-xs text-neutral-900 font-['DM_Sans']">
                    <div className="font-bold text-sm text-neutral-950 flex items-center justify-between gap-2">
                      <span>{infoWindowSpot.name}</span>
                      <span className="text-amber-500 font-bold text-xs">★ {infoWindowSpot.rating}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 font-['Space_Mono'] mt-0.5">
                      {infoWindowSpot.japaneseName}
                    </div>
                    <p className="text-xs text-neutral-700 mt-1 line-clamp-2">
                      {infoWindowSpot.tagline}
                    </p>
                    <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500 font-['Space_Mono']">
                        {infoWindowSpot.nearestStation}
                      </span>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${infoWindowSpot.lat},${infoWindowSpot.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Directions →
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Floating Map HUD overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] bg-[#111317]/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#282a2e] shadow-md pointer-events-auto">
              TOKYO VECTORS · {filteredSpots.length} SPOTS VISIBLE
            </span>
            <span className="font-['Space_Mono'] text-[10px] text-[#c3f400] bg-[#111317]/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#282a2e] shadow-md pointer-events-auto">
              CLICK PINS FOR TOURIST DOSSIER
            </span>
          </div>
        </div>

        {/* Selected Tourist Spot Detailed Dossier Card */}
        <div className="lg:col-span-4 bg-[#1a1c20] rounded-3xl border border-[#282a2e] p-5 flex flex-col justify-between gap-4 shadow-xl">
          <div className="flex flex-col gap-3.5">
            {/* Header / Category Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-1 rounded-full font-['Space_Mono'] text-[10px] uppercase font-bold tracking-wider ${
                  activeSpot.category === 'itinerary'
                    ? 'bg-[#ddb7ff]/20 text-[#ddb7ff] border border-[#ddb7ff]/30'
                    : activeSpot.category === 'tech'
                    ? 'bg-[#7df4ff]/20 text-[#7df4ff] border border-[#7df4ff]/30'
                    : 'bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30'
                }`}
              >
                {activeSpot.categoryLabel}
              </span>
              <div className="flex items-center gap-1 font-['Space_Mono'] text-xs font-bold text-amber-400">
                <span className="material-symbols-outlined text-sm">star</span>
                <span>{activeSpot.rating}</span>
                <span className="text-[#c4c9ac] text-[10px] font-normal">({activeSpot.reviewsCount})</span>
              </div>
            </div>

            {/* Spot Names & Tagline */}
            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#e2e2e8] leading-tight">
                {activeSpot.name}
              </h3>
              <span className="font-['Space_Mono'] text-xs text-[#c3f400]">
                {activeSpot.japaneseName}
              </span>
              <p className="font-['DM_Sans'] text-xs text-[#c4c9ac] mt-2 leading-relaxed">
                {activeSpot.tagline}
              </p>
            </div>

            {/* Live Distance Gauge from User's Location */}
            <div className="p-3.5 rounded-2xl bg-[#111317] border border-[#282a2e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1a1c20] flex items-center justify-center text-[#7df4ff]">
                  <span className="material-symbols-outlined text-lg">route</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase">
                    DISTANCE FROM LIVE GPS
                  </span>
                  <span className="font-['Space_Mono'] text-sm font-bold text-[#e2e2e8]">
                    {distanceToActiveSpot !== null
                      ? `${distanceToActiveSpot} KM AWAY`
                      : 'ENABLE GPS TO MEASURE'}
                  </span>
                </div>
              </div>

              {liveLocation ? (
                <span className="w-2.5 h-2.5 rounded-full bg-[#7df4ff] animate-ping" title="Live tracking active"></span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestLiveLocation}
                  className="px-2 py-1 rounded-lg bg-[#282a2e] hover:bg-[#333539] text-[#7df4ff] font-['Space_Mono'] text-[10px] font-bold cursor-pointer"
                >
                  Locate
                </button>
              )}
            </div>

            {/* Highlights List */}
            <div className="flex flex-col gap-1.5">
              <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac] uppercase tracking-wider">
                EXPLORER HIGHLIGHTS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeSpot.highlights.map((hl) => (
                  <span
                    key={hl}
                    className="px-2.5 py-1 rounded-lg bg-[#111317] text-[#e2e2e8] font-['DM_Sans'] text-xs border border-[#282a2e]"
                  >
                    ✦ {hl}
                  </span>
                ))}
              </div>
            </div>

            {/* Best Timing & Station Info */}
            <div className="p-3 rounded-2xl bg-[#111317] border border-[#282a2e] flex flex-col gap-1.5 font-['Space_Mono'] text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#c4c9ac] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  OPTIMAL TIME
                </span>
                <span className="text-[#c3f400] text-right font-medium">{activeSpot.bestTime}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e2024]">
                <span className="text-[#c4c9ac] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">train</span>
                  ACCESS
                </span>
                <span className="text-[#7df4ff] text-right font-medium">{activeSpot.nearestStation}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Direct Route & HUD Lock */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e2024]">
            <a
              href={
                liveLocation
                  ? `https://www.google.com/maps/dir/?api=1&origin=${liveLocation.lat},${liveLocation.lng}&destination=${activeSpot.lat},${activeSpot.lng}`
                  : `https://www.google.com/maps/dir/?api=1&destination=${activeSpot.lat},${activeSpot.lng}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_16px_rgba(195,244,0,0.3)] text-center"
            >
              <span className="material-symbols-outlined text-sm font-bold">directions</span>
              <span>
                {liveLocation ? 'Get Turn-By-Turn Route from GPS' : 'Open in Google Maps Navigation'}
              </span>
            </a>

            <button
              onClick={() => onSelectEvent(activeSpot.category, activeSpot.id)}
              className="w-full py-2.5 rounded-2xl bg-[#111317] hover:bg-[#282a2e] text-[#e2e2e8] font-['DM_Sans'] text-xs font-medium border border-[#282a2e] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm text-[#c3f400]">radar</span>
              <span>Lock on HUD Inspector</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
