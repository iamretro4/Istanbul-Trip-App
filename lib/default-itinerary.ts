import { Trip, Activity, Day } from './types';
import { TAKS_INN_HOTEL, ISTANBUL_SUGGESTIONS } from './istanbul-data';
import { format } from 'date-fns';

// Get tomorrow's date
const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

// Get Tuesday (4 days after tomorrow)
const getTuesday = (startDate: Date) => {
  const tuesday = new Date(startDate);
  tuesday.setDate(startDate.getDate() + 4); // Tuesday is 4 days after tomorrow (if tomorrow is Friday)
  tuesday.setHours(23, 59, 59, 999);
  return tuesday;
};

export function createDefaultItinerary(): Trip {
  const tomorrow = getTomorrow();
  const tuesday = getTuesday(tomorrow);
  
  const days: Record<string, Day> = {};
  
  // Day 1 (Tomorrow) - Bazaars and Local Markets
  const day1 = new Date(tomorrow);
  const day1Key = format(day1, 'yyyy-MM-dd');
  days[day1Key] = {
    date: day1.toISOString(),
    activities: [
      {
        id: 'day1-1',
        name: 'Kadıköy Produce Market',
        description: 'Wander through this bustling market to sample fresh produce, cheeses, and traditional Turkish delicacies. Excellent spot to interact with local vendors.',
        location: { lat: 40.9900, lng: 29.0200, address: 'Kadıköy Market, Kadıköy' },
        category: 'bazaar',
        neighborhood: 'Kadıköy',
        startTime: '09:00',
        duration: 90,
      },
      {
        id: 'day1-2',
        name: 'Yeldeğirmeni Neighborhood',
        description: 'Vibrant neighborhood renowned for its graffiti art, independent boutiques, and cozy cafes. Hub for young locals.',
        location: { lat: 40.9850, lng: 29.0250, address: 'Yeldeğirmeni, Kadıköy' },
        category: 'sightseeing',
        neighborhood: 'Kadıköy',
        startTime: '11:00',
        duration: 120,
      },
      {
        id: 'day1-3',
        name: 'Moda Neighborhood',
        description: 'Stroll to Moda area, known for its seaside promenade and artisanal shops. Enjoy Turkish coffee overlooking the Marmara Sea.',
        location: { lat: 40.9800, lng: 29.0300, address: 'Moda, Kadıköy' },
        category: 'sightseeing',
        neighborhood: 'Moda',
        startTime: '14:00',
        duration: 180,
      },
      {
        id: 'day1-4',
        name: 'Grand Bazaar (Kapali Carsi)',
        description: 'Historic covered market with thousands of shops. Visit SARK KAHVESI for coffee/tea and HAVUZLU restaurant for traditional food.',
        location: { lat: 41.0106, lng: 28.9681, address: 'Grand Bazaar, Fatih' },
        category: 'bazaar',
        neighborhood: 'Fatih',
        startTime: '17:00',
        duration: 120,
      },
      {
        id: 'day1-5',
        name: 'Spice Bazaar (Misir Carsi)',
        description: 'Colorful bazaar specializing in spices, Turkish delight, and local products.',
        location: { lat: 41.0168, lng: 28.9706, address: 'Spice Bazaar, Eminonu' },
        category: 'bazaar',
        neighborhood: 'Eminonu',
        startTime: '19:00',
        duration: 60,
      },
    ],
  };

  // Day 2 - Asian Side
  const day2 = new Date(tomorrow);
  day2.setDate(tomorrow.getDate() + 1);
  const day2Key = format(day2, 'yyyy-MM-dd');
  days[day2Key] = {
    date: day2.toISOString(),
    activities: [
      {
        id: 'day2-1',
        name: 'Ferry: Eminönü to Kadıköy',
        description: 'Take the ferry across the Bosphorus to experience the Asian side. Beautiful views and authentic local experience.',
        location: { lat: 41.0204, lng: 28.9734, address: 'Eminönü Ferry Terminal' },
        category: 'transport',
        neighborhood: 'Eminonu',
        startTime: '09:00',
        duration: 30,
      },
      {
        id: 'day2-2',
        name: 'Kuzguncuk Neighborhood',
        description: 'Charming area with colorful houses, art galleries, and organic markets. Delightful place for a leisurely walk.',
        location: { lat: 41.0300, lng: 29.0100, address: 'Kuzguncuk, Üsküdar' },
        category: 'sightseeing',
        neighborhood: 'Kuzguncuk',
        startTime: '10:00',
        duration: 150,
      },
      {
        id: 'day2-3',
        name: 'Beylerbeyi Palace',
        description: 'Lesser-known Ottoman palace on the Asian shore, offering insights into the sultans\' summer retreats with fewer crowds.',
        location: { lat: 41.0430, lng: 29.0410, address: 'Beylerbeyi Palace, Üsküdar' },
        category: 'landmark',
        neighborhood: 'Üsküdar',
        startTime: '13:00',
        duration: 120,
      },
      {
        id: 'day2-4',
        name: 'Çiya Sofrası',
        description: 'Renowned restaurant offering regional Anatolian dishes. Must-try for authentic Turkish cuisine.',
        location: { lat: 40.9900, lng: 29.0200, address: 'Çiya Sofrası, Kadıköy' },
        category: 'restaurant',
        neighborhood: 'Kadıköy',
        startTime: '15:30',
        duration: 90,
      },
      {
        id: 'day2-5',
        name: 'Kemerburgaz City Forest',
        description: 'Nature escape with walking trails, bike paths, and picnic areas. Favorite among locals seeking tranquility.',
        location: { lat: 41.1500, lng: 28.9000, address: 'Kemerburgaz City Forest' },
        category: 'sightseeing',
        neighborhood: 'Kemerburgaz',
        startTime: '17:30',
        duration: 180,
      },
    ],
  };

  // Day 3 - Landmarks with Local Twist
  const day3 = new Date(tomorrow);
  day3.setDate(tomorrow.getDate() + 2);
  const day3Key = format(day3, 'yyyy-MM-dd');
  days[day3Key] = {
    date: day3.toISOString(),
    activities: [
      {
        id: 'day3-1',
        name: 'Hagia Sophia',
        description: 'Explore the upper gallery exhibition on interfaith history. Get VIP pass to avoid queues.',
        location: { lat: 41.0086, lng: 28.9802, address: 'Hagia Sophia, Sultanahmet' },
        category: 'landmark',
        neighborhood: 'Sultanahmet',
        startTime: '09:00',
        duration: 90,
        website: 'http://ayasofyamuzesi.gov.tr/',
      },
      {
        id: 'day3-2',
        name: 'Topkapi Palace',
        description: 'Large Ottoman palace complex. VIP pass recommended to avoid queues. Visit KONYALI restaurant in the garden.',
        location: { lat: 41.0117, lng: 28.9850, address: 'Topkapi Palace, Sultanahmet' },
        category: 'landmark',
        neighborhood: 'Sultanahmet',
        startTime: '11:00',
        duration: 180,
        website: 'http://www.topkapisarayi.gov.tr/tr',
      },
      {
        id: 'day3-3',
        name: 'KONYALI Restaurant',
        description: 'Restaurant in Topkapi Palace garden with great food and atmosphere.',
        location: { lat: 41.0117, lng: 28.9850, address: 'KONYALI Restaurant, Topkapi Palace' },
        category: 'restaurant',
        neighborhood: 'Sultanahmet',
        startTime: '14:00',
        duration: 90,
      },
      {
        id: 'day3-4',
        name: 'Yerebatan Cistern',
        description: 'Ancient underground water reservoir with beautiful columns and atmosphere.',
        location: { lat: 41.0084, lng: 28.9778, address: 'Yerebatan Cistern, Sultanahmet' },
        category: 'sightseeing',
        neighborhood: 'Sultanahmet',
        startTime: '16:00',
        duration: 60,
        website: 'http://yerebatan.com/',
      },
      {
        id: 'day3-5',
        name: 'Blue Mosque (Sultan Ahmet Camii)',
        description: 'Famous Ottoman mosque with beautiful blue tiles and architecture.',
        location: { lat: 41.0054, lng: 28.9769, address: 'Blue Mosque, Sultanahmet' },
        category: 'landmark',
        neighborhood: 'Sultanahmet',
        startTime: '17:30',
        duration: 60,
        website: 'http://www.bluemosque.co/',
      },
    ],
  };

  // Day 4 - Creative Activities
  const day4 = new Date(tomorrow);
  day4.setDate(tomorrow.getDate() + 3);
  const day4Key = format(day4, 'yyyy-MM-dd');
  days[day4Key] = {
    date: day4.toISOString(),
    activities: [
      {
        id: 'day4-1',
        name: 'Galata Tower',
        description: 'Historic tower with panoramic views. Picturesque area with narrow streets and charming atmosphere.',
        location: { lat: 41.0256, lng: 28.9744, address: 'Galata Tower, Galata' },
        category: 'landmark',
        neighborhood: 'Galata',
        startTime: '09:00',
        duration: 90,
      },
      {
        id: 'day4-2',
        name: 'Galata Port & Istanbul Modern',
        description: 'Modern port area with Istanbul Modern art museum and waterfront views.',
        location: { lat: 41.0256, lng: 28.9744, address: 'Galata Port, Karakoy' },
        category: 'museum',
        neighborhood: 'Galata',
        startTime: '11:00',
        duration: 120,
        website: 'https://galataport.com/',
      },
      {
        id: 'day4-3',
        name: 'Galata Bridge & Fish Sandwich',
        description: 'Walk across Galata Bridge. Try traditional fish sandwich (balık ekmek) from vendors underneath.',
        location: { lat: 41.0204, lng: 28.9734, address: 'Galata Bridge, Eminonu' },
        category: 'food',
        neighborhood: 'Eminonu',
        startTime: '13:30',
        duration: 90,
      },
      {
        id: 'day4-4',
        name: 'Hamdi Restaurant',
        description: 'Excellent Turkish cuisine restaurant in Eminonu area.',
        location: { lat: 41.0180, lng: 28.9700, address: 'Hamdi Restaurant, Eminonu' },
        category: 'restaurant',
        neighborhood: 'Eminonu',
        startTime: '15:00',
        duration: 90,
        website: 'http://hamdi.com.tr/el/eminonu',
      },
      {
        id: 'day4-5',
        name: 'Istiklal Caddesi & Cihangir',
        description: 'Famous pedestrian shopping street. Explore Cihangir neighborhood for cafes, bars, and great atmosphere.',
        location: { lat: 41.0369, lng: 28.9850, address: 'Istiklal Caddesi, Beyoglu' },
        category: 'shopping',
        neighborhood: 'Beyoglu',
        startTime: '17:00',
        duration: 180,
      },
      {
        id: 'day4-6',
        name: '5.ci Kat or SUR BALIK CIHANGIR',
        description: 'Evening in Cihangir - bar/restaurant for drinks and food. Perfect for nightlife.',
        location: { lat: 41.0300, lng: 28.9800, address: 'Cihangir, Beyoglu' },
        category: 'nightlife',
        neighborhood: 'Cihangir',
        startTime: '20:00',
        duration: 180,
      },
    ],
  };

  // Day 5 (Tuesday) - Bosphorus & Final Day
  const day5Key = format(tuesday, 'yyyy-MM-dd');
  days[day5Key] = {
    date: tuesday.toISOString(),
    activities: [
      {
        id: 'day5-1',
        name: 'Ortakoy',
        description: 'Beautiful Bosphorus neighborhood with waterfront cafes and the famous Ortakoy Mosque.',
        location: { lat: 41.0473, lng: 29.0247, address: 'Ortakoy, Besiktas' },
        category: 'sightseeing',
        neighborhood: 'Ortakoy',
        startTime: '09:00',
        duration: 120,
      },
      {
        id: 'day5-2',
        name: 'Bebek',
        description: 'Upscale Bosphorus neighborhood with nice fish restaurants and waterfront promenade.',
        location: { lat: 41.0778, lng: 29.0433, address: 'Bebek, Besiktas' },
        category: 'sightseeing',
        neighborhood: 'Bebek',
        startTime: '11:30',
        duration: 150,
      },
      {
        id: 'day5-3',
        name: 'Bebek Fish Restaurants',
        description: 'Lunch at excellent fish restaurants in Bebek area.',
        location: { lat: 41.0778, lng: 29.0433, address: 'Bebek Fish Restaurants, Bebek' },
        category: 'restaurant',
        neighborhood: 'Bebek',
        startTime: '14:00',
        duration: 90,
        website: 'http://www.bebekbalikci.net/#',
      },
      {
        id: 'day5-4',
        name: 'Tarabya & KIYI Restaurant',
        description: 'Visit Tarabya area and enjoy excellent fish restaurant with beautiful Bosphorus views.',
        location: { lat: 41.1100, lng: 29.0500, address: 'KIYI Restaurant, Tarabya' },
        category: 'restaurant',
        neighborhood: 'Tarabya',
        startTime: '16:00',
        duration: 180,
        website: 'http://www.kiyi.com.tr/',
      },
      {
        id: 'day5-5',
        name: 'Nisantasi Shopping',
        description: 'Upscale area (like Kolonaki) with expensive shops, modern cafes and restaurants.',
        location: { lat: 41.0470, lng: 28.9850, address: 'Nisantasi, Sisli' },
        category: 'shopping',
        neighborhood: 'Nisantasi',
        startTime: '19:00',
        duration: 120,
      },
    ],
  };

  return {
    id: 'istanbul-trip-2025',
    name: 'Istanbul Trip 2025',
    startDate: tomorrow.toISOString(),
    endDate: tuesday.toISOString(),
    days,
    budget: {
      total: 0,
      expenses: [],
    },
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hotelLocation: TAKS_INN_HOTEL,
  };
}

