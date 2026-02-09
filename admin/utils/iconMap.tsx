import React from "react";
import * as Io5 from "react-icons/io5";

// A curated list of icons useful for a travel/tourism app
// We map the string name (as used in mobile app) to the React Icon component
export const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  // General
  "grid-outline": Io5.IoGridOutline,
  "home-outline": Io5.IoHomeOutline,
  "search-outline": Io5.IoSearchOutline,
  "heart-outline": Io5.IoHeartOutline,
  "person-outline": Io5.IoPersonOutline,
  "settings-outline": Io5.IoSettingsOutline,
  "information-circle-outline": Io5.IoInformationCircleOutline,
  "alert-circle-outline": Io5.IoAlertCircleOutline,
  "checkmark-circle-outline": Io5.IoCheckmarkCircleOutline,
  "close-circle-outline": Io5.IoCloseCircleOutline,

  // Travel & Places
  "location-outline": Io5.IoLocationOutline,
  "map-outline": Io5.IoMapOutline,
  "compass-outline": Io5.IoCompassOutline,
  "navigate-outline": Io5.IoNavigateOutline,
  "airplane-outline": Io5.IoAirplaneOutline,
  "bus-outline": Io5.IoBusOutline,
  "car-outline": Io5.IoCarOutline,
  "bicycle-outline": Io5.IoBicycleOutline,
  "boat-outline": Io5.IoBoatOutline,
  "train-outline": Io5.IoTrainOutline,
  "flag-outline": Io5.IoFlagOutline,
  "earth-outline": Io5.IoEarthOutline,

  // Accommodation
  "bed-outline": Io5.IoBedOutline,
  "key-outline": Io5.IoKeyOutline,
  "business-outline": Io5.IoBusinessOutline,

  // Food & Dining
  "restaurant-outline": Io5.IoRestaurantOutline,
  "cafe-outline": Io5.IoCafeOutline,
  "pizza-outline": Io5.IoPizzaOutline,
  "wine-outline": Io5.IoWineOutline,
  "beer-outline": Io5.IoBeerOutline,
  "nutrition-outline": Io5.IoNutritionOutline,
  "fast-food-outline": Io5.IoFastFoodOutline,
  "ice-cream-outline": Io5.IoIceCreamOutline,

  // Events & Time
  "calendar-outline": Io5.IoCalendarOutline,
  "time-outline": Io5.IoTimeOutline,
  "alarm-outline": Io5.IoAlarmOutline,
  "ticket-outline": Io5.IoTicketOutline,
  "musical-notes-outline": Io5.IoMusicalNotesOutline,
  "mic-outline": Io5.IoMicOutline,

  // Nature & Outdoors
  "leaf-outline": Io5.IoLeafOutline,
  "flower-outline": Io5.IoFlowerOutline,
  "rose-outline": Io5.IoRoseOutline,
  "water-outline": Io5.IoWaterOutline,
  "bonfire-outline": Io5.IoBonfireOutline,
  "sunny-outline": Io5.IoSunnyOutline,
  "rainy-outline": Io5.IoRainyOutline,
  "cloudy-outline": Io5.IoCloudyOutline,
  "thunderstorm-outline": Io5.IoThunderstormOutline,
  "moon-outline": Io5.IoMoonOutline,
  "star-outline": Io5.IoStarOutline,

  // Activities & Recreation
  "camera-outline": Io5.IoCameraOutline,
  "images-outline": Io5.IoImagesOutline,
  "film-outline": Io5.IoFilmOutline,
  "game-controller-outline": Io5.IoGameControllerOutline,
  "football-outline": Io5.IoFootballOutline,
  "basketball-outline": Io5.IoBasketballOutline,
  "tennisball-outline": Io5.IoTennisballOutline,
  "fitness-outline": Io5.IoFitnessOutline,
  bicycle: Io5.IoBicycle, // sometimes used without outline
  "walk-outline": Io5.IoWalkOutline,
  body: Io5.IoBodyOutline,

  // Shopping
  "cart-outline": Io5.IoCartOutline,
  "bag-outline": Io5.IoBagOutline,
  "basket-outline": Io5.IoBasketOutline,
  "pricetag-outline": Io5.IoPricetagOutline,
  "card-outline": Io5.IoCardOutline,
  "cash-outline": Io5.IoCashOutline,
  "wallet-outline": Io5.IoWalletOutline,
  "gift-outline": Io5.IoGiftOutline,

  // Services & Amenities
  "wifi-outline": Io5.IoWifiOutline,
  "battery-charging-outline": Io5.IoBatteryChargingOutline,
  "bluetooth-outline": Io5.IoBluetoothOutline,
  "call-outline": Io5.IoCallOutline,
  "chatbubble-outline": Io5.IoChatbubbleOutline,
  "mail-outline": Io5.IoMailOutline,
  "medkit-outline": Io5.IoMedkitOutline,
  "library-outline": Io5.IoLibraryOutline,
  "book-outline": Io5.IoBookOutline,
  "school-outline": Io5.IoSchoolOutline,
  "construct-outline": Io5.IoConstructOutline,
  "hammer-outline": Io5.IoHammerOutline,

  // Historical/Cultural specific
  "hourglass-outline": Io5.IoHourglassOutline,
  "easel-outline": Io5.IoEaselOutline,
};

// Start export: Get icon by name (fallback to grid if not found)
export const getIcon = (name: string) => {
  return ICON_MAP[name] || Io5.IoGridOutline;
};

export const getIconNames = () => Object.keys(ICON_MAP);
