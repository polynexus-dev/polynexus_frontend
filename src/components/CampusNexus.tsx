import { useState, useEffect } from 'react';
import { 
  CheckCircle,
  Users,
  Settings
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface ModuleItem {
  name: string;
  rate: number;
  type: 'student' | 'staff';
  activeByDefault: boolean;
}

export default function CampusNexus() {
  const [students, setStudents] = useState<number>(1000);
  const [staff, setStaff] = useState<number>(60);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  // Available add-ons (Core is default and cannot be unchecked)
  const [addons, setAddons] = useState<{ [key: string]: boolean }>({
    fees: true,
    bus: true,
    hostel: false,
    tpo: false,
    library: false,
    exams: false,
    valuation: false,
    inventory: false,
    payroll: false
  });

  const addonRates: { [key: string]: ModuleItem } = {
    fees: { name: 'Fee Collection & Accounts Ledger', rate: 4.00, type: 'student', activeByDefault: true },
    bus: { name: 'Bus Routes & Live Location Tracking', rate: 10.00, type: 'student', activeByDefault: true },
    hostel: { name: 'Hostel & Mess Boarding Manager', rate: 5.00, type: 'student', activeByDefault: false },
    tpo: { name: 'TPO Recruitment Drive & Placement Cells', rate: 3.00, type: 'student', activeByDefault: false },
    library: { name: 'Library Circulation & Catalog Logs', rate: 2.00, type: 'student', activeByDefault: false },
    exams: { name: 'Exams Scheduler & Seat Layout Planner', rate: 3.00, type: 'student', activeByDefault: false },
    valuation: { name: 'Valuation Grading & Anonymous grading', rate: 3.00, type: 'student', activeByDefault: false },
    inventory: { name: 'Inventory Reorders & Supplier Stock Log', rate: 2.00, type: 'student', activeByDefault: false },
    payroll: { name: 'Staff Leaves & Payroll Manager Integration', rate: 99.00, type: 'staff', activeByDefault: false }
  };

  const toggleAddon = (key: string) => {
    setAddons(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Math logic
  const isAnnual = billingPeriod === 'annual';
  const freeStaffAllowance = Math.floor(students / 20);
  const paidStaffCount = Math.max(0, staff - freeStaffAllowance);

  // Core base price
  const coreRate = isAnnual ? 500.00 : 45.00;
  const coreTotal = students * coreRate;

  // Add-on totals
  const multiplier = isAnnual ? 10 : 1;
  let studentAddonsTotal = 0;
  let staffBillingTotal = 0;

  Object.entries(addons).forEach(([key, active]) => {
    if (!active) return;
    const item = addonRates[key];
    if (item.type === 'student') {
      studentAddonsTotal += students * (item.rate * multiplier);
    } else if (item.type === 'staff') {
      staffBillingTotal = paidStaffCount * (item.rate * multiplier);
    }
  });

  const finalPrice = coreTotal + studentAddonsTotal + staffBillingTotal;

  // Effective per student rates
  let perStudentMonthly = 0;
  let perStudentAnnually = 0;
  if (students > 0) {
    if (isAnnual) {
      perStudentAnnually = finalPrice / students;
      perStudentMonthly = perStudentAnnually / 12;
    } else {
      perStudentMonthly = finalPrice / students;
      const annualEquivTotal = (students * 500.00) + (studentAddonsTotal * 10) + (staffBillingTotal * 10);
      perStudentAnnually = annualEquivTotal / students;
    }
  }

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
      <Header />

      {/* Hero section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-purple-950/20 via-slate-900 to-slate-900 overflow-hidden">
        {/* Glowing background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider mb-6">
            Product Brief
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display mb-6">
            Discover <span className="bg-gradient-to-r from-purple-200 via-purple-400 to-amber-300 bg-clip-text text-transparent">CampusNexus ERP</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
            The modern, modular university administration suite built for complete campus automation. Explore functional specifications, competitive advantages, and our customized Nagpur region pricing plans.
          </p>
        </div>
      </section>

      {/* 6 Core Pillars Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-display sm:text-4xl mb-4">
            Core Features & Specifications
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            CampusNexus is designed to simplify university management while offering maximum account data privacy and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Card 1: Core Registrar Hub */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-md hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 flex items-center justify-center font-bold font-mono">01</span>
              <h3 className="text-xl font-bold font-display">Core Registrar Hub</h3>
            </div>
            <ul className="space-y-3.5 mb-8 flex-grow">
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Secure isolated workspace separating each college's private registers.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Detailed registrar directory mapping student, faculty, HOD, and support staff profiles.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Verification onboarding delivering secure links to student profiles.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Authorized device locks verifying security browser parameters.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Medical records logs tracking student allergies and emergency contacts.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Comprehensive past academic scores records validating school records.
              </li>
            </ul>
            <div className="bg-slate-900/30 border border-slate-700/40 rounded-2xl p-5 mt-auto">
              <span className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5">🔒 Competitive Edge</span>
              <p className="text-xs leading-relaxed text-slate-300">
                Traditional college software systems mix account data and are vulnerable to security issues. CampusNexus segregates account registers entirely and enforces authorized device locks to stop login credential leaks.
              </p>
            </div>
          </div>

          {/* Card 2: Face Attendance & Location Guard */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-md hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 flex items-center justify-center font-bold font-mono">02</span>
              <h3 className="text-xl font-bold font-display">Face Attendance & Location Guard</h3>
            </div>
            <ul className="space-y-3.5 mb-8 flex-grow">
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Facial check-ins backed by real-time interactive face verification check-ins.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Location verification zones limiting attendee check-in zones to classroom blocks.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Lecturer control panels establishing dynamic session timers and attendance pins.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Room boundary check-ins mapping physical classroom blocks automatically.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Automatic record synchronizer updating leave tracker balance pools and payroll schedules.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Student adjustment portal mapping manual review logs with proof document uploads.
              </li>
            </ul>
            <div className="bg-slate-900/30 border border-slate-700/40 rounded-2xl p-5 mt-auto">
              <span className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5">🔒 Competitive Edge</span>
              <p className="text-xs leading-relaxed text-slate-300">
                Eliminates proxy check-ins and proxy rolls. By combining face print matching, location verification, and lecturer timers, students must be physically present inside the class to check in.
              </p>
            </div>
          </div>

          {/* Card 3: Salary Structure & Payroll */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-md hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 flex items-center justify-center font-bold font-mono">03</span>
              <h3 className="text-xl font-bold font-display">Salary Structure & Payroll</h3>
            </div>
            <ul className="space-y-3.5 mb-8 flex-grow">
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Flexible payroll templates mapping basic pay, allowances, and tax deduction parameters.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Direct attendance synchronization linking face check-in logs to monthly payouts.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Absence deduction automation calculating gross adjustments per missing day.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Leave balance tracking adjusting duty leaves, medical lists, and casual balance pools.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Invoice-style digital payslips displaying detailed allowance and deduction columns.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Manager approval logs routing employee salary overrides and adjustments.
              </li>
            </ul>
            <div className="bg-slate-900/30 border border-slate-700/40 rounded-2xl p-5 mt-auto">
              <span className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5">🔒 Competitive Edge</span>
              <p className="text-xs leading-relaxed text-slate-300">
                Most payroll tools require manual exports from external face readers. CampusNexus synchronizes face logs directly with salary allocations, reducing monthly payroll calculations to a single click.
              </p>
            </div>
          </div>

          {/* Card 4: Accounts & Proportional Fee Ledger */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-md hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 flex items-center justify-center font-bold font-mono">04</span>
              <h3 className="text-xl font-bold font-display">Accounts & Fee Ledger</h3>
            </div>
            <ul className="space-y-3.5 mb-8 flex-grow">
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Custom fee category templates separating tuition, transport, hostel, and lab logs.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Bulk invoice rollout pushing payment configs to entire semesters or branches.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Proportional splitting rules dividing payments across sub-items automatically.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Flexible banking integrations tracking cards, Net Banking, and online payments.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Digital receipt preview rendering dynamic college logos and footer branding.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Outstanding balances page displaying invoice details, transaction dates, and balances.
              </li>
            </ul>
            <div className="bg-slate-900/30 border border-slate-700/40 rounded-2xl p-5 mt-auto">
              <span className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5">🔒 Competitive Edge</span>
              <p className="text-xs leading-relaxed text-slate-300">
                Traditional ledgers require manual splitting for combined fee receipts. CampusNexus distributes payments proportionally, keeping accounts ledger reconciliations automated and clean.
              </p>
            </div>
          </div>

          {/* Card 5: Transit Route & Digital Passes */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-md hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 flex items-center justify-center font-bold font-mono">05</span>
              <h3 className="text-xl font-bold font-display">Transit Route & Digital Passes</h3>
            </div>
            <ul className="space-y-3.5 mb-8 flex-grow">
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Interactive route maps tracing live moving bus markers.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Real-time location updates tracking active bus status without lag.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Interactive stopped sequences mapping designated stop positions.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Conductor and driver profile entries associated with routes and rosters.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Boarding digital passes featuring custom colors, college logo center points, and footer branding.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Transit financial logs tracking bus subscriptions, payment logs, and outstanding balances.
              </li>
            </ul>
            <div className="bg-slate-900/30 border border-slate-700/40 rounded-2xl p-5 mt-auto">
              <span className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5">🔒 Competitive Edge</span>
              <p className="text-xs leading-relaxed text-slate-300">
                Combines live route tracking, transit cost accounting, and digital boarding passes in a single system, removing the need for costly vehicle tracking hardware.
              </p>
            </div>
          </div>

          {/* Card 6: Custom Domain Email Services */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-md hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 flex items-center justify-center font-bold font-mono">06</span>
              <h3 className="text-xl font-bold font-display">Custom Domain Emails</h3>
            </div>
            <ul className="space-y-3.5 mb-8 flex-grow">
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Custom mailing domain settings (servers, ports, and protocols) per college account.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Strict registration domain restrictions blocking sign-ups outside of college domains.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Automated emails delivering verification codes, receipts, and registration links.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Isolated account configurations protecting private mailing keys.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Custom branded email templates displaying custom header titles and footer credits.
              </li>
              <li className="flex items-start gap-3.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                Direct integration with registrar rosters and payment receipts.
              </li>
            </ul>
            <div className="bg-slate-900/30 border border-slate-700/40 rounded-2xl p-5 mt-auto">
              <span className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5">🔒 Competitive Edge</span>
              <p className="text-xs leading-relaxed text-slate-300">
                Protects university login portals from external sign-ups while ensuring college notifications are delivered directly under the institution's own domain name.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
              Nagpur Launch Offer
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight font-display sm:text-4xl text-white mt-4 mb-3">
              Nagpur Pricing Calculator
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Select your modules and calculate real-time estimated rates in Indian Rupees (₹) below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Inputs Panel */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-850 p-6 sm:p-8 rounded-3xl">
              <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                1. Enter College Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Students</label>
                  <input 
                    type="number"
                    value={students}
                    min="50"
                    max="20000"
                    step="50"
                    onChange={e => setStudents(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Staff / Faculty</label>
                  <input 
                    type="number"
                    value={staff}
                    min="5"
                    max="2000"
                    step="5"
                    onChange={e => setStaff(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Nagpur special highlight */}
              <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-4 text-xs sm:text-sm text-purple-300 font-medium mb-8">
                🎁 Nagpur Launch Special: 1 staff user seat is completely free for every 20 students. Extra seats are billed at ₹99/mo per seat.
              </div>

              <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                2. Select Add-on Modules
              </h3>

              <div className="space-y-3">
                {/* Core Bundle (Disabled/Fixed Checked) */}
                <div className="flex items-center justify-between p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl opacity-90">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center text-white text-xs font-bold">✓</div>
                    <div>
                      <span className="text-sm font-bold text-white block">Core Platform Bundle</span>
                      <span className="text-[10px] text-purple-300 block">Registration, Attendance, Schedule, Assignments & Free Domain Custom Email</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-300 bg-purple-900/40 px-2 py-1 rounded">₹45 / mo (₹500 / yr)</span>
                </div>

                {/* Other Checklist items */}
                {Object.entries(addonRates).map(([key, item]) => {
                  if (item.type === 'staff') return null; // Payroll managed separately
                  const checked = addons[key];
                  return (
                    <div 
                      key={key}
                      onClick={() => toggleAddon(key)}
                      className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                        checked 
                          ? 'bg-purple-950/10 border-purple-500/40' 
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          checked ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700 bg-slate-950'
                        }`}>
                          {checked && <span className="text-xs font-bold">✓</span>}
                        </div>
                        <span className="text-sm font-semibold text-slate-200">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-purple-400 bg-slate-900 px-2 py-1 rounded">
                        ₹{item.rate.toFixed(2)} / student
                      </span>
                    </div>
                  );
                })}

                {/* Staff Payroll Integration checkbox */}
                <div 
                  onClick={() => toggleAddon('payroll')}
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                    addons.payroll 
                      ? 'bg-purple-950/10 border-purple-500/40' 
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      addons.payroll ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700 bg-slate-950'
                    }`}>
                      {addons.payroll && <span className="text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-sm font-semibold text-slate-200">{addonRates.payroll.name}</span>
                  </div>
                  <span className="text-xs font-bold text-purple-400 bg-slate-900 px-2 py-1 rounded">
                    ₹{addonRates.payroll.rate.toFixed(2)} / extra staff
                  </span>
                </div>

              </div>
            </div>

            {/* Total Estimate Panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-purple-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 sticky top-28 shadow-xl">
              <span className="inline-block bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-6">
                Live Pricing Summary
              </span>

              <div className="mb-8">
                {/* Billing period switcher */}
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 mb-6">
                  <button 
                    onClick={() => setBillingPeriod('monthly')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      !isAnnual ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setBillingPeriod('annual')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      isAnnual ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Annual (Savings)
                  </button>
                </div>

                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Estimated Cost</span>
                <div className="text-4xl sm:text-5xl font-black font-display text-white flex items-baseline gap-1">
                  ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                  <span className="text-sm text-slate-400 font-semibold">{isAnnual ? '/ yr' : '/ mo'}</span>
                </div>
              </div>

              <div className="space-y-4 text-xs border-t border-slate-800/80 pt-6 mb-8">
                <div className="flex justify-between text-slate-300">
                  <span>Core Bundle Platform</span>
                  <span className="font-bold">₹{Math.round(coreTotal).toLocaleString('en-IN')}{isAnnual ? '/yr' : '/mo'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Student Add-on Modules</span>
                  <span className="font-bold">₹{Math.round(studentAddonsTotal).toLocaleString('en-IN')}{isAnnual ? '/yr' : '/mo'}</span>
                </div>
                <div className="flex justify-between text-slate-300 flex-col gap-1">
                  <div className="flex justify-between">
                    <span>Chargeable Extra Staff</span>
                    <span className="font-bold">₹{Math.round(staffBillingTotal).toLocaleString('en-IN')}{isAnnual ? '/yr' : '/mo'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    ({freeStaffAllowance} Free Seats | {paidStaffCount} Paid Seats at ₹{isAnnual ? '990/yr' : '99/mo'})
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Custom Email service</span>
                  <span>Included (Free)</span>
                </div>

                <div className="border-t border-slate-800/80 my-2" />

                <div className="flex justify-between text-amber-500 font-bold text-sm">
                  <span>Effective Student Rate</span>
                  <span>
                    ₹{perStudentMonthly.toFixed(2)}/mo | ₹{perStudentAnnually.toFixed(2)}/yr
                  </span>
                </div>
              </div>

              <a 
                href={`mailto:sales@polynexus.in?subject=CampusNexus ERP Subscription Proposal&body=Hello,%0A%0AWe are interested in CampusNexus ERP with student strength ${students} and staff strength ${staff} on a ${billingPeriod} cycle.`}
                className="block text-center w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black tracking-wide uppercase rounded-xl shadow-lg hover:scale-[1.01] active:scale-100 transition-all text-xs sm:text-sm"
              >
                Get Custom Proposal
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
