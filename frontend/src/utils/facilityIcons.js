// Centralized facility icons mapping from Cloudinary
export const FACILITY_ICONS = {
  'water supply': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638747/water-supply_obkyky.png',
  'electricity': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638747/electricity_aya7ys.png',
  'drawing room': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638747/drawingroom_bkrmhf.png',
  'washing machine': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638747/washingMachine_fc4wbu.png',
  'sewerage': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638747/sewerage_o311wr.png',
  'corner plot': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638747/corner-plot_cn9lkf.png',
  'balcony': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638747/balcony_eocnnt.png',
  'dining room': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638746/plates_edxfop.png',
  'basement': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638746/basement_nyyomo.png',
  'tv lounge': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638746/tvLounge_clj2mo.png',
  'study room': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638746/desk_cmugx3.png',
  'kitchen': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638746/kitchen_iflfix.png',
  'store room': 'https://res.cloudinary.com/dnrpwpdqv/image/upload/v1782638746/storeRoom_b6khb4.png',
};

// Get facility icon URL
export const getFacilityIconUrl = (facilityName) => {
  if (!facilityName) return null;
  
  const lowerFacility = facilityName.toLowerCase();
  
  // Direct match
  if (FACILITY_ICONS[lowerFacility]) {
    return FACILITY_ICONS[lowerFacility];
  }
  
  // Partial match
  for (const [key, url] of Object.entries(FACILITY_ICONS)) {
    if (lowerFacility.includes(key) || key.includes(lowerFacility)) {
      return url;
    }
  }
  
  return null;
};

// Get all facility options for forms
export const FACILITY_OPTIONS = Object.keys(FACILITY_ICONS).map(name => ({
  label: name.charAt(0).toUpperCase() + name.slice(1),
  value: name,
  icon: FACILITY_ICONS[name],
}));
