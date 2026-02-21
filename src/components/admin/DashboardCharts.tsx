'use client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts'
import { Users, AlertCircle } from 'lucide-react'

// Mock Data
const revenueData = [
    { name: 'Jan', revenue: 15 },
    { name: 'Feb', revenue: 22 },
    { name: 'Mar', revenue: 30 },
    { name: 'Apr', revenue: 28 },
    { name: 'May', revenue: 45 },
    { name: 'Jun', revenue: 35 },
    { name: 'Jul', revenue: 50 },
    { name: 'Aug', revenue: 42 },
]

const countryData = [
    { name: 'Australia', value: 45, color: '#3b82f6' }, // blue-500
    { name: 'UK', value: 30, color: '#eab308' }, // yellow-500 (gold)
    { name: 'USA', value: 15, color: '#db2777' }, // pink-600
    { name: 'Canada', value: 10, color: '#10b981' }, // emerald-500
]

const funnelData = [
    { name: 'Total Leads', value: 1200 },
    { name: 'Consultations', value: 850 },
    { name: 'Applications', value: 420 },
    { name: 'Visas Approved', value: 380 },
    { name: 'Enrolled', value: 350 },
]

export default function DashboardCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* Main Chart: Revenue & Conversion Trend */}
            <div className="lg:col-span-2 bg-oxford-blue-dark border border-white/5 rounded-xl p-6 relative overflow-hidden flex flex-col">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white">Monthly Revenue & Projections</h3>
                    <p className="text-sm text-white/50">Fiscal Year 2026 (in Lakhs NPR)</p>
                </div>

                <div className="flex-1 min-h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `रु${value}L`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0a1128', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#eab308' }}
                                formatter={(value: number) => [`रु ${value} Lakhs`, 'Revenue']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Side Column: Pie Chart and Funnel Summary */}
            <div className="space-y-6">

                {/* Country Breakdown Pie Chart */}
                <div className="bg-oxford-blue-dark border border-white/5 rounded-xl p-6 h-[48%] flex flex-col">
                    <div className="mb-2">
                        <h3 className="text-sm font-semibold text-white">Application by Destination</h3>
                    </div>
                    <div className="flex-1 min-h-[150px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={countryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {countryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a1128', borderColor: '#ffffff20', borderRadius: '8px', border: 'none', color: '#fff' }}
                                    formatter={(value: number) => [`${value}%`, 'Applications']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Custom Legend */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">840</div>
                                <div className="text-[10px] text-white/50 uppercase">Total Apps</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {countryData.map((country) => (
                            <div key={country.name} className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: country.color }} />
                                <span className="text-xs text-white/70">{country.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enrollment Funnel / Alert Widget */}
                <div className="bg-gradient-to-br from-oxford-blue-dark to-purple-900/40 border border-white/5 rounded-xl p-5 h-[48%] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white">Attention Required</h3>
                            <AlertCircle size={16} className="text-gold" />
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                <span className="text-white/80">3 student visas expiring within 90 days.</span>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                <span className="text-white/80">5 hot leads uncontacted for &gt; 24 hours.</span>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                                <span className="text-white/80">University of Sydney intake deadline approaching.</span>
                            </li>
                        </ul>
                    </div>
                    <button className="w-full text-xs font-semibold text-gold bg-gold/10 hover:bg-gold/20 py-2 rounded-lg transition-colors mt-4">
                        View All Alerts →
                    </button>
                </div>

            </div>

            {/* Counselor Leaderboard Component (Placeholder) */}
            <div className="lg:col-span-3 bg-oxford-blue-dark border border-white/5 rounded-xl p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Top Performing Counselors</h3>
                    <button className="text-sm text-gold hover:text-gold-dark transition-colors">View Full Team Overview</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-white/70">
                        <thead className="text-xs text-white/40 uppercase bg-white/5">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Counselor</th>
                                <th className="px-4 py-3">Leads Handled</th>
                                <th className="px-4 py-3">Conversion Rate</th>
                                <th className="px-4 py-3">Visa Success</th>
                                <th className="px-4 py-3 rounded-r-lg">Target Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">R</div>
                                    <span className="font-medium text-white">Rahul Sharma</span>
                                </td>
                                <td className="px-4 py-4">145</td>
                                <td className="px-4 py-4 text-emerald-400">32%</td>
                                <td className="px-4 py-4 text-emerald-400">98%</td>
                                <td className="px-4 py-4">
                                    <div className="w-full bg-black/40 rounded-full h-1.5">
                                        <div className="bg-gold h-1.5 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">S</div>
                                    <span className="font-medium text-white">Sita Khadka</span>
                                </td>
                                <td className="px-4 py-4">120</td>
                                <td className="px-4 py-4 text-gold">28%</td>
                                <td className="px-4 py-4 text-emerald-400">95%</td>
                                <td className="px-4 py-4">
                                    <div className="w-full bg-black/40 rounded-full h-1.5">
                                        <div className="bg-gold h-1.5 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
