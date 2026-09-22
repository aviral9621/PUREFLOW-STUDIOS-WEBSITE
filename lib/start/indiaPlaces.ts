// Every Indian state with its cities — "City, State" is what we keep.
const PLACES: [state: string, code: string, cities: string][] = [
  ["Uttar Pradesh", "UP", "Lucknow|Kanpur|Noida|Greater Noida|Ghaziabad|Agra|Varanasi=Banaras Kashi|Prayagraj=Allahabad|Meerut|Bareilly|Aligarh|Moradabad|Gorakhpur|Saharanpur|Jhansi|Ayodhya=Faizabad|Mathura|Vrindavan|Firozabad|Muzaffarnagar|Shahjahanpur|Rampur|Mau|Farrukhabad|Hapur|Etawah|Mirzapur|Bulandshahr|Sambhal|Amroha|Hardoi|Fatehpur|Raebareli|Orai|Sitapur|Bahraich|Modinagar|Unnao|Jaunpur|Lakhimpur Kheri|Hathras|Banda|Pilibhit|Barabanki|Khurja|Gonda|Mainpuri|Lalitpur|Etah|Deoria|Badaun=Budaun|Ghazipur|Sultanpur|Azamgarh|Bijnor|Basti|Chandausi|Akbarpur|Ballia|Tanda|Shamli|Kasganj|Baghpat|Kannauj|Auraiya|Amethi|Pratapgarh|Kaushambi|Chitrakoot|Mahoba|Hamirpur|Sonbhadra|Robertsganj|Chandauli|Bhadohi|Sant Kabir Nagar|Siddharthnagar|Maharajganj|Kushinagar|Balrampur|Shravasti|Ambedkar Nagar|Kanpur Dehat"],
  ["Madhya Pradesh", "MP", "Indore|Bhopal|Jabalpur|Gwalior|Ujjain|Sagar|Dewas|Satna|Ratlam|Rewa|Katni|Singrauli|Burhanpur|Khandwa|Bhind|Chhindwara|Guna|Shivpuri|Vidisha|Chhatarpur|Damoh|Mandsaur|Khargone|Neemuch|Pithampur|Hoshangabad=Narmadapuram|Itarsi|Sehore|Betul|Seoni|Datia|Nagda|Morena|Shahdol|Balaghat|Tikamgarh|Mhow|Panna|Jhabua|Dhar"],
  ["Maharashtra", "MH", "Mumbai=Bombay|Pune|Nagpur|Thane|Nashik|Navi Mumbai|Aurangabad=Chhatrapati Sambhajinagar|Solapur|Kalyan-Dombivli|Vasai-Virar|Pimpri-Chinchwad|Amravati|Kolhapur|Nanded|Sangli|Malegaon|Jalgaon|Akola|Latur|Dhule|Ahmednagar=Ahilyanagar|Chandrapur|Parbhani|Ichalkaranji|Jalna|Bhiwandi|Panvel|Ulhasnagar|Mira-Bhayandar|Satara|Beed|Yavatmal|Ratnagiri|Wardha|Gondia|Baramati|Osmanabad=Dharashiv|Lonavala|Alibag|Shirdi"],
  ["Delhi", "DL", "New Delhi|Delhi|Dwarka|Rohini|Saket|Karol Bagh|Connaught Place|Janakpuri|Laxmi Nagar|Pitampura|Vasant Kunj|Okhla|Nehru Place|Shahdara"],
  ["Haryana", "HR", "Gurugram=Gurgaon|Faridabad|Panipat|Ambala|Yamunanagar|Rohtak|Hisar|Karnal|Sonipat|Panchkula|Bhiwani|Sirsa|Bahadurgarh|Jind|Thanesar|Kurukshetra|Kaithal|Rewari|Palwal|Manesar|Jhajjar|Fatehabad|Narnaul"],
  ["Punjab", "PB", "Ludhiana|Amritsar|Jalandhar|Patiala|Bathinda|Mohali=SAS Nagar|Hoshiarpur|Batala|Pathankot|Moga|Abohar|Malerkotla|Khanna|Phagwara|Muktsar|Barnala|Rajpura|Firozpur|Kapurthala|Zirakpur|Sangrur|Faridkot|Gurdaspur|Rupnagar=Ropar"],
  ["Chandigarh", "CH", "Chandigarh"],
  ["Rajasthan", "RJ", "Jaipur|Jodhpur|Kota|Bikaner|Ajmer|Udaipur|Bhilwara|Alwar|Bharatpur|Sikar|Pali|Sri Ganganagar|Tonk|Kishangarh|Beawar|Hanumangarh|Dhaulpur|Gangapur City|Sawai Madhopur|Churu|Jhunjhunu|Barmer|Jaisalmer|Chittorgarh|Nagaur|Banswara|Bundi|Mount Abu|Pushkar|Neemrana|Bhiwadi|Dausa|Jhalawar|Baran|Sirohi"],
  ["Gujarat", "GJ", "Ahmedabad|Surat|Vadodara=Baroda|Rajkot|Bhavnagar|Jamnagar|Junagadh|Gandhinagar|Gandhidham|Anand|Navsari|Morbi|Nadiad|Surendranagar|Bharuch|Mehsana|Bhuj|Porbandar|Palanpur|Valsad|Vapi|Gondal|Veraval|Godhra|Patan|Kalol|Dahod|Botad|Amreli|Ankleshwar|Dwarka|Himmatnagar"],
  ["Bihar", "BR", "Patna|Gaya|Bhagalpur|Muzaffarpur|Purnia|Darbhanga|Bihar Sharif|Arrah|Begusarai|Katihar|Munger|Chhapra|Danapur|Saharsa|Sasaram|Hajipur|Dehri|Siwan|Motihari|Nawada|Bagaha|Buxar|Kishanganj|Sitamarhi|Jamalpur|Jehanabad|Aurangabad|Bettiah|Madhubani|Samastipur|Bodh Gaya|Rajgir"],
  ["Jharkhand", "JH", "Ranchi|Jamshedpur|Dhanbad|Bokaro Steel City|Deoghar|Phusro|Hazaribagh|Giridih|Ramgarh|Medininagar=Daltonganj|Chirkunda|Dumka|Chaibasa|Gumla|Koderma|Sahibganj"],
  ["West Bengal", "WB", "Kolkata=Calcutta|Howrah|Durgapur|Asansol|Siliguri|Bardhaman=Burdwan|Malda|Baharampur|Habra|Kharagpur|Shantipur|Dankuni|Haldia|Raiganj|Krishnanagar|Nabadwip|Medinipur|Jalpaiguri|Balurghat|Bankura|Darjeeling|Kalimpong|Cooch Behar|Alipurduar|Purulia|Salt Lake|New Town|Barasat|Barrackpore|Serampore|Chandannagar"],
  ["Odisha", "OD", "Bhubaneswar|Cuttack|Rourkela|Berhampur=Brahmapur|Sambalpur|Puri|Balasore|Bhadrak|Baripada|Jharsuguda|Jeypore|Bargarh|Angul|Dhenkanal|Paradip|Koraput|Rayagada|Kendujhar=Keonjhar"],
  ["Chhattisgarh", "CG", "Raipur|Bhilai|Bilaspur|Korba|Durg|Rajnandgaon|Raigarh|Jagdalpur|Ambikapur|Dhamtari|Mahasamund|Chirmiri|Kanker|Kawardha"],
  ["Uttarakhand", "UK", "Dehradun|Haridwar|Roorkee|Haldwani|Rudrapur|Kashipur|Rishikesh|Nainital|Mussoorie|Almora|Pithoragarh|Kotdwar|Ramnagar|Pauri|Srinagar|Tehri|Uttarkashi|Chamoli|Bageshwar|Champawat"],
  ["Himachal Pradesh", "HP", "Shimla|Mandi|Solan|Dharamshala|Baddi|Nahan|Palampur|Kullu|Manali|Hamirpur|Una|Bilaspur|Chamba|Kangra|Paonta Sahib|Parwanoo|Kasauli|Dalhousie"],
  ["Jammu and Kashmir", "JK", "Srinagar|Jammu|Anantnag|Baramulla|Sopore|Kathua|Udhampur|Punch|Rajouri|Pulwama|Kupwara|Katra|Gulmarg|Pahalgam"],
  ["Ladakh", "LA", "Leh|Kargil"],
  ["Karnataka", "KA", "Bengaluru=Bangalore|Mysuru=Mysore|Hubballi-Dharwad=Hubli|Mangaluru=Mangalore|Belagavi=Belgaum|Kalaburagi=Gulbarga|Davanagere|Ballari=Bellary|Vijayapura=Bijapur|Shivamogga=Shimoga|Tumakuru=Tumkur|Raichur|Bidar|Hosapete=Hospet|Hassan|Gadag|Udupi|Robertsonpet|Bhadravati|Chitradurga|Kolar|Mandya|Chikkamagaluru|Bagalkot|Madikeri=Coorg|Karwar|Manipal"],
  ["Tamil Nadu", "TN", "Chennai=Madras|Coimbatore|Madurai|Tiruchirappalli=Trichy|Salem|Tirunelveli|Tiruppur|Vellore|Erode|Thoothukudi=Tuticorin|Dindigul|Thanjavur|Ranipet|Sivakasi|Karur|Udhagamandalam=Ooty|Hosur|Nagercoil|Kanchipuram|Kumbakonam|Cuddalore|Tiruvannamalai|Pollachi|Rajapalayam|Pudukkottai|Nagapattinam|Namakkal|Kanyakumari|Rameswaram|Tambaram|Avadi"],
  ["Kerala", "KL", "Thiruvananthapuram=Trivandrum|Kochi=Cochin Ernakulam|Kozhikode=Calicut|Kollam=Quilon|Thrissur|Kannur|Alappuzha=Alleppey|Palakkad|Malappuram|Kottayam|Manjeri|Thalassery|Ponnani|Vatakara|Kasaragod|Pathanamthitta|Idukki|Munnar|Wayanad|Kalpetta|Guruvayur"],
  ["Andhra Pradesh", "AP", "Visakhapatnam=Vizag|Vijayawada|Guntur|Nellore|Kurnool|Rajahmundry=Rajamahendravaram|Tirupati|Kakinada|Kadapa|Anantapur|Vizianagaram|Eluru|Ongole|Nandyal|Machilipatnam|Adoni|Tenali|Proddatur|Chittoor|Hindupur|Bhimavaram|Madanapalle|Guntakal|Srikakulam|Amaravati"],
  ["Telangana", "TS", "Hyderabad|Secunderabad|Warangal|Nizamabad|Karimnagar|Khammam|Ramagundam|Mahbubnagar|Nalgonda|Adilabad|Suryapet|Siddipet|Miryalaguda|Jagtial|Mancherial|Sangareddy|Medak|Gachibowli|Hitech City"],
  ["Goa", "GA", "Panaji=Panjim|Margao=Madgaon|Vasco da Gama|Mapusa|Ponda|Calangute|Candolim"],
  ["Assam", "AS", "Guwahati|Silchar|Dibrugarh|Jorhat|Nagaon|Tinsukia|Tezpur|Bongaigaon|Dhubri|Diphu|North Lakhimpur|Karimganj|Sivasagar|Goalpara|Barpeta"],
  ["Arunachal Pradesh", "AR", "Itanagar|Naharlagun|Pasighat|Tawang|Ziro|Bomdila|Tezu"],
  ["Manipur", "MN", "Imphal|Thoubal|Bishnupur|Churachandpur|Ukhrul"],
  ["Meghalaya", "ML", "Shillong|Tura|Jowai|Nongstoin|Cherrapunji=Sohra"],
  ["Mizoram", "MZ", "Aizawl|Lunglei|Champhai|Serchhip|Kolasib"],
  ["Nagaland", "NL", "Kohima|Dimapur|Mokokchung|Tuensang|Wokha"],
  ["Sikkim", "SK", "Gangtok|Namchi|Gyalshing=Geyzing|Mangan|Pelling"],
  ["Tripura", "TR", "Agartala|Udaipur|Dharmanagar|Kailashahar|Belonia"],
  ["Puducherry", "PY", "Puducherry=Pondicherry|Karaikal|Mahe|Yanam"],
  ["Andaman and Nicobar Islands", "AN", "Port Blair=Sri Vijaya Puram|Havelock Island"],
  ["Dadra and Nagar Haveli and Daman and Diu", "DN", "Daman|Diu|Silvassa"],
  ["Lakshadweep", "LD", "Kavaratti|Agatti"],
];


export interface PlaceOption { value: string; label: string; hint: string; keywords: string }
export const INDIA_PLACES: PlaceOption[] = [
  ...PLACES.flatMap(([state, code, cities]) => cities.split('|').map((raw) => {
    const [city, also] = raw.split('=');
    return { value: city === state ? city : `${city}, ${state}`, label: city, hint: `${state} · ${code}`, keywords: `${code} ${also ?? ''}` };
  })),
  ...PLACES.filter(([state, , cities]) => !cities.split('|').some((c) => c.split('=')[0] === state))
    .map(([state, code]) => ({ value: state, label: state, hint: `State · ${code}`, keywords: code })),
];
