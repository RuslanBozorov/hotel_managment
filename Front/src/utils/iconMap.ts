import { 
  FaBuilding, FaConciergeBell, FaBed, FaUtensils, FaSpa, 
  FaSwimmingPool, FaWifi, FaCar, FaGlobe, FaChartBar,
  FaUserTie, FaHeadset, FaCreditCard, FaCogs,
  FaHotel, FaDoorOpen, FaChartLine, FaBullhorn, FaUserGraduate, FaKey,
  FaGlobeAmericas, FaUsers, FaMapMarkerAlt, FaHandshake, FaAward,
  FaShieldAlt, FaCertificate, FaStar, FaGem, FaCrown,
  FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaRocket, FaBriefcase,
  FaMoneyBillWave, FaPercentage, FaThumbsUp, FaCity, FaPaintBrush,
  FaTrophy, FaMedal, FaClipboardCheck, FaProjectDiagram
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

/**
 * Master icon registry for the entire platform.
 * Keys are used as string identifiers stored in the database.
 * The admin panel uses these keys to let admins pick icons.
 */
export const iconMap: Record<string, IconType> = {
  // ─── Hotel & Hospitality ───
  'FaHotel': FaHotel,
  'FaBuilding': FaBuilding,
  'FaConciergeBell': FaConciergeBell,
  'FaBed': FaBed,
  'FaDoorOpen': FaDoorOpen,
  'FaCity': FaCity,
  'FaKey': FaKey,
  'FaSpa': FaSpa,
  'FaSwimmingPool': FaSwimmingPool,
  'FaUtensils': FaUtensils,
  'FaWifi': FaWifi,
  'FaCar': FaCar,

  // ─── Business & Analytics ───
  'FaChartBar': FaChartBar,
  'FaChartLine': FaChartLine,
  'FaBriefcase': FaBriefcase,
  'FaMoneyBillWave': FaMoneyBillWave,
  'FaPercentage': FaPercentage,
  'FaProjectDiagram': FaProjectDiagram,
  'FaClipboardCheck': FaClipboardCheck,
  'FaCreditCard': FaCreditCard,
  'FaCogs': FaCogs,
  'FaRocket': FaRocket,

  // ─── People & Communication ───
  'FaUsers': FaUsers,
  'FaUserTie': FaUserTie,
  'FaUserGraduate': FaUserGraduate,
  'FaHeadset': FaHeadset,
  'FaHandshake': FaHandshake,
  'FaPhoneAlt': FaPhoneAlt,
  'FaEnvelope': FaEnvelope,
  'FaBullhorn': FaBullhorn,

  // ─── Achievements & Quality ───
  'FaAward': FaAward,
  'FaTrophy': FaTrophy,
  'FaMedal': FaMedal,
  'FaCertificate': FaCertificate,
  'FaStar': FaStar,
  'FaGem': FaGem,
  'FaCrown': FaCrown,
  'FaThumbsUp': FaThumbsUp,
  'FaShieldAlt': FaShieldAlt,

  // ─── Geography ───
  'FaGlobe': FaGlobe,
  'FaGlobeAmericas': FaGlobeAmericas,
  'FaMapMarkerAlt': FaMapMarkerAlt,

  // ─── Other ───
  'FaCalendarAlt': FaCalendarAlt,
  'FaPaintBrush': FaPaintBrush,

  // ─── Legacy aliases (backward-compat for older DB records) ───
  'hotel': FaHotel,
  'management': FaHotel,
  'preopening': FaDoorOpen,
  'consulting': FaChartLine,
  'marketing': FaBullhorn,
  'training': FaUserGraduate,
  'franchise': FaKey,
  'fa-hotel': FaHotel,
  'fa-star': FaStar,

  // ─── Fallback ───
  'default': FaHotel,
};

/** Resolve icon component from a DB string key */
export const getIcon = (name: string | undefined): IconType => {
  if (!name) return iconMap['default'];
  return iconMap[name] || iconMap['default'];
};

/** All selectable icon keys (excludes legacy aliases and default) */
const legacyKeys = new Set([
  'default', 'hotel', 'management', 'preopening', 
  'consulting', 'marketing', 'training', 'franchise',
  'fa-hotel', 'fa-star'
]);
export const iconNames = Object.keys(iconMap).filter(k => !legacyKeys.has(k));

/** Grouped icons for the admin picker UI */
export const iconGroups: { label: string; icons: string[] }[] = [
  { 
    label: 'Hotel & Hospitality', 
    icons: ['FaHotel', 'FaBuilding', 'FaConciergeBell', 'FaBed', 'FaDoorOpen', 'FaCity', 'FaKey', 'FaSpa', 'FaSwimmingPool', 'FaUtensils', 'FaWifi', 'FaCar'] 
  },
  { 
    label: 'Business & Analytics', 
    icons: ['FaChartBar', 'FaChartLine', 'FaBriefcase', 'FaMoneyBillWave', 'FaPercentage', 'FaProjectDiagram', 'FaClipboardCheck', 'FaCreditCard', 'FaCogs', 'FaRocket'] 
  },
  { 
    label: 'People & Communication', 
    icons: ['FaUsers', 'FaUserTie', 'FaUserGraduate', 'FaHeadset', 'FaHandshake', 'FaPhoneAlt', 'FaEnvelope', 'FaBullhorn'] 
  },
  { 
    label: 'Achievements & Quality', 
    icons: ['FaAward', 'FaTrophy', 'FaMedal', 'FaCertificate', 'FaStar', 'FaGem', 'FaCrown', 'FaThumbsUp', 'FaShieldAlt'] 
  },
  { 
    label: 'Geography', 
    icons: ['FaGlobe', 'FaGlobeAmericas', 'FaMapMarkerAlt'] 
  },
  { 
    label: 'Other', 
    icons: ['FaCalendarAlt', 'FaPaintBrush'] 
  },
];
