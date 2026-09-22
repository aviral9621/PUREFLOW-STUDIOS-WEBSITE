// The kinds of business that ask us for software — the same list the Leads app
// uses, so what a visitor picks here reads the same on their lead. "label|keywords".
const GROUPS: Record<string, string[]> = {
  "Retail & shops": [
    "Retail store", "Kirana / grocery store|general store supermarket", "Supermarket / departmental store|mart", "Clothing & apparel store|garments boutique fashion",
    "Boutique|fashion designer", "Footwear store|shoes", "Jewellery store|jeweller gold", "Mobile & electronics store|phone shop", "Mobile company distributor|imei",
    "Furniture store|home decor", "Gift shop|gifts", "Book & stationery store", "Optical store|eyewear spectacles", "Pharmacy / medical store|chemist",
    "Sweet shop & bakery|mithai", "Hardware & sanitary store|paints tiles", "Toy store", "Sports goods store", "Pet shop", "Florist",
  ],
  "Wholesale & distribution": [
    "FMCG distributor", "Wholesale trader|wholesaler", "Pharma distributor|medicine", "Electronics distributor", "Building material supplier|cement steel",
    "Agri inputs dealer|seeds fertiliser pesticide", "Garment wholesaler|textile", "Importer / exporter|export import",
  ],
  "Manufacturing & industry": [
    "Manufacturing unit|factory", "Textile manufacturer|fabric", "Detergent & FMCG manufacturer|soap", "Food processing unit|packaged food", "Furniture manufacturer",
    "Packaging & printing|printing press", "Engineering & fabrication|machinery", "Chemical & paints manufacturer", "Plastic & rubber products", "Handicrafts & artisans|chikankari",
    "Ayurvedic & herbal products|herbal", "Cosmetics manufacturer",
  ],
  "Food & hospitality": [
    "Restaurant", "Cafe", "Cloud kitchen", "Catering service|caterer", "Hotel", "Resort & homestay|guest house", "Banquet hall & marriage lawn|wedding venue",
    "Bar & lounge|pub", "Tiffin service",
  ],
  "Travel & transport": [
    "Travel agency|tour travels tourism", "Tour operator", "Taxi & car rental|cab", "Bus operator", "Visa & immigration consultant|passport",
    "Logistics & transport company|transporter trucking", "Courier & delivery service", "Packers & movers",
  ],
  "Health & wellness": [
    "Hospital", "Clinic / doctor|physician", "Dental clinic|dentist", "Diagnostic centre / pathology lab", "Physiotherapy centre", "Eye hospital",
    "Veterinary clinic", "Gym & fitness studio", "Yoga studio", "Salon|hair parlour", "Beauty parlour & makeup artist|bridal", "Spa & wellness centre",
    "Ayurveda & homeopathy clinic", "Nutritionist / dietitian",
  ],
  "Education": [
    "School", "College / university", "Coaching institute|tuition classes", "Preschool & daycare|play school", "Training & skill institute|computer institute",
    "EdTech / online courses", "Study abroad consultant", "Library & study centre", "Music, dance & art academy",
  ],
  "Real estate & construction": [
    "Real estate agency|property dealer broker", "Builder & developer", "Construction contractor|civil", "Architect", "Interior designer", "PG & hostel|co-living",
    "Co-working space", "Solar & electrical contractor",
  ],
  "Professional services": [
    "Chartered accountant / tax consultant|ca gst", "Law firm / advocate|lawyer legal", "Financial advisor & insurance agent|mutual fund lic",
    "Loan & finance company|nbfc dsa", "HR & recruitment agency|placement staffing", "Business consultant", "Marketing & advertising agency|digital marketing",
    "IT company / software house", "Security & facility services|housekeeping manpower", "Astrologer & vastu consultant|pandit",
    "Matrimonial service|marriage bureau", "Event management company|wedding planner", "Photography & videography studio|photographer",
  ],
  "Automobile": [
    "Car dealership|showroom", "Two-wheeler dealership|bike showroom", "Used car dealer", "Garage & service centre|workshop", "Auto parts dealer|spare parts",
    "Driving school", "EV dealer & charging",
  ],
  "Online & media": [
    "E-commerce / online store|d2c", "Startup", "Content creator / influencer|youtuber", "News & media portal", "Printing & signage|flex",
  ],
  "Agriculture & others": [
    "Agriculture & farming|farm", "Dairy|milk", "Poultry & fisheries", "Nursery & gardening", "NGO / trust|foundation charity", "Religious organisation|temple",
    "Political campaign|party leader", "Government / PSU office", "Housing society / RWA", "Club & association", "Laundry & dry cleaning", "Home services|plumber electrician repair",
    "Tailoring & alterations",
  ],
};


export interface BusinessOption { value: string; group: string; keywords: string }
export const BUSINESS_TYPES: BusinessOption[] = Object.entries(GROUPS).flatMap(([group, items]) =>
  items.map((raw) => { const [value, keywords = ''] = raw.split('|'); return { value, keywords, group }; }));
export const BUSINESS_GROUPS = Object.keys(GROUPS);
