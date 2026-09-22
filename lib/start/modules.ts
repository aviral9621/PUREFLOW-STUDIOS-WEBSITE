// What a system for each kind of business usually needs. Shown as a starting
// list on the "what should it do?" step; the visitor ticks, adds, or writes.
export const MODULES_BY_GROUP: Record<string, string[]> = {
  'Retail & shops': ['Billing & GST invoices', 'Stock / inventory', 'Barcode & POS', 'Customer records & loyalty', 'Online store', 'WhatsApp order updates', 'Daily sales reports', 'Multiple branches'],
  'Wholesale & distribution': ['Order booking (dealers / salesmen)', 'Stock & godown', 'Dealer portal or app', 'Dispatch & delivery tracking', 'Payment & outstanding tracking', 'GST invoices & e-way bills', 'Scheme & discount management', 'Reports'],
  'Manufacturing & industry': ['Orders & production planning', 'Raw material & finished stock', 'Dispatch & delivery', 'Dealer / distributor portal', 'Quality & batch tracking', 'GST billing & accounts', 'Purchase & vendors', 'Reports & dashboards'],
  'Food & hospitality': ['Table / room booking', 'QR menu & ordering', 'Billing & KOT', 'Inventory & recipes', 'Online ordering website', 'Customer reviews & loyalty', 'Staff & shifts', 'WhatsApp confirmations'],
  'Travel & transport': ['Booking management', 'Itinerary / package builder', 'Payments & invoices', 'Vehicle & driver tracking', 'Customer app or website', 'WhatsApp confirmations', 'Agent / B2B portal', 'Enquiry CRM'],
  'Health & wellness': ['Appointments & reminders', 'Patient / client records', 'Prescriptions & reports', 'Billing', 'Online booking website', 'Memberships & packages', 'Staff scheduling', 'WhatsApp follow-ups'],
  'Education': ['Admissions & enquiry CRM', 'Fee collection & receipts', 'Attendance', 'Online classes / LMS', 'Parent & student app', 'Exams & results', 'WhatsApp notices', 'Website'],
  'Real estate & construction': ['Property listings website', 'Lead & follow-up CRM', 'Site-visit scheduling', 'Brochures & pricing sheets', 'Payment schedules & receipts', 'Project / material tracking', 'Broker portal', 'WhatsApp automation'],
  'Professional services': ['Client CRM & follow-ups', 'Quotations & invoices', 'Appointment booking', 'Document management', 'Task & project tracking', 'Website', 'Payment collection', 'WhatsApp reminders'],
  'Automobile': ['Service / job cards', 'Service booking & reminders', 'Spare parts inventory', 'Billing & GST', 'Vehicle & customer history', 'Enquiry & test-drive CRM', 'Website', 'WhatsApp updates'],
  'Online & media': ['E-commerce store', 'Payments & delivery tracking', 'Customer app', 'Marketing & WhatsApp automation', 'Order management', 'Analytics dashboard', 'Content / CMS', 'Subscriptions'],
  'Agriculture & others': ['Members / customers database', 'Billing & receipts', 'Stock & supplies', 'Bookings & scheduling', 'Website', 'WhatsApp automation', 'Reports', 'Mobile app'],
};
export const GENERAL_MODULES = ['CRM & follow-ups', 'Billing & GST invoices', 'Inventory / stock', 'Website', 'Mobile app', 'WhatsApp automation', 'Online payments', 'Reports & dashboards'];
