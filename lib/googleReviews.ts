// ─────────────────────────────────────────────────────────────────────────────
// PureFlow Studios' Google reviews (same data as the /customsoftware landing page), copied from the Google Business Profile on
// 2026-10-14 (Google shows 5.0 from 31 reviews; 30 are publicly listed).
// Text is exactly as each reviewer wrote it. Google only shows relative dates
// ("10 months ago"), so `date` is that age counted back from 2026-10-14, as month
// and year. 13 reviewers left stars without text; they count toward the rating
// but aren't shown as cards.
// ─────────────────────────────────────────────────────────────────────────────

export type GoogleReviewItem = {
  name: string;
  rating: number;
  /** Month and year posted (from Google's relative date). */
  date: string;
  text: string;
  /** "Local Guide" when Google shows the badge. */
  badge?: string;
};

export const GOOGLE_PROFILE_URL = 'https://maps.google.com/?cid=16859141600534425353';
export const GOOGLE_RATING = '5.0';
export const GOOGLE_REVIEW_COUNT = 31;

/** Written reviews, newest first. */
export const GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    name: 'Mayank Chakravarti', rating: 5, date: 'Sep 2026',
    text: 'Pureflow has streamlined both our website and CRM so much that daily tasks are now completed in less time. Thank you Aviral for your amazing work.',
  },
  {
    name: 'Ankit Kumar', rating: 5, date: 'Jul 2026',
    text: 'I am extremely satisfied with the services provided by Pureflow Studios. They have developed a complete custom CRM & ERP system for our organization, including Student Management, Franchise Management, Lead CRM, WhatsApp Automation, Online Exam System, Verification Modules, University Admission Management, and many other advanced features exactly according to our requirements.\n\nThe team understands requirements very well and delivers practical solutions with a professional approach. Their support, communication, development speed, and problem-solving ability are excellent.\n\nWhat I liked most is that they are always ready to customize the software as per business needs instead of providing a fixed solution. Every module was developed with proper planning and attention to detail.\n\nI highly recommend Pureflow Studios to anyone looking for CRM development, ERP solutions, automation systems, education management software, or custom web applications.\n\nThank you for helping us build a powerful and scalable platform for our organization.',
  },
  {
    name: 'Sami uddin', rating: 4, date: 'May 2026', badge: 'Local Guide',
    text: 'Good Team  excellent execution!',
  },
  {
    name: 'Supriya Ghosh', rating: 5, date: 'Feb 2026', badge: 'Local Guide',
    text: 'PureFlow Studios did a really nice job with my WhatsApp CRM. Everything works smoothly and I’m fully satisfied with their work and support. Highly recommended!',
  },
  {
    name: 'Rohit Khatwal', rating: 5, date: 'Feb 2026',
    text: 'I had a very good experience working with Aviral .He helped me build a CRM that is user-friendly, practical, and exactly as per my requirements.\nWhat I really appreciated was his patience and support — I requested multiple changes during development, and every time he made the changes as per my requirements without hesitation.\n\nAfter facing multiple disappointments and financial losses with different developers in the past, working on this CRM project was a completely different and positive experience. Is se pehle bhut developers /it companies ne jo promise kia tha wo kabhi mila hi nahi despite of paying them money.\n\nVery happy in terms of Trust\n\nI have built 3 modules as of now but as i see further , will continue with Aviral for more modules.\n\nHighly recommended for anyone looking for a custom CRM solution 👍',
  },
  {
    name: 'Nandini Singh', rating: 5, date: 'Dec 2025',
    text: 'Nice work Aviral. Thanks for helping me grow online',
  },
  {
    name: 'Adarsh Patel', rating: 5, date: 'Dec 2025',
    text: 'Got my first 2lakh sale with Aviral\'s Good work.\nVery polite, humble.\n\nMust Recommended to grow youu Business online',
  },
  {
    name: 'Tayyaba', rating: 5, date: 'Dec 2025',
    text: 'u have done a very good job we never face any problem and everything works smoothly the app u made for us is very helpful and because of it we can see and manage everything properly thnk u Aviral',
  },
  {
    name: 'Param Agarwal', rating: 5, date: 'Dec 2025',
    text: 'The best part is how simple they kept things for us. Website, CRM and a small internal app are all easy to use, even for team members who are not very technical.',
  },
  {
    name: 'Deependra Singh Yadav', rating: 5, date: 'Dec 2025',
    text: 'I had a great experience.\nThe work was done before the deadline and was executed perfectly.\nWill surely connect again for more works.',
  },
  {
    name: 'Bobby', rating: 5, date: 'Dec 2025',
    text: 'The work is really good, the website provided was also very well made i also had a great time working with him..so if u want good work cooperate with him .',
  },
  {
    name: 'Vidushi', rating: 5, date: 'Dec 2025',
    text: 'It was such a great experience here...the service was unexpectedly faster than I thought...😊✌️',
  },
  {
    name: 'Thakur Alok Singh', rating: 5, date: 'Dec 2025',
    text: 'Website developed by Pure Flow Studio is working fabulous, my sales have increased by twice in numbers. My own app is in progress with the studio.\nThanks for reasonable price and amazing work by the studio.',
  },
  {
    name: 'Harsh Verma', rating: 5, date: 'Dec 2025',
    text: 'The new site looks modern, works smoothly on mobile, and we’ve already seen more enquiries',
  },
  {
    name: 'Kaify Abbas', rating: 5, date: 'Dec 2025',
    text: 'Pure Flow has streamlined both our website and CRM so much that daily tasks are now completed in less time. Thank you Aviral for your amazing work.',
  },
  {
    name: 'Omkar Singh', rating: 5, date: 'Oct 2025',
    text: 'Excellent service from pure flow team . Humble and fast service.. Must recommended for online growth',
  },
  {
    name: 'Safeek Khan', rating: 5, date: 'Oct 2025',
    text: 'I was really struggling to get my business (Ayesha Enterprises) noticed online. I had no idea where to start, but then I met Aviral from Pureflow Studios. He made my website and honestly, things changed so quickly after that. In just a few months, I started getting proper leads from Google and the response has been amazing.\n\nI made 5 times the money I invested in this project — seriously worth it. Aviral was super dedicated and really understood what I needed. Loved his work and attitude throughout.\n\nThank you, beta. Keep doing this good work. God bless you!',
  },
];

/** Reviewers who left 5 stars without writing anything (Dec 2025). */
export const GOOGLE_STAR_ONLY: { name: string; rating: number; date: string }[] = [
  'Rahul Singh', 'Ak patel Patel', 'Rahul Singh', 'Vishal Singh', 'Rahul Singh', 'Biru Singh', 'Aman Singh',
  'Adarsh Patel', 'MEERA SINGH', 'Dabang Manjesh', 'Durgesh Prajapati', 'Varun Kumar', 'Swatantra Singh',
].map((name) => ({ name, rating: 5, date: 'Dec 2025' }));
