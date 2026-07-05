import {
  Users, ShieldCheck, GraduationCap, HeartPulse,
  Sprout, IndianRupee, Briefcase, Leaf, TrainFront, Building2,
  Wind, Droplets, Trash2, Volume2, Activity,
  type LucideIcon
} from "lucide-react";

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  datasets: number;
  downloads: string;
  tags: string[];
}

export const DOMAINS: Domain[] = [
  {
    id: "population",
    name: "Population Data",
    description: "Census demographics, migration patterns, age groups, density and growth statistics across India.",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-400/14",
    datasets: 2130,
    downloads: "42.1k",
    tags: ["Census", "Demographics", "Migration"]
  },
  {
    id: "crime",
    name: "Crime Data",
    description: "District-level crime trends, NCRB indicators, safety insights and law enforcement statistics.",
    icon: ShieldCheck,
    color: "text-rose-400",
    bg: "bg-rose-400/14",
    datasets: 1240,
    downloads: "18.4k",
    tags: ["NCRB", "District", "Safety"]
  },
  {
    id: "education",
    name: "Education Data",
    description: "Schools, enrollment rates, literacy statistics, infrastructure and learning outcome data.",
    icon: GraduationCap,
    color: "text-amber-400",
    bg: "bg-amber-400/14",
    datasets: 980,
    downloads: "15.2k",
    tags: ["Literacy", "Schools", "Enrollment"]
  },
  {
    id: "healthcare",
    name: "Healthcare Data",
    description: "Hospitals, disease burden, public health metrics, access indicators and health outcomes.",
    icon: HeartPulse,
    color: "text-pink-400",
    bg: "bg-pink-400/14",
    datasets: 1510,
    downloads: "27.8k",
    tags: ["Hospitals", "Disease", "Health"]
  },
  {
    id: "agriculture",
    name: "Agriculture Data",
    description: "Crop yields, rainfall patterns, market prices, soil health and food system statistics.",
    icon: Sprout,
    color: "text-emerald-400",
    bg: "bg-emerald-400/14",
    datasets: 1340,
    downloads: "31.6k",
    tags: ["Crops", "Rainfall", "Markets"]
  },
  {
    id: "economy",
    name: "Economy Data",
    description: "GDP indicators, banking access, public finance, trade statistics and economic growth data.",
    icon: IndianRupee,
    color: "text-yellow-400",
    bg: "bg-yellow-400/14",
    datasets: 870,
    downloads: "22.3k",
    tags: ["GDP", "Finance", "Trade"]
  },
  {
    id: "employment",
    name: "Employment Data",
    description: "Workforce statistics, employment rates, industry-wise jobs and labour market indicators.",
    icon: Briefcase,
    color: "text-violet-400",
    bg: "bg-violet-400/14",
    datasets: 640,
    downloads: "11.7k",
    tags: ["Jobs", "Workforce", "Labour"]
  },
  {
    id: "environment",
    name: "Environment Data",
    description: "Climate data, forest cover, water resources, pollution levels and environmental signals.",
    icon: Leaf,
    color: "text-green-400",
    bg: "bg-green-400/14",
    datasets: 660,
    downloads: "9.4k",
    tags: ["Climate", "Forest", "Water"]
  },
  {
    id: "transportation",
    name: "Transportation Data",
    description: "Rail, road, traffic, logistics and mobility infrastructure statistics across India.",
    icon: TrainFront,
    color: "text-blue-400",
    bg: "bg-blue-400/14",
    datasets: 590,
    downloads: "8.1k",
    tags: ["Rail", "Roads", "Traffic"]
  },
  {
    id: "smart-cities",
    name: "Smart Cities Data",
    description: "Urban development, smart infrastructure, city services and digital governance statistics.",
    icon: Building2,
    color: "text-orange-400",
    bg: "bg-orange-400/14",
    datasets: 420,
    downloads: "6.9k",
    tags: ["Urban", "Smart", "Infrastructure"]
  },
  {
    id: "wind-pollution",
    name: "Wind Pollution Data",
    description: "Air Quality Index (AQI), PM2.5, PM10, industrial emissions, and vehicle exhaust monitoring.",
    icon: Wind,
    color: "text-teal-400",
    bg: "bg-teal-400/14",
    datasets: 240,
    downloads: "4.1k",
    tags: ["AQI", "PM2.5", "Emissions"]
  },
  {
    id: "water-pollution",
    name: "Water Pollution Data",
    description: "River water quality, groundwater contamination, biological oxygen demand (BOD), and coastal waters.",
    icon: Droplets,
    color: "text-blue-400",
    bg: "bg-blue-400/14",
    datasets: 210,
    downloads: "3.2k",
    tags: ["River", "Groundwater", "BOD"]
  },
  {
    id: "land-pollution",
    name: "Land Pollution Data",
    description: "Municipal solid waste, landfill sites, plastic waste generation, and soil contamination.",
    icon: Trash2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/14",
    datasets: 130,
    downloads: "1.8k",
    tags: ["Solid Waste", "Landfills", "Plastic"]
  },
  {
    id: "sound-pollution",
    name: "Sound Pollution Data",
    description: "Decibel levels, noise monitoring in commercial/residential zones, and violation hotspots.",
    icon: Volume2,
    color: "text-rose-400",
    bg: "bg-rose-400/14",
    datasets: 80,
    downloads: "0.9k",
    tags: ["Noise", "Decibel", "Hotspots"]
  },
  {
    id: "pollution-all",
    name: "All Pollution Data",
    description: "Comprehensive view of air, water, land, and noise pollution projects across all sectors.",
    icon: Activity,
    color: "text-purple-400",
    bg: "bg-purple-400/14",
    datasets: 660,
    downloads: "10.0k",
    tags: ["Pollution", "Air", "Water", "Noise", "Land"]
  }
].filter((domain) => ["population", "wind-pollution", "water-pollution", "land-pollution", "sound-pollution", "pollution-all"].includes(domain.id));

export interface Dataset {
  id: string;
  title: string;
  domain: string;
  state: string;
  district: string;
  year: string;
  format: "CSV" | "XLSX" | "JSON" | "PDF";
  source: string;
  downloads: number;
  size: string;
  tags: string[];
  description: string;
}

export const DATASETS: Dataset[] = [
  { id: "d1", title: "Telangana District Crime Incidents 2023", domain: "crime", state: "Telangana", district: "All Districts", year: "2023", format: "CSV", source: "NCRB", downloads: 18400, size: "2.4 MB", tags: ["crime", "district", "NCRB"], description: "Comprehensive district-wise crime statistics for Telangana." },
  { id: "d2", title: "India Census Population Matrix 2011", domain: "population", state: "All States", district: "All Districts", year: "2011", format: "XLSX", source: "Census India", downloads: 42100, size: "8.7 MB", tags: ["census", "population", "demographics"], description: "Complete census population data across all Indian states." },
  { id: "d3", title: "Public Healthcare Facility Registry", domain: "healthcare", state: "All States", district: "All Districts", year: "2023", format: "JSON", source: "MoHFW", downloads: 27800, size: "5.1 MB", tags: ["hospitals", "health", "facilities"], description: "Registry of all public healthcare facilities in India." },
  { id: "d4", title: "State Crop Yield and Rainfall Trends", domain: "agriculture", state: "All States", district: "All Districts", year: "2022", format: "CSV", source: "ICAR", downloads: 31600, size: "3.8 MB", tags: ["crops", "rainfall", "yield"], description: "State-wise crop yield and rainfall correlation data." },
  { id: "d5", title: "Maharashtra School Enrollment Data", domain: "education", state: "Maharashtra", district: "All Districts", year: "2023", format: "XLSX", source: "DISE", downloads: 15200, size: "4.2 MB", tags: ["schools", "enrollment", "education"], description: "School enrollment statistics for Maharashtra." },
  { id: "d6", title: "India GDP State-wise Breakdown", domain: "economy", state: "All States", district: "All Districts", year: "2023", format: "CSV", source: "MoSPI", downloads: 22300, size: "1.9 MB", tags: ["GDP", "economy", "states"], description: "State-wise GDP contribution and growth data." },
  { id: "d7", title: "Delhi Air Quality Index 2023", domain: "environment", state: "Delhi", district: "All Districts", year: "2023", format: "CSV", source: "CPCB", downloads: 9400, size: "1.2 MB", tags: ["AQI", "pollution", "Delhi"], description: "Daily air quality index readings across Delhi districts." },
  { id: "d8", title: "Indian Railways Network Statistics", domain: "transportation", state: "All States", district: "All Districts", year: "2023", format: "JSON", source: "Indian Railways", downloads: 8100, size: "6.3 MB", tags: ["railways", "transport", "network"], description: "Complete Indian Railways network and traffic statistics." },
  { id: "d9", title: "Employment Survey Urban India 2022", domain: "employment", state: "All States", district: "All Districts", year: "2022", format: "XLSX", source: "NSSO", downloads: 11700, size: "3.5 MB", tags: ["employment", "urban", "workforce"], description: "Urban employment survey data from NSSO." },
  { id: "d10", title: "Smart Cities Mission Progress Report", domain: "smart-cities", state: "All States", district: "All Districts", year: "2023", format: "PDF", source: "MoHUA", downloads: 6900, size: "12.1 MB", tags: ["smart cities", "urban", "development"], description: "Progress report of Smart Cities Mission across India." },
  { id: "d11", title: "UP Crime Statistics District-wise", domain: "crime", state: "Uttar Pradesh", district: "All Districts", year: "2023", format: "CSV", source: "NCRB", downloads: 12300, size: "1.8 MB", tags: ["crime", "UP", "district"], description: "District-wise crime data for Uttar Pradesh." },
  { id: "d12", title: "Karnataka Population Growth 2001-2021", domain: "population", state: "Karnataka", district: "All Districts", year: "2021", format: "XLSX", source: "Census India", downloads: 8900, size: "2.1 MB", tags: ["population", "Karnataka", "growth"], description: "Population growth trends in Karnataka over two decades." }
];

export const STATES = [
  "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];
