"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  Database,
  Download,
  Edit3,
  FileDown,
  Filter,
  GraduationCap,
  HeartPulse,
  IndianRupee,
  Leaf,
  LockKeyhole,
  LogOut,
  Mail,
  MapPinned,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  TableProperties,
  TrainFront,
  Trash2,
  Upload,
  Users,
  X,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const allDomains = [
  { name: "Population",         description: "Census demographics, migration, age groups & density across India.", icon: Users,        color: "text-cyan-400",    bg: "bg-cyan-400/14",    href: "/domain/population/projects", dashboardUrl: "" },
  { name: "Crime",              description: "District-level crime trends, NCRB indicators & safety insights.",    icon: ShieldCheck,  color: "text-rose-400",    bg: "bg-rose-400/14",    href: "/domain/crime/projects",      dashboardUrl: "" },
  { name: "Literacy Rate",      description: "Census literacy rates, gender gaps, district rankings and state-wise trends.", icon: GraduationCap,color: "text-amber-400",   bg: "bg-amber-400/14",   href: "/domain/education/projects",  dashboardUrl: "https://educationdashboard.lovable.app" },
  { name: "Finance",            description: "GDP indicators, banking, public finance & trade statistics.",        icon: IndianRupee,  color: "text-yellow-400",  bg: "bg-yellow-400/14",  href: "/domain/finance/projects",    dashboardUrl: "" },
  { name: "Environment and Climate", description: "Choose environment or climate projects, from pollution and forests to rainfall and heat risk.", icon: Leaf, color: "text-green-400", bg: "bg-green-400/14", href: "/domain/environment-climate/projects", dashboardUrl: "https://environmentdash.lovable.app" },
  { name: "Medical",            description: "Hospitals, disease burden, health metrics & access indicators.",     icon: HeartPulse,   color: "text-pink-400",    bg: "bg-pink-400/14",    href: "/domain/medical/projects", dashboardUrl: "" },
  { name: "Transport & Infrastructure", description: "Rail, road, traffic & mobility infrastructure statistics.",          icon: TrainFront,   color: "text-blue-400",    bg: "bg-blue-400/14",    href: "/domain/transport/projects", dashboardUrl: "" },
  { name: "Agriculture & Food", description: "Crop yields, rainfall patterns, market prices & soil health.",       icon: Sprout,       color: "text-emerald-400", bg: "bg-emerald-400/14", href: "/domain/agriculture/projects",dashboardUrl: "https://agriculturedashboard.lovable.app" },
  { name: "Energy & Power",     description: "Energy production, consumption, renewable sources & power infrastructure.", icon: Sparkles,    color: "text-orange-400",  bg: "bg-orange-400/14",  href: "/domain/energy/projects",    dashboardUrl: "https://energy-power.lovable.app" },
  { name: "Pollution (Air, Water, Land, Sound)", description: "Air quality, water pollution, land contamination & noise levels.", icon: Activity, color: "text-purple-400",  bg: "bg-purple-400/14",  href: "/domain/pollution/projects",   dashboardUrl: "https://pollutiondashbase.lovable.app" },
];

const domainProjects: Record<string, { title: string; steps: string[] }[]> = {
  "Population": [
    { title: "India Census Dashboard 2011–2021", steps: ["Download census CSV from data.gov.in", "Clean and normalize district-level columns", "Build state-wise population heatmap", "Add age group pyramid chart", "Deploy as interactive dashboard"] },
    { title: "Migration Flow Analysis", steps: ["Collect inter-state migration datasets", "Map origin-destination pairs", "Visualize flow with Sankey diagram", "Identify top migration corridors", "Export insights as report"] },
    { title: "Urban vs Rural Population Tracker", steps: ["Merge census and NSSO data", "Calculate urban/rural ratio per state", "Plot trend lines 2001–2021", "Add state filter and comparison view", "Publish findings"] },
    { title: "Population Density Map", steps: ["Get district boundary GeoJSON", "Join census population data", "Normalize by area (km²)", "Render choropleth map", "Add tooltip with district stats"] },
    { title: "Gender Ratio by District", steps: ["Extract sex ratio columns from census", "Flag districts below national average", "Create ranked bar chart", "Add historical comparison (2001 vs 2011)", "Share as public dataset"] },
    { title: "Child Population and Fertility Rate", steps: ["Filter age 0–6 data from census", "Calculate fertility proxy per state", "Plot correlation with literacy rate", "Identify high-risk districts", "Build policy recommendation summary"] },
    { title: "Scheduled Caste/Tribe Distribution", steps: ["Extract SC/ST population columns", "Map percentage across states", "Compare with national average", "Link to welfare scheme coverage data", "Visualize gaps in coverage"] },
    { title: "District-wise Literacy Rate Analysis", steps: ["Pull literacy rate data from census", "Separate male/female rates", "Rank bottom 50 districts", "Overlay with school enrollment data", "Generate PDF report"] },
    { title: "Senior Citizen Population Study", steps: ["Filter age 60+ from census data", "Map elderly population density", "Correlate with pension scheme reach", "Identify underserved regions", "Build summary dashboard"] },
    { title: "Population Growth Prediction Model", steps: ["Collect decadal census data 1981–2021", "Calculate annual growth rates", "Train linear regression model", "Forecast 2031 projections", "Visualize with confidence intervals"] },
  ],
  "Crime": [
    { title: "State-wise Crime Rate Comparison", steps: ["Download NCRB annual report CSV", "Normalize crime counts by population", "Rank states by crime rate", "Build interactive bar chart", "Add year filter"] },
    { title: "Telangana District Crime Heatmap", steps: ["Get district-level NCRB data", "Map to GeoJSON boundaries", "Color by crime frequency", "Add crime type dropdown filter", "Deploy map dashboard"] },
    { title: "Crime Against Women Analysis", steps: ["Filter women-related crime categories", "Track trends 2015–2023", "Identify top 10 states", "Compare urban vs rural rates", "Generate awareness report"] },
    { title: "Cybercrime Growth Tracker", steps: ["Extract cybercrime rows from NCRB", "Plot year-on-year growth", "Break down by category (fraud, hacking)", "Map state-wise incidents", "Highlight emerging hotspots"] },
    { title: "Police-to-Population Ratio Study", steps: ["Get sanctioned vs actual police strength", "Calculate ratio per lakh population", "Rank states by deficit", "Correlate with crime rates", "Publish policy brief"] },
    { title: "Juvenile Crime Trend Analysis", steps: ["Filter juvenile offender data", "Track age group distribution", "Compare across states", "Correlate with dropout rates", "Suggest intervention points"] },
    { title: "Murder Rate District Dashboard", steps: ["Extract murder/IPC 302 data", "Normalize per lakh population", "Rank top 20 districts", "Add 5-year trend line", "Build alert threshold system"] },
    { title: "Road Accident Fatality Map", steps: ["Download MORTH accident data", "Map fatalities by highway stretch", "Identify black spots", "Overlay traffic volume data", "Propose safety interventions"] },
    { title: "Drug-Related Offences Tracker", steps: ["Extract NDPS Act case data", "Map seizure hotspots by district", "Track year-wise trends", "Correlate with border districts", "Build monitoring dashboard"] },
    { title: "Prison Occupancy and Under-trial Study", steps: ["Get NCRB prison statistics", "Calculate overcrowding ratio", "Identify states with highest under-trial %", "Map against judicial vacancy data", "Generate reform report"] },
  ],
  "Literacy Rate": [
    { title: "State-wise Literacy Rate Dashboard", steps: ["Download census literacy tables", "Clean male, female, and total literacy columns", "Rank states by literacy rate", "Add national average comparison", "Deploy as interactive dashboard"] },
    { title: "District Literacy Ranking Map", steps: ["Extract district-wise literacy rates", "Join with district boundaries", "Render literacy choropleth map", "Highlight top and bottom districts", "Export ranked district report"] },
    { title: "Male vs Female Literacy Gap", steps: ["Split literacy rates by gender", "Calculate gap per state", "Rank widest and narrowest gaps", "Create butterfly chart", "Publish gender-gap summary"] },
    { title: "Rural vs Urban Literacy Split", steps: ["Collect rural and urban literacy indicators", "Calculate rural-urban gap", "Compare states with grouped bars", "Identify high rural lag regions", "Prepare policy notes"] },
    { title: "Female Literacy Improvement Tracker", steps: ["Collect historical female literacy rates", "Calculate decadal improvement", "Rank fastest-improving states", "Compare against national progress", "Build trend dashboard"] },
    { title: "Youth Literacy Rate Study", steps: ["Filter youth literacy indicators", "Compare rates by state and gender", "Map low-literacy youth clusters", "Identify priority districts", "Publish intervention brief"] },
    { title: "Literacy and School Access Correlation", steps: ["Merge literacy and school access data", "Calculate correlation", "Plot district scatter charts", "Identify access-outcome gaps", "Write insights report"] },
    { title: "Literacy Gap by Social Group", steps: ["Extract group-wise literacy indicators", "Normalize categories across states", "Calculate gap metrics", "Map vulnerable regions", "Build equity dashboard"] },
    { title: "Adult Literacy Campaign Tracker", steps: ["Collect adult literacy coverage data", "Compare coverage with low-literacy districts", "Track yearly progress", "Flag underserved groups", "Create monitoring dashboard"] },
    { title: "Literacy Rate Forecasting Model", steps: ["Compile historical literacy rates", "Calculate annualized growth", "Train projection model", "Forecast 2031 rates", "Visualize confidence bands"] },
  ],
  "Medical": [
    { title: "Public Hospital Bed Availability Map", steps: ["Download NHP facility data", "Calculate beds per 1000 population", "Map district-wise availability", "Identify critical shortage zones", "Build live dashboard"] },
    { title: "Infant Mortality Rate Analysis", steps: ["Extract IMR from NFHS dataset", "Compare state-wise rates", "Track decline 2015–2021", "Correlate with immunization coverage", "Generate health report"] },
    { title: "Immunization Coverage Dashboard", steps: ["Get HMIS immunization data", "Calculate full immunization %", "Map district-wise coverage", "Identify cold chain gaps", "Track monthly progress"] },
    { title: "Disease Burden by State", steps: ["Download ICMR disease registry", "Rank top 10 diseases per state", "Plot incidence per lakh", "Add year-wise trend lines", "Build comparative dashboard"] },
    { title: "Doctor-to-Population Ratio Study", steps: ["Get NMC registered doctor data", "Calculate ratio per 10,000 population", "Rank states by shortage", "Compare urban vs rural", "Map health worker deserts"] },
    { title: "Maternal Mortality Rate Tracker", steps: ["Extract MMR data from SRS", "Track trend 2005–2020", "Map state-wise rates", "Correlate with institutional delivery %", "Set SDG target progress markers"] },
    { title: "Malnutrition in Children Dashboard", steps: ["Get NFHS stunting/wasting data", "Map under-5 malnutrition by district", "Compare 2015 vs 2021 NFHS rounds", "Identify persistent hotspots", "Link to POSHAN scheme data"] },
    { title: "Mental Health Facility Coverage", steps: ["Download NIMHANS facility data", "Calculate psychiatrist-to-population ratio", "Map district gaps", "Compare urban vs rural access", "Propose facility expansion plan"] },
    { title: "TB Notification and Treatment Tracker", steps: ["Get NIKSHAY TB case data", "Track notification rate per lakh", "Calculate treatment success %", "Map high-burden districts", "Monitor Ni-kshay Poshan Yojana reach"] },
    { title: "Health Insurance Coverage Analysis", steps: ["Extract Ayushman Bharat data", "Calculate beneficiary coverage %", "Map empanelled hospitals by district", "Track claims and settlements", "Identify coverage gaps"] },
  ],
  "Agriculture & Food": [
    { title: "Crop Yield Comparison Dashboard", steps: ["Download ICAR crop production CSV", "Normalize yield per hectare", "Compare top 5 crops per state", "Add year-wise trend lines", "Build interactive chart"] },
    { title: "Rainfall vs Crop Production Analysis", steps: ["Merge IMD rainfall and crop data", "Calculate correlation coefficient", "Map drought-prone districts", "Overlay with MSP data", "Publish climate-agriculture report"] },
    { title: "Farmer Suicide Data Analysis", steps: ["Get NCRB farmer distress data", "Normalize by farming population", "Map hotspot districts", "Correlate with debt and rainfall", "Generate policy brief"] },
    { title: "Soil Health Card Coverage Tracker", steps: ["Download SHC portal data", "Calculate cards issued vs target", "Map state-wise completion %", "Track nutrient deficiency patterns", "Build monitoring dashboard"] },
    { title: "Agricultural Market Price Tracker", steps: ["Get Agmarknet daily price data", "Track modal price for key commodities", "Plot seasonal price trends", "Compare mandis across states", "Build price alert system"] },
    { title: "Irrigation Coverage Analysis", steps: ["Extract net irrigated area data", "Calculate % of cultivable land irrigated", "Map canal vs groundwater split", "Identify irrigation-deficit districts", "Propose investment priority map"] },
    { title: "PM-KISAN Beneficiary Tracking", steps: ["Download PM-KISAN payment data", "Calculate beneficiary coverage per state", "Track instalment disbursements", "Map pending vs completed payments", "Identify exclusion errors"] },
    { title: "Cold Storage Infrastructure Map", steps: ["Get NHB cold storage directory", "Map capacity by state and district", "Calculate storage per ton of produce", "Identify horticulture deficit zones", "Link to wastage reduction data"] },
    { title: "Fertiliser Consumption Trends", steps: ["Download FAI fertiliser data", "Track NPK usage per hectare", "Compare state-wise imbalances", "Correlate with soil health data", "Generate sustainable use report"] },
    { title: "Crop Insurance Claim Analysis", steps: ["Get PMFBY claims dataset", "Calculate claim settlement ratio", "Map districts with high rejection rates", "Track premium vs payout trends", "Identify scheme improvements"] },
  ],
  "Finance": [
    { title: "State GDP Growth Dashboard", steps: ["Download MoSPI GSDP data", "Calculate year-on-year growth", "Rank states by GSDP", "Plot sectoral contribution", "Build comparison dashboard"] },
    { title: "GST Collection Tracker", steps: ["Get GSTN monthly collection data", "Track state-wise trends", "Calculate per capita collection", "Map compliance rate", "Build revenue alert system"] },
    { title: "FDI Inflow by State and Sector", steps: ["Download DPIIT FDI data", "Map top destination states", "Break down by sector", "Track quarterly trends", "Compare pre/post policy changes"] },
    { title: "Public Expenditure Analysis", steps: ["Get Union Budget expenditure data", "Break down by ministry", "Calculate per capita spending", "Track capital vs revenue split", "Compare 5-year trends"] },
    { title: "Inflation and CPI Tracker", steps: ["Download RBI/MoSPI CPI data", "Track food vs non-food inflation", "Map rural vs urban CPI", "Correlate with MSP changes", "Build monthly dashboard"] },
    { title: "Banking Access and Financial Inclusion", steps: ["Get RBI branch density data", "Calculate branches per lakh population", "Map unbanked districts", "Track Jan Dhan account growth", "Identify credit gap areas"] },
    { title: "MSME Registration and Growth Tracker", steps: ["Download Udyam registration data", "Map MSME count by district", "Break down by sector and size", "Track employment generation", "Identify growth corridors"] },
    { title: "Export-Import Trade Analysis", steps: ["Get DGCI&S trade statistics", "Identify top export commodities", "Map port-wise trade volumes", "Track trade deficit trends", "Build commodity dashboard"] },
    { title: "Poverty Headcount Index Study", steps: ["Get NITI Aayog MPI data", "Map multidimensional poverty by district", "Compare 2015 vs 2021 scores", "Identify worst-performing districts", "Link to scheme coverage data"] },
    { title: "State Debt and Fiscal Health Monitor", steps: ["Download RBI state finance data", "Calculate debt-to-GSDP ratio", "Track fiscal deficit trends", "Rank states by financial health", "Generate risk assessment"] },
  ],
  "Employment Data": [
    { title: "Unemployment Rate by State", steps: ["Get PLFS employment data", "Calculate unemployment rate", "Break down by age and gender", "Track quarterly trends", "Map state-wise variations"] },
    { title: "Urban Employment Sector Analysis", steps: ["Extract urban employment data", "Break down by industry", "Calculate formal vs informal split", "Track year-wise shifts", "Build sector dashboard"] },
    { title: "MGNREGS Work Demand Tracker", steps: ["Download MGNREGS MIS data", "Track job card vs work demanded", "Calculate days provided per household", "Map district-wise utilization", "Identify demand-supply gaps"] },
    { title: "Gig Economy Worker Study", steps: ["Collect e-Shram registration data", "Map gig worker distribution", "Break down by platform type", "Calculate income bracket distribution", "Propose social security coverage"] },
    { title: "Women Labour Force Participation", steps: ["Get PLFS LFPR data for women", "Track urban vs rural FLFPR", "Compare state-wise trends", "Correlate with education levels", "Build gender gap dashboard"] },
    { title: "Skill Development Outcomes Tracker", steps: ["Download PMKVY training data", "Calculate placement rate by sector", "Map training centres by district", "Track certification to job conversion", "Identify high-performing schemes"] },
    { title: "Youth Unemployment Analysis", steps: ["Filter PLFS data for age 15–29", "Calculate youth unemployment rate", "Map state-wise hotspots", "Correlate with education completion", "Propose targeted interventions"] },
    { title: "Wage Growth by Industry", steps: ["Get PLFS weekly earnings data", "Calculate real wage growth", "Compare organized vs unorganized sector", "Map regional wage gaps", "Track minimum wage compliance"] },
    { title: "Contract vs Permanent Employment Ratio", steps: ["Extract ASI factory employment data", "Calculate contract worker percentage", "Track industry-wise trends", "Map states with high contract ratio", "Link to labour law compliance data"] },
    { title: "Construction Sector Workforce Study", steps: ["Get BOCW registration data", "Calculate registered vs estimated workers", "Map state-wise welfare fund utilization", "Track accident and compensation data", "Identify coverage gaps"] },
  ],
  "Environment": [
    { title: "AQI City Dashboard", steps: ["Download CPCB AQI daily data", "Calculate annual average per city", "Map cities by pollution level", "Track seasonal variation", "Build real-time alert system"] },
    { title: "Forest Cover Change Analysis", steps: ["Get FSI India State of Forest report data", "Calculate net forest cover change", "Map gain vs loss by state", "Correlate with deforestation drivers", "Build decade comparison"] },
    { title: "River Water Quality Tracker", steps: ["Download CPCB river monitoring data", "Track BOD and DO levels", "Map polluted river stretches", "Identify industrial discharge hotspots", "Build pollution trend dashboard"] },
    { title: "Groundwater Depletion Study", steps: ["Get CGWB groundwater data", "Map over-exploited blocks", "Track water table decline", "Correlate with irrigation patterns", "Propose recharge zone priorities"] },
    { title: "Plastic Waste Generation Map", steps: ["Get CPCB SWM data", "Calculate plastic waste per capita", "Map ULBs with high generation", "Track processing capacity vs generation", "Identify disposal gaps"] },
    { title: "Climate Extreme Events Tracker", steps: ["Download IMD extreme weather data", "Map flood, drought, cyclone events", "Track frequency trends", "Correlate with crop damage data", "Build disaster risk index"] },
    { title: "Solar Radiation and Renewable Potential", steps: ["Get MNRE solar irradiance data", "Map high-potential districts", "Calculate installed vs potential capacity", "Track year-wise addition", "Identify investment priority zones"] },
    { title: "Industrial Pollution Compliance Monitor", steps: ["Download CPCB consent data", "Map non-compliant industries", "Track violation trends", "Calculate penalty recovery rate", "Build compliance dashboard"] },
    { title: "Wetland and Biodiversity Tracker", steps: ["Get Wildlife Institute wetland data", "Map Ramsar sites and status", "Track encroachment incidents", "Correlate with migratory bird data", "Build conservation monitoring tool"] },
    { title: "Carbon Emission by State", steps: ["Get INCCA emission inventory", "Calculate per capita emissions", "Break down by sector", "Track reduction against NDC targets", "Build net-zero progress dashboard"] },
  ],
  "Transport & Infrastructure": [
    { title: "Railway Network Coverage Map", steps: ["Download IR station and route data", "Map rail connectivity by district", "Calculate rail density per 1000 km²", "Identify unconnected districts", "Build rail access dashboard"] },
    { title: "Road Accident Black Spot Analysis", steps: ["Get MORTH accident data", "Identify high-frequency accident locations", "Map by highway and state", "Calculate fatality rate per stretch", "Propose safety interventions"] },
    { title: "National Highway Development Tracker", steps: ["Download NHAI project data", "Map completed vs ongoing projects", "Track lane expansion progress", "Calculate cost per km", "Build project monitoring dashboard"] },
    { title: "Public Transport Ridership Study", steps: ["Get state transport corporation data", "Track bus ridership trends", "Calculate route profitability", "Map underserved corridors", "Propose network optimization"] },
    { title: "Airport Connectivity Analysis", steps: ["Download AAI passenger data", "Map airports by traffic volume", "Calculate tier-2/3 city connectivity", "Track UDAN scheme coverage", "Identify connectivity gaps"] },
    { title: "Freight Movement Dashboard", steps: ["Get IR freight loading statistics", "Track commodity-wise movement", "Map major freight corridors", "Calculate modal share of rail vs road", "Build logistics efficiency index"] },
    { title: "EV Charging Infrastructure Map", steps: ["Download BEE/MoP charging station data", "Map stations by state and highway", "Calculate coverage per 100 km", "Track monthly additions", "Identify expansion priority zones"] },
    { title: "Metro Rail Usage Tracker", steps: ["Get DMRC/metro authority ridership data", "Track daily average ridership", "Map station-wise footfall", "Calculate cost recovery ratio", "Compare cities by efficiency"] },
    { title: "Toll Collection Revenue Analysis", steps: ["Download NHAI toll plaza data", "Calculate daily collection per plaza", "Track FASTag adoption rate", "Map revenue by highway corridor", "Identify evasion hotspots"] },
    { title: "Inland Waterway Traffic Study", steps: ["Get IWAI traffic statistics", "Map active NW routes", "Track cargo movement trends", "Calculate cost vs rail/road", "Identify expansion potential"] },
  ],
  "Energy & Power": [
    { title: "State-wise Energy Consumption Dashboard", steps: ["Download power consumption data from POSOCO", "Calculate per capita consumption by state", "Map industrial vs residential usage", "Track renewable vs thermal split", "Build energy efficiency index"] },
    { title: "Solar Power Installation Tracker", steps: ["Get MNRE solar rooftop data", "Map installed capacity by district", "Track subsidy disbursement status", "Calculate generation vs consumption", "Identify high-potential regions"] },
    { title: "Wind Energy Potential Map", steps: ["Download NIWE wind resource data", "Map wind speed zones by state", "Compare installed vs potential capacity", "Track capacity addition trends", "Build investment priority dashboard"] },
    { title: "Thermal Power Plant Emissions Analysis", steps: ["Get CPCB emission data for power plants", "Calculate CO2 and particulate emissions", "Map plants by pollution levels", "Track compliance with norms", "Generate environmental impact report"] },
    { title: "Rural Electrification Progress Tracker", steps: ["Download DDUGJY scheme data", "Map electrified vs unelectrified villages", "Track household connection rates", "Identify quality of supply issues", "Build access monitoring dashboard"] },
    { title: "Power Distribution Loss Analysis", steps: ["Get state DISCOM AT&C loss data", "Calculate transmission and distribution losses", "Rank states by loss percentage", "Correlate with financial health of utilities", "Propose reduction interventions"] },
    { title: "Electric Vehicle Charging Infrastructure", steps: ["Download FAME II charging station data", "Map stations by highway and city", "Calculate coverage per 100 km", "Track utilization rates", "Identify expansion priority zones"] },
    { title: "Hydropower Project Status Dashboard", steps: ["Get CEA hydropower project data", "Track under-construction projects", "Map installed capacity by river basin", "Calculate generation vs potential", "Build project monitoring system"] },
    { title: "Smart Meter Deployment Tracker", steps: ["Download smart meter installation data", "Map coverage by state and utility", "Track billing efficiency improvements", "Calculate consumer adoption rates", "Build deployment progress dashboard"] },
    { title: "Grid Integration of Renewables Study", steps: ["Get renewable integration data from NLDC", "Track solar and wind grid penetration", "Map curtailment by region", "Analyze grid stability challenges", "Propose infrastructure upgrades"] },
  ],
  "Pollution (Air, Water, Land, Sound)": [
    { title: "National Air Quality Index Dashboard", steps: ["Download CPCB AQI daily data", "Calculate annual average per city", "Map cities by pollution level", "Track seasonal variation", "Build real-time alert system"] },
    { title: "River Water Quality Monitoring", steps: ["Download CPCB river monitoring data", "Track BOD and DO levels", "Map polluted river stretches", "Identify industrial discharge hotspots", "Build pollution trend dashboard"] },
    { title: "Industrial Air Pollution Tracker", steps: ["Get CPCB industrial emission data", "Map non-compliant industries", "Track violation trends", "Calculate penalty recovery rate", "Build compliance dashboard"] },
    { title: "Groundwater Contamination Study", steps: ["Download CGWB groundwater quality data", "Map contaminated blocks by state", "Track pollutant concentration trends", "Identify contamination sources", "Build remediation priority map"] },
    { title: "Noise Pollution Hotspot Analysis", steps: ["Get SPCB noise monitoring data", "Map noise levels by city zone", "Track violations of decibel limits", "Identify high-traffic noise zones", "Build citizen complaint dashboard"] },
    { title: "Landfill and Waste Dump Mapping", steps: ["Download CPCB SWM data", "Map landfill sites by state", "Calculate capacity vs utilization", "Track leachate contamination risks", "Identify remediation needs"] },
    { title: "Plastic Waste Generation Tracker", steps: ["Get CPCB SWM data", "Calculate plastic waste per capita", "Map ULBs with high generation", "Track processing capacity vs generation", "Identify disposal gaps"] },
    { title: "Hazardous Waste Management Dashboard", steps: ["Download HWF hazardous waste data", "Map generation by industry and state", "Track treatment and disposal capacity", "Calculate compliance rates", "Build monitoring system"] },
    { title: "Coastal Water Quality Analysis", steps: ["Get NCCR coastal water data", "Map pollution levels along coastline", "Track industrial discharge points", "Monitor marine ecosystem impact", "Build coastal health dashboard"] },
    { title: "Urban Slum Sanitation Mapping", steps: ["Download SBM urban sanitation data", "Map slums with poor sanitation access", "Track toilet coverage and waste management", "Identify disease outbreak risks", "Build intervention priority map"] },
  ],
};

const problemPoints = [
  "Indian open data is scattered across data.gov.in, CPCB, ICMR, NFHS, and state portals.",
  "Dataset formats and metadata are inconsistent, so beginners struggle to compare sources.",
  "Existing portals do not make search, preview, download, or usage tracking simple."
];

const features: Array<{
  title: string;
  detail: string;
  icon: LucideIcon;
}> = [
  {
    title: "Search & Filters",
    detail: "Search by keyword and filter by domain, format, year, and state.",
    icon: Filter
  },
  {
    title: "Clean Dataset Cards",
    detail: "Show name, description, format, size, source, update year, and downloads.",
    icon: TableProperties
  },
  {
    title: "Dataset Details",
    detail: "Open a dataset page with metadata, preview table, and download action.",
    icon: FileDown
  },
  {
    title: "Admin Panel",
    detail: "Authorized admins can add, edit, and delete datasets from the catalog.",
    icon: LockKeyhole
  },
  {
    title: "Download Tracking",
    detail: "Track downloads by domain, state, format, and dataset popularity.",
    icon: BarChart3
  },
  {
    title: "Mobile Friendly",
    detail: "Free, responsive access for students, researchers, and project teams.",
    icon: Users
  }
];

const domains = [
  { name: "Pollution", count: "1,240", icon: Activity, color: "text-cyan-500" },
  { name: "Health", count: "1,510", icon: HeartPulse, color: "text-rose-500" },
  { name: "Literacy Rate", count: "980", icon: GraduationCap, color: "text-amber-500" },
  { name: "Population", count: "2,130", icon: Users, color: "text-emerald-500" }
];

const datasets = [
  {
    name: "National Air Quality Index by City",
    description: "Daily AQI readings for PM2.5, PM10, NO2, SO2, and ozone across major Indian cities.",
    domain: "Pollution",
    format: "CSV",
    year: "2025",
    state: "All India",
    source: "CPCB",
    size: "18 MB",
    downloads: "24,810"
  },
  {
    name: "NFHS District Health Indicators",
    description: "Health, nutrition, sanitation, and household indicators for district-level research.",
    domain: "Health",
    format: "XLSX",
    year: "2024",
    state: "All India",
    source: "NFHS",
    size: "42 MB",
    downloads: "31,420"
  },
  {
    name: "State Literacy Rate and Gender Gap",
    description: "Total, male, and female literacy rates with district-level gap indicators.",
    domain: "Literacy Rate",
    format: "JSON",
    year: "2025",
    state: "Karnataka",
    source: "data.gov.in",
    size: "9 MB",
    downloads: "12,930"
  }
];

const previewRows = [
  ["Delhi", "Pollution", "AQI", "214", "CPCB"],
  ["Mumbai", "Pollution", "PM2.5", "86", "CPCB"],
  ["Chennai", "Health", "Hospitals", "412", "ICMR"],
  ["Bengaluru", "Literacy Rate", "Female literacy", "84.2%", "Census India"]
];

const stats = [
  ["10,000+", "Indexed datasets"],
  ["5", "Major source portals"],
  ["28", "States covered"],
  ["100,000+", "Downloads tracked"]
];

function AnimatedCounter({ value }: { value: string }) {
  const numeric = Number(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");
  const spring = useSpring(0, { stiffness: 82, damping: 18 });
  const displayed = useTransform(
    spring,
    (latest) => `${Math.round(latest).toLocaleString("en-IN")}${suffix}`
  );

  useEffect(() => {
    spring.set(numeric);
  }, [numeric, spring]);

  return <motion.span>{displayed}</motion.span>;
}

function Reveal({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.58, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function DataBackdrop() {
  const bars = useMemo(() => [40, 74, 48, 92, 62, 84, 56, 98, 68], []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="data-grid absolute inset-0 animate-grid-flow opacity-65" />
      <svg className="absolute inset-x-0 top-20 h-[430px] w-full opacity-70" viewBox="0 0 1200 430">
        <defs>
          <linearGradient id="hubLine" x1="0" x2="1" y1="0" y2="0">
            <stop stopColor="#22d3ee" />
            <stop offset="0.55" stopColor="#10b981" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 276 C130 198 244 230 360 142 C482 50 590 132 710 204 C824 272 914 132 1028 176 C1110 208 1150 136 1200 96"
          fill="none"
          stroke="url(#hubLine)"
          strokeLinecap="round"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        {bars.map((height, index) => (
          <motion.rect
            key={`${height}-${index}`}
            x={140 + index * 100}
            y={326 - height}
            width="20"
            height={height}
            rx="8"
            fill={index % 3 === 0 ? "#22d3ee" : index % 3 === 1 ? "#10b981" : "#f59e0b"}
            opacity="0.38"
            animate={{ height: [height, height + 30, height], y: [326 - height, 296 - height, 326 - height] }}
            transition={{ duration: 3 + index * 0.12, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const navLinks = [
    ["Problem", "#problem"],
    ["Solution", "#solution"],
    ["Features", "#features"],
    ["Datasets", "#datasets"],
    ["Tech", "#tech"],
    ["About Us", "#about"]
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="mesh-bg relative min-h-screen pb-16 pt-5">
        <DataBackdrop />
        <nav className="container relative z-20 flex items-center justify-between rounded-full border border-border/70 bg-background/64 px-4 py-3 backdrop-blur-2xl">
          <a href="#" className="flex items-center gap-3" aria-label="Unified Open Data Hub home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
              <Database className="h-5 w-5" />
            </span>
            <span className="hidden text-sm font-black sm:block">Unified Open Data Hub</span>
          </a>

          <div className="flex items-center gap-2">
            {session?.user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="flex items-center gap-2 rounded-full border border-border/70 bg-background/58 px-3 py-1.5 text-sm font-semibold text-foreground backdrop-blur-xl">
                  <Mail className="h-4 w-4 text-cyan-500" />
                  {session.user.email}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="secondary" className="hidden sm:inline-flex" asChild>
                <a href="/login">Login</a>
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((current) => !current)}
              className="h-10 w-10 rounded-full p-0 md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </nav>

        {menuOpen ? (
          <div className="container relative z-20 mt-3 md:hidden">
            <div className="rounded-lg border border-border/70 bg-background/90 p-3 shadow-soft backdrop-blur-2xl">
              {navLinks.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="container relative z-10 grid items-center gap-12 pt-5 lg:grid-cols-[0.95fr_1.05fr] lg:pt-8">
          <div>
            {/* Institutional Partner Logos */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-center justify-between w-full max-w-xl px-2"
            >
              <img src="/logo-ou.png" alt="Osmania University" className="h-14 sm:h-16 w-auto object-contain" />
              <img src="/logo-otbi.png" alt="Osmania Technology Business Incubator" className="h-14 sm:h-16 w-auto object-contain" />
              <img src="/logo-tchetty.png" alt="Tchetty" className="h-14 sm:h-16 w-auto object-contain" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/58 px-4 py-2 text-sm font-semibold text-muted-foreground backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Problem Statement + Product Solution
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.7 }}
              className="max-w-4xl text-balance text-5xl font-black leading-[0.96] tracking-normal sm:text-6xl lg:text-7xl"
            >
              <span className="gradient-text">Unified Open Data Hub</span>{" "}
              (India-Focused)
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.7 }}
              className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
            >
              A centralized web platform where students and researchers can
              search, preview, download, and track Indian open datasets across
              pollution, health, education, population, and more.
            </motion.p>


          </div>

          <ProductInterface />
        </div>
      </section>

      <ProblemSection />
      <SolutionSection />
      <ProjectsSection />
      <FeatureSection />
      <TechStackSection />
      <AboutUsSection />
      <Footer />
    </main>
  );
}

function ProductInterface() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.78, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass mx-auto w-full max-w-2xl rounded-lg p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <motion.span 
            className="h-3 w-3 rounded-full bg-rose-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          />
          <motion.span 
            className="h-3 w-3 rounded-full bg-amber-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.span 
            className="h-3 w-3 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />
        </div>
        <motion.span 
          className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-bold text-emerald-500"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Public beta
        </motion.span>
      </div>

      <div className="rounded-lg border border-border/70 bg-background/78 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.label 
            className="flex min-h-12 flex-1 items-center gap-3 rounded-md border border-border/70 bg-background px-4"
            whileFocus={{ scale: 1.02, borderColor: "rgb(34, 211, 238)" }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Search className="h-5 w-5 text-cyan-500" />
            </motion.div>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search pollution, NFHS, census..."
              aria-label="Search datasets"
            />
          </motion.label>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="mt-3 grid gap-2 text-xs font-bold text-muted-foreground sm:grid-cols-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, staggerChildren: 0.1 }}
        >
          {["Domain: Health", "Format: CSV", "Year: 2025", "State: Delhi"].map((item, index) => (
            <motion.span 
              key={item} 
              className="rounded-full border border-border/70 bg-muted/50 px-3 py-2 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(34, 211, 238, 0.1)" }}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}

function StatsSection() {
  return (
    <section className="section-shell bg-background py-12">
      <div className="container grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label], index) => (
          <Reveal key={label}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="p-6 text-center">
                <p className="text-3xl font-black">
                  <AnimatedCounter value={value} />
                </p>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">{label}</p>
              </Card>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="section-shell bg-muted/35 py-24">
      <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-400">Problem Statement</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
              Open data in India is valuable, but hard to find and use.
            </h2>
          </motion.div>
        </Reveal>
        <div className="grid gap-4">
          {problemPoints.map((point, index) => (
            <Reveal key={point}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ x: 8, scale: 1.02 }}
              >
                <Card className="flex gap-4 p-5">
                  <motion.span 
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/14 text-sm font-black text-rose-400"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {index + 1}
                  </motion.span>
                  <p className="text-base leading-7 text-muted-foreground">{point}</p>
                </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section id="solution" className="section-shell bg-background py-24">
      <div className="container grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <Reveal>
          <motion.div
            whileHover={{ x: -5 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">Solution</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
              One searchable hub for Indian open datasets.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              The platform brings datasets from major public portals into one
              beginner-friendly catalog with metadata, previews, downloads,
              authentication, and admin dataset management.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["data.gov.in", "CPCB", "ICMR", "NFHS", "State portals", "Research sources"].map((source, index) => (
              <motion.div 
                key={source} 
                className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/72 p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, delay: index * 0.2 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </motion.div>
                <span className="font-black">{source}</span>
              </motion.div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <motion.div
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <motion.span 
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/14 text-cyan-500"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <MapPinned className="h-6 w-6" />
                </motion.span>
                <div>
                  <h3 className="text-xl font-black">Centralized Dataset Flow</h3>
                  <p className="text-sm text-muted-foreground">Search, preview, download, track.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {["User searches topic", "Hub filters datasets", "Preview table appears", "Download is tracked"].map((step, index) => (
                  <motion.div 
                    key={step} 
                    className="flex items-center gap-3 rounded-lg bg-muted/50 p-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: -5, scale: 1.02 }}
                  >
                    <motion.span 
                      className="text-sm font-black text-cyan-400"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      0{index + 1}
                    </motion.span>
                    <span className="font-semibold">{step}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section id="features" className="section-shell bg-muted/35 py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-500">Key Features</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
              Everything needed for a complete open data platform.
            </h2>
          </motion.div>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, detail, icon: Icon }, index) => (
            <Reveal key={title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <Card className="h-full p-5">
                  <motion.span 
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-500/14 text-cyan-500"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.span>
                  <h3 className="mt-5 text-lg font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
                </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CatalogSection() {
  return (
    <section id="datasets" className="section-shell bg-background py-24">
      <div className="container">
        <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">Dataset Catalog</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
              Searchable cards with clean metadata.
            </h2>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="secondary">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </motion.div>
        </Reveal>

        <motion.div 
          className="mt-8 grid gap-3 rounded-lg border border-border/70 bg-card/60 p-3 backdrop-blur-xl md:grid-cols-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {["Keyword", "Domain", "Format", "Year", "State"].map((filter, index) => (
            <motion.label 
              key={filter} 
              className="rounded-md border border-border/70 bg-background/70 px-3 py-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.08 }}
              whileHover={{ scale: 1.05, borderColor: "rgb(34, 211, 238)" }}
            >
              <span className="text-xs font-black uppercase text-muted-foreground">{filter}</span>
              <input
                className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder={filter === "Keyword" ? "air quality" : "All"}
                aria-label={filter}
              />
            </motion.label>
          ))}
        </motion.div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {datasets.map((dataset, index) => (
            <Reveal key={dataset.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full p-5">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: index * 0.3 }}
                    >
                      <Database className="h-6 w-6 text-cyan-500" />
                    </motion.div>
                    <motion.span 
                      className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-black text-emerald-500"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {dataset.format}
                    </motion.span>
                  </div>
                  <h3 className="text-lg font-black leading-7">{dataset.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{dataset.description}</p>
                  <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <p><span className="font-semibold text-foreground">Domain:</span> {dataset.domain}</p>
                    <p><span className="font-semibold text-foreground">State:</span> {dataset.state}</p>
                    <p><span className="font-semibold text-foreground">Source:</span> {dataset.source}</p>
                    <p><span className="font-semibold text-foreground">Size:</span> {dataset.size}</p>
                    <p><span className="font-semibold text-foreground">Downloads:</span> {dataset.downloads}</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="mt-6 w-full" variant="secondary">
                      Preview Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="mt-8 overflow-hidden p-0">
              <div className="border-b border-border/70 p-5">
                <h3 className="text-xl font-black">Dataset Details Preview</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Users can inspect sample rows before downloading the dataset.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-muted/60 text-muted-foreground">
                    <tr>
                      {["State/City", "Domain", "Indicator", "Value", "Source"].map((heading) => (
                        <motion.th 
                          key={heading} 
                          className="px-5 py-3 font-black"
                          whileHover={{ backgroundColor: "rgba(34, 211, 238, 0.1)" }}
                        >
                          {heading}
                        </motion.th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, rowIndex) => (
                      <motion.tr 
                        key={row.join("-")} 
                        className="border-t border-border/70"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + rowIndex * 0.1 }}
                        whileHover={{ backgroundColor: "rgba(34, 211, 238, 0.05)" }}
                      >
                        {row.map((cell, cellIndex) => (
                          <td key={cell} className="px-5 py-4 text-muted-foreground">{cell}</td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function AdminSection() {
  return (
    <section className="section-shell bg-muted/35 py-24">
      <div className="container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-500">Admin + Statistics</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
              Manage datasets and track real usage.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              JWT authentication protects admin operations while download
              statistics show which datasets are helping students and researchers.
            </p>
          </motion.div>
        </Reveal>
        <Reveal>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Add", Upload],
                  ["Edit", Edit3],
                  ["Delete", Trash2]
                ].map(([label, Icon], index) => (
                  <motion.div
                    key={label as string}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="secondary">
                      <Icon className="h-4 w-4" />
                      {label as string}
                    </Button>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {domains.map(({ name, count, icon: Icon, color }, index) => (
                  <motion.div 
                    key={name} 
                    className="rounded-lg border border-border/70 bg-background/65 p-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: index * 0.3 }}
                      >
                        <Icon className={`h-5 w-5 ${color}`} />
                      </motion.div>
                      <span className="font-black">{name}</span>
                    </div>
                    <motion.p 
                      className="mt-3 text-2xl font-black"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {count}
                    </motion.p>
                    <p className="text-sm text-muted-foreground">downloads this month</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function TechStackSection() {
  const stack = ["HTML", "CSS", "JavaScript", "Bootstrap 5", "Node.js", "Express", "MySQL", "JWT authentication"];

  return (
    <section id="tech" className="section-shell bg-background py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-400">Tech Stack</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
              Built with practical web technologies.
            </h2>
          </motion.div>
        </Reveal>
        <motion.div 
          className="mt-10 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {stack.map((item, index) => (
            <motion.span 
              key={item} 
              className="rounded-full border border-border/70 bg-card/72 px-5 py-3 text-sm font-black shadow-soft"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4 + index * 0.08, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.15, 
                rotate: 5,
                backgroundColor: "rgba(251, 191, 36, 0.1)",
                borderColor: "rgb(251, 191, 36)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}



function ProjectsSection() {
  return (
    <section id="projects" className="section-shell bg-background py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-500">Explore Domains</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
            Domains of Indian open data.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Click a domain box to explore its projects.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allDomains.map(({ name, description, icon: Icon, color, bg, href, dashboardUrl }) => (
            <Reveal key={name}>
              <Card className="group h-full cursor-pointer p-5 transition-all hover:shadow-glow">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-black">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <motion.a
                  href={href}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className={`mt-4 flex items-center gap-1 text-sm font-bold ${color}`}
                >
                  View Projects <ArrowRight className="h-3.5 w-3.5" />
                </motion.a>

              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DomainsSection() {
  return (
    <section id="domains" className="section-shell bg-background py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-500">Explore Domains</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
            Domains of Indian open data.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From population to smart cities — explore verified datasets across every major sector.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allDomains.map(({ name, description, icon: Icon, color, bg, href }, i) => (
            <Reveal key={name}>
              <motion.a
                href={href}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="block h-full"
              >
                <Card className="group h-full cursor-pointer p-5 transition-all hover:shadow-glow">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-black">{name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  <div className={`mt-4 flex items-center gap-1 text-sm font-bold ${color}`}>
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Card>
              </motion.a>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Button size="lg" asChild>
            <a href="/login">
              Access All Datasets
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function AboutUsSection() {
  const team = [
    {
      name: "Ch. Manish Vardhan Kumar",
      role: "Full-Stack Developer & Project Lead",
      bio: "Designed and built the Unified Open Data Hub from the ground up — architecture, backend APIs, authentication, and the entire frontend experience.",
      initials: "MV",
      color: "bg-cyan-500/14 text-cyan-400",
      linkedin: "https://www.linkedin.com/in/manish-vardhan"
    },
    {
      name: "B. Thanuja",
      role: "Team Member",
      bio: "Worked on dataset validation, content structuring, and ensuring quality across the platform's open data catalog.",
      initials: "BT",
      color: "bg-amber-500/14 text-amber-400",
      linkedin: "https://www.linkedin.com/in/thanuja-sri-b-9a949140a"
    },
    {
      name: "P. Eshwar Sai Goud",
      role: "Team Member",
      bio: "Contributed to the research, data curation, and domain analysis that powers the Unified Open Data Hub.",
      initials: "ES",
      color: "bg-emerald-500/14 text-emerald-400",
      linkedin: "https://www.linkedin.com/in/eshwar17/"
    }
  ];

  const values = [
    { label: "Open Access", detail: "Every dataset is freely available — no paywalls, no sign-up friction for browsing.", icon: ShieldCheck, color: "text-cyan-400" },
    { label: "Data Quality", detail: "Metadata is standardized and sources are verified before being indexed.", icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Student First", detail: "Built with beginners in mind — clean UI, readable metadata, and guided project ideas.", icon: GraduationCap, color: "text-amber-400" },
    { label: "India Focused", detail: "Tailored specifically for Indian datasets, state boundaries, and local research needs.", icon: MapPinned, color: "text-rose-400" }
  ];

  return (
    <section id="about" className="section-shell bg-muted/35 py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-500">About Us</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
            Built to make Indian open data accessible.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            The Unified Open Data Hub is a public-interest project that centralizes India's fragmented
            open datasets into one searchable, beginner-friendly platform for students, researchers,
            and anyone who believes data should be easy to find and use.
          </p>
        </Reveal>

        {/* Values */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ label, detail, icon: Icon, color }) => (
            <Reveal key={label}>
              <Card className="h-full p-5">
                <Icon className={`h-6 w-6 ${color}`} />
                <h3 className="mt-4 font-black">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Team / Contributors */}
        <Reveal className="mt-16 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">The Team</p>
          <h3 className="mt-2 text-2xl font-black">Who's behind this platform</h3>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {team.map(({ name, role, bio, initials, color, linkedin }) => (
            <Reveal key={name}>
              <Card className="h-full p-6">
                <h3 className="text-lg font-black">{name}</h3>
                <p className="text-sm font-semibold text-cyan-500">{role}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{bio}</p>
                {linkedin ? (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/50 px-4 py-2 text-xs font-bold text-muted-foreground transition hover:border-cyan-500/50 hover:text-cyan-400"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn Profile
                  </a>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Mission statement */}
        <Reveal className="mt-14">
          <Card className="bg-foreground p-8 text-center text-background">
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-cyan-300" />
            <h3 className="text-2xl font-black">Our Mission</h3>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-background/80">
              To remove the friction between curious minds and India's public data — making it
              searchable, understandable, and actionable for every student, researcher, and
              civic technologist in the country.
            </p>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/35 py-10">
      <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
              <Database className="h-5 w-5" />
            </span>
            <span className="font-black">Unified Open Data Hub (India-Focused)</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Centralized dataset discovery for students, researchers, and public-interest projects.
          </p>
        </div>
      </div>
    </footer>
  );
}
