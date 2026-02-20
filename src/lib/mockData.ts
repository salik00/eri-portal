// Mock data for demo mode - all country, university, and lead data

export interface Country {
    slug: string
    name: string
    flag: string
    visaSuccessRate: number
    avgScholarship: string
    topUniversities: University[]
    visaProcess: string[]
    description: string
    avgTuition: string
    processingTime: string
    popularCourses: string[]
    color: string
}

export interface University {
    name: string
    ranking: number
    tuitionMin: number
    tuitionMax: number
    courses: string[]
    scholarshipAvailable: boolean
}

export interface Lead {
    id: string
    name: string
    email: string
    phone: string
    country: string
    budget: string
    status: 'inquiry' | 'application' | 'visa' | 'departure'
    createdAt: string
    notes: string
    message: string
}

export interface Document {
    id: string
    userId: string
    type: 'passport' | 'ielts' | 'transcript' | 'other'
    name: string
    url: string
    uploadedAt: string
    size: string
}

export const COUNTRIES: Country[] = [
    {
        slug: 'usa',
        name: 'United States',
        flag: '🇺🇸',
        visaSuccessRate: 78,
        avgScholarship: '$15,000 - $45,000',
        avgTuition: '$25,000 - $60,000/yr',
        processingTime: '3-5 months',
        description: 'Home to world-renowned Ivy League universities and cutting-edge research facilities. The USA offers unmatched academic diversity and career opportunities.',
        color: '#B22234',
        popularCourses: ['Computer Science', 'MBA', 'Engineering', 'Medicine', 'Law'],
        visaProcess: [
            'Receive university acceptance letter',
            'Pay SEVIS fee ($350)',
            'Complete DS-160 form online',
            'Schedule visa interview at US Embassy',
            'Attend visa interview with documents',
            'Receive F-1 student visa',
        ],
        topUniversities: [
            { name: 'Massachusetts Institute of Technology (MIT)', ranking: 1, tuitionMin: 55000, tuitionMax: 60000, courses: ['Engineering', 'CS', 'Physics'], scholarshipAvailable: true },
            { name: 'Harvard University', ranking: 2, tuitionMin: 52000, tuitionMax: 58000, courses: ['MBA', 'Law', 'Medicine'], scholarshipAvailable: true },
            { name: 'Stanford University', ranking: 3, tuitionMin: 53000, tuitionMax: 59000, courses: ['CS', 'Business', 'Engineering'], scholarshipAvailable: true },
            { name: 'University of Chicago', ranking: 10, tuitionMin: 47000, tuitionMax: 55000, courses: ['Economics', 'Law', 'Business'], scholarshipAvailable: true },
        ],
    },
    {
        slug: 'uk',
        name: 'United Kingdom',
        flag: '🇬🇧',
        visaSuccessRate: 85,
        avgScholarship: '£5,000 - £20,000',
        avgTuition: '£15,000 - £38,000/yr',
        processingTime: '3-8 weeks',
        description: 'The UK hosts Oxford, Cambridge, and Imperial College — institutions that have shaped global thought for centuries. Shorter degree programs mean faster ROI.',
        color: '#CF142B',
        popularCourses: ['Business', 'Law', 'Medicine', 'Finance', 'Arts'],
        visaProcess: [
            'Receive CAS (Confirmation of Acceptance for Studies)',
            'Apply for Student Visa online',
            'Pay Immigration Health Surcharge',
            'Book biometrics appointment',
            'Submit documents at Visa Application Centre',
            'Receive visa decision (usually 3 weeks)',
        ],
        topUniversities: [
            { name: 'University of Oxford', ranking: 1, tuitionMin: 28000, tuitionMax: 38000, courses: ['PPE', 'Medicine', 'Law'], scholarshipAvailable: true },
            { name: 'University of Cambridge', ranking: 2, tuitionMin: 27000, tuitionMax: 37000, courses: ['Sciences', 'Engineering', 'Economics'], scholarshipAvailable: true },
            { name: 'Imperial College London', ranking: 7, tuitionMin: 32000, tuitionMax: 42000, courses: ['Engineering', 'Business', 'Medicine'], scholarshipAvailable: true },
            { name: 'London School of Economics', ranking: 15, tuitionMin: 22000, tuitionMax: 30000, courses: ['Economics', 'Finance', 'Law'], scholarshipAvailable: true },
        ],
    },
    {
        slug: 'australia',
        name: 'Australia',
        flag: '🇦🇺',
        visaSuccessRate: 88,
        avgScholarship: 'AUD 10,000 - AUD 30,000',
        avgTuition: 'AUD 20,000 - AUD 45,000/yr',
        processingTime: '4-6 weeks',
        description: 'Australia combines world-class education with an enviable lifestyle. Its post-study work rights (up to 4 years) make it a top destination for career-focused students.',
        color: '#00008B',
        popularCourses: ['Engineering', 'IT', 'Nursing', 'Business', 'Environmental Science'],
        visaProcess: [
            'Receive CoE (Confirmation of Enrolment)',
            'Meet GTE (Genuine Temporary Entrant) requirement',
            'Apply for Student Visa (subclass 500) online',
            'Submit biometrics if required',
            'Receive visa grant (usually 4-8 weeks)',
            'Arrive and begin studies',
        ],
        topUniversities: [
            { name: 'University of Melbourne', ranking: 14, tuitionMin: 35000, tuitionMax: 45000, courses: ['Medicine', 'Engineering', 'Law'], scholarshipAvailable: true },
            { name: 'Australian National University', ranking: 30, tuitionMin: 28000, tuitionMax: 40000, courses: ['Sciences', 'Policy', 'Arts'], scholarshipAvailable: true },
            { name: 'University of Sydney', ranking: 19, tuitionMin: 32000, tuitionMax: 44000, courses: ['Business', 'Medicine', 'Engineering'], scholarshipAvailable: true },
            { name: 'University of Queensland', ranking: 47, tuitionMin: 25000, tuitionMax: 38000, courses: ['Pharmacy', 'IT', 'Business'], scholarshipAvailable: true },
        ],
    },
    {
        slug: 'canada',
        name: 'Canada',
        flag: '🇨🇦',
        visaSuccessRate: 82,
        avgScholarship: 'CAD 10,000 - CAD 25,000',
        avgTuition: 'CAD 15,000 - CAD 35,000/yr',
        processingTime: '8-12 weeks',
        description: 'Canada offers affordable tuition, a welcoming immigration policy, and a path to Permanent Residency. It\'s one of the safest and most multicultural nations on earth.',
        color: '#FF0000',
        popularCourses: ['IT', 'Business Analytics', 'Healthcare', 'Engineering', 'Finance'],
        visaProcess: [
            'Receive Letter of Acceptance from Canadian institution',
            'Apply for Study Permit online or at embassy',
            'Provide biometrics',
            'Medical examination if required',
            'Receive Study Permit',
            'Apply for PAL (Port of Entry Letter)',
        ],
        topUniversities: [
            { name: 'University of Toronto', ranking: 21, tuitionMin: 30000, tuitionMax: 40000, courses: ['Medicine', 'Engineering', 'Business'], scholarshipAvailable: true },
            { name: 'University of British Columbia', ranking: 37, tuitionMin: 28000, tuitionMax: 38000, courses: ['Sciences', 'Business', 'Arts'], scholarshipAvailable: true },
            { name: 'McGill University', ranking: 46, tuitionMin: 20000, tuitionMax: 30000, courses: ['Medicine', 'Law', 'Engineering'], scholarshipAvailable: true },
            { name: 'University of Alberta', ranking: 111, tuitionMin: 18000, tuitionMax: 28000, courses: ['IT', 'Energy', 'Business'], scholarshipAvailable: true },
        ],
    },
    {
        slug: 'denmark',
        name: 'Denmark',
        flag: '🇩🇰',
        visaSuccessRate: 90,
        avgScholarship: 'DKK 50,000 - DKK 120,000',
        avgTuition: 'EU: Free | Non-EU: DKK 60,000 - DKK 120,000/yr',
        processingTime: '2-3 months',
        description: 'Denmark leads in innovation, sustainability, and quality of life. Many programs are taught in English, and the country is famous for its work-life balance culture.',
        color: '#C60C30',
        popularCourses: ['Sustainable Energy', 'IT', 'Design', 'Architecture', 'Business'],
        visaProcess: [
            'Receive university admission letter',
            'Apply for Residence Permit for studies',
            'Prove financial means (DKK 5,500/month)',
            'Health insurance documentation',
            'Permit processed (usually 2 months)',
            'Register with Civil Registration System on arrival',
        ],
        topUniversities: [
            { name: 'University of Copenhagen', ranking: 87, tuitionMin: 15000, tuitionMax: 18000, courses: ['Sciences', 'Medicine', 'Social Sciences'], scholarshipAvailable: true },
            { name: 'Technical University of Denmark (DTU)', ranking: 120, tuitionMin: 14000, tuitionMax: 17000, courses: ['Engineering', 'IT', 'Physics'], scholarshipAvailable: true },
            { name: 'Aarhus University', ranking: 150, tuitionMin: 12000, tuitionMax: 16000, courses: ['Business', 'Law', 'Sciences'], scholarshipAvailable: false },
            { name: 'Copenhagen Business School', ranking: 200, tuitionMin: 13000, tuitionMax: 16000, courses: ['MBA', 'Finance', 'Management'], scholarshipAvailable: true },
        ],
    },
    {
        slug: 'new-zealand',
        name: 'New Zealand',
        flag: '🇳🇿',
        visaSuccessRate: 87,
        avgScholarship: 'NZD 5,000 - NZD 20,000',
        avgTuition: 'NZD 22,000 - NZD 40,000/yr',
        processingTime: '4-8 weeks',
        description: 'New Zealand offers a safe, friendly environment with world-class universities. Students enjoy the scenery, outdoor lifestyle, and strong post-study work opportunities.',
        color: '#00247D',
        popularCourses: ['Agriculture', 'Tourism', 'Engineering', 'Business', 'IT'],
        visaProcess: [
            'Receive Offer of Place from NZ institution',
            'Apply for Student Visa online',
            'Provide evidence of funds',
            'Medical and character checks',
            'Receive visa approval',
            'Travel to New Zealand',
        ],
        topUniversities: [
            { name: 'University of Auckland', ranking: 68, tuitionMin: 28000, tuitionMax: 38000, courses: ['Engineering', 'Medicine', 'Business'], scholarshipAvailable: true },
            { name: 'Victoria University of Wellington', ranking: 234, tuitionMin: 22000, tuitionMax: 32000, courses: ['Law', 'Policy', 'Arts'], scholarshipAvailable: false },
            { name: 'University of Canterbury', ranking: 254, tuitionMin: 20000, tuitionMax: 30000, courses: ['Engineering', 'Sciences', 'Business'], scholarshipAvailable: true },
            { name: 'Massey University', ranking: 350, tuitionMin: 18000, tuitionMax: 28000, courses: ['Agriculture', 'Veterinary', 'Business'], scholarshipAvailable: true },
        ],
    },
    {
        slug: 'france',
        name: 'France',
        flag: '🇫🇷',
        visaSuccessRate: 83,
        avgScholarship: '€5,000 - €15,000',
        avgTuition: '€3,000 - €20,000/yr (public); €10,000 - €30,000/yr (private)',
        processingTime: '2-3 months',
        description: 'France offers some of the most affordable quality education in Europe. The Grandes Écoles are globally recognized for business and engineering. Paris is the cultural capital of the world.',
        color: '#002395',
        popularCourses: ['Fashion Design', 'Culinary Arts', 'Business', 'Engineering', 'Fine Arts'],
        visaProcess: [
            'Apply through Campus France platform',
            'Receive pre-acceptance from university',
            'Apply for Long-Stay Student Visa (VLS-TS)',
            'Submit biometrics at French consulate',
            'Receive visa (6 weeks processing)',
            'Register at Préfecture on arrival',
        ],
        topUniversities: [
            { name: 'École Polytechnique', ranking: 65, tuitionMin: 12000, tuitionMax: 15000, courses: ['Engineering', 'Sciences', 'Management'], scholarshipAvailable: true },
            { name: 'HEC Paris', ranking: 5, tuitionMin: 38000, tuitionMax: 45000, courses: ['MBA', 'Finance', 'Management'], scholarshipAvailable: true },
            { name: 'Sciences Po Paris', ranking: 260, tuitionMin: 10000, tuitionMax: 15000, courses: ['Political Science', 'International Relations', 'Law'], scholarshipAvailable: true },
            { name: 'Sorbonne University', ranking: 83, tuitionMin: 3000, tuitionMax: 6000, courses: ['Humanities', 'Sciences', 'Medicine'], scholarshipAvailable: false },
        ],
    },
    {
        slug: 'italy',
        name: 'Italy',
        flag: '🇮🇹',
        visaSuccessRate: 81,
        avgScholarship: '€5,000 - €15,000',
        avgTuition: '€1,000 - €4,000/yr (public); €10,000 - €25,000/yr (private)',
        processingTime: '3-4 months',
        description: 'Italy offers centuries of academic tradition, incredible culture, and some of Europe\'s most affordable tuition fees. Fashion, architecture, and the arts thrive here.',
        color: '#009246',
        popularCourses: ['Architecture', 'Fashion Design', 'Fine Arts', 'Engineering', 'Gastronomy'],
        visaProcess: [
            'Receive university enrollment confirmation',
            'Apply for pre-enrollment at Italian consulate',
            'Apply for Student Visa (Type D)',
            'Provide financial proof and accommodation details',
            'Attend visa interview',
            'Apply for Residence Permit within 8 days of arrival',
        ],
        topUniversities: [
            { name: 'University of Bologna', ranking: 160, tuitionMin: 2000, tuitionMax: 4000, courses: ['Law', 'Medicine', 'Sciences'], scholarshipAvailable: true },
            { name: 'Politecnico di Milano', ranking: 139, tuitionMin: 4000, tuitionMax: 8000, courses: ['Architecture', 'Engineering', 'Design'], scholarshipAvailable: true },
            { name: 'Sapienza University of Rome', ranking: 171, tuitionMin: 1000, tuitionMax: 3000, courses: ['Medicine', 'Archaeology', 'Law'], scholarshipAvailable: false },
            { name: 'Bocconi University', ranking: 7, tuitionMin: 14000, tuitionMax: 18000, courses: ['Economics', 'Finance', 'Business'], scholarshipAvailable: true },
        ],
    },
    {
        slug: 'china',
        name: 'China',
        flag: '🇨🇳',
        visaSuccessRate: 92,
        avgScholarship: 'CNY 30,000 - CNY 80,000',
        avgTuition: 'CNY 15,000 - CNY 60,000/yr',
        processingTime: '4-8 weeks',
        description: 'China is the fastest-growing higher education market. Government scholarships cover full tuition + accommodation + stipend. Studying in China opens doors to the world\'s largest economy.',
        color: '#DE2910',
        popularCourses: ['Medicine (MBBS)', 'Engineering', 'Business', 'Chinese Language', 'Technology'],
        visaProcess: [
            'Apply to Chinese university directly or via China Study Abroad portal',
            'Receive JW201/JW202 scholarship form and admission notice',
            'Apply for Student Visa (X1/X2) at Chinese Embassy',
            'Physical examination at designated clinic',
            'Receive visa (usually 4 business days)',
            'Register at Public Security Bureau within 24 hours of arrival',
        ],
        topUniversities: [
            { name: 'Tsinghua University', ranking: 25, tuitionMin: 25000, tuitionMax: 40000, courses: ['Engineering', 'CS', 'Sciences'], scholarshipAvailable: true },
            { name: 'Peking University', ranking: 17, tuitionMin: 25000, tuitionMax: 38000, courses: ['Medicine', 'Law', 'Sciences'], scholarshipAvailable: true },
            { name: 'Fudan University', ranking: 64, tuitionMin: 20000, tuitionMax: 35000, courses: ['Business', 'Medicine', 'Journalism'], scholarshipAvailable: true },
            { name: 'Zhejiang University', ranking: 67, tuitionMin: 18000, tuitionMax: 30000, courses: ['Engineering', 'IT', 'Agriculture'], scholarshipAvailable: true },
        ],
    },
]

export const DEMO_LEADS: Lead[] = [
    { id: '1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+977-9801234567', country: 'Australia', budget: '$30,000-$45,000', status: 'visa', createdAt: '2026-02-01', notes: 'IELTS 7.0', message: 'Interested in nursing programs' },
    { id: '2', name: 'Rohan Thapa', email: 'rohan@example.com', phone: '+977-9812345678', country: 'Canada', budget: '$25,000-$35,000', status: 'application', createdAt: '2026-02-03', notes: 'Strong academic record', message: 'Wants IT programs in Toronto' },
    { id: '3', name: 'Aarav Joshi', email: 'aarav@example.com', phone: '+977-9823456789', country: 'UK', budget: '$40,000+', status: 'departure', createdAt: '2026-01-20', notes: 'Visa approved - departing March 1', message: 'Oxford MBA program' },
    { id: '4', name: 'Sanya Patel', email: 'sanya@example.com', phone: '+977-9834567890', country: 'USA', budget: '$50,000+', status: 'inquiry', createdAt: '2026-02-18', notes: 'First contact', message: 'Looking for computer science programs' },
    { id: '5', name: 'Dipesh Gurung', email: 'dipesh@example.com', phone: '+977-9845678901', country: 'France', budget: '$15,000-$25,000', status: 'application', createdAt: '2026-02-10', notes: 'Applied to Sciences Po', message: 'Political Science interest' },
    { id: '6', name: 'Kamala Rai', email: 'kamala@example.com', phone: '+977-9856789012', country: 'Denmark', budget: '$20,000-$30,000', status: 'inquiry', createdAt: '2026-02-17', notes: 'Interested in sustainable energy', message: 'DTU engineering programs' },
    { id: '7', name: 'Bikash Limbu', email: 'bikash@example.com', phone: '+977-9867890123', country: 'China', budget: '$10,000-$20,000', status: 'visa', createdAt: '2026-02-05', notes: 'CSC scholarship applicant', message: 'MBBS in China' },
    { id: '8', name: 'Nisha Karki', email: 'nisha@example.com', phone: '+977-9878901234', country: 'New Zealand', budget: '$25,000-$35,000', status: 'departure', createdAt: '2026-01-15', notes: 'Departed Feb 15', message: 'Agriculture management' },
]

export const ANALYTICS_DATA = {
    countryPopularity: [
        { country: 'Australia', students: 42, fill: '#00008B' },
        { country: 'Canada', students: 38, fill: '#FF0000' },
        { country: 'UK', students: 35, fill: '#CF142B' },
        { country: 'USA', students: 30, fill: '#B22234' },
        { country: 'China', students: 25, fill: '#DE2910' },
        { country: 'France', students: 18, fill: '#002395' },
        { country: 'Denmark', students: 15, fill: '#C60C30' },
        { country: 'New Zealand', students: 12, fill: '#00247D' },
        { country: 'Italy', students: 10, fill: '#009246' },
    ],
    monthlyLeads: [
        { month: 'Sep', leads: 12 },
        { month: 'Oct', leads: 19 },
        { month: 'Nov', leads: 25 },
        { month: 'Dec', leads: 18 },
        { month: 'Jan', leads: 32 },
        { month: 'Feb', leads: 28 },
    ],
    statusBreakdown: [
        { name: 'Inquiry', value: 35, fill: '#C5A059' },
        { name: 'Application', value: 28, fill: '#002147' },
        { name: 'Visa', value: 18, fill: '#0a3a6b' },
        { name: 'Departure', value: 19, fill: '#d4b47a' },
    ],
}

export const FAQ_DATA = [
    { q: 'What documents do I need for a student visa?', a: 'Typically: valid passport, university acceptance letter, financial proof, IELTS/TOEFL scores, medical certificate, and passport photos. Requirements vary by country.' },
    { q: 'How long does visa processing take?', a: 'Processing times vary: UK (3-8 weeks), Australia (4-6 weeks), Canada (8-12 weeks), USA (3-5 months), Denmark (2-3 months), China (4-8 weeks).' },
    { q: 'What is the minimum IELTS score required?', a: 'Most universities require IELTS 6.0-7.0. Top universities like Oxford/Cambridge require 7.5+. Some programs accept 5.5 for pathway courses.' },
    { q: 'Can I work while studying abroad?', a: 'Yes! UK allows 20 hrs/week, Australia 48 hrs/fortnight, Canada 20 hrs/week, USA limited on-campus work, Denmark 20 hrs/week during term.' },
    { q: 'What scholarships are available?', a: 'Chevening (UK), Australia Awards, Vanier (Canada), Fulbright (USA), Danish Government Scholarships, Chinese Government Scholarship (CSC) — and many university-specific grants.' },
    { q: 'How much does it cost to study in China?', a: 'MBBS in China costs approximately $3,000-$8,000/year — one of the most affordable options. The CSC scholarship can cover tuition + accommodation + monthly stipend.' },
    { q: 'What is ERI\'s consultation fee?', a: 'Our initial consultation is FREE. Service fees for full application management start from NPR 50,000 depending on the destination country and complexity of the application.' },
    { q: 'How long has ERI been operating?', a: 'Enlightened Research Institute has been helping Nepali students achieve their overseas education dreams for over 10 years, with a 95%+ visa success rate.' },
]
