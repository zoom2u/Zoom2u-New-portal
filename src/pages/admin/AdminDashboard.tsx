import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatRelativeTime, getStatusLabel } from '@/lib/utils'
import {
  Package,
  TrendingUp,
  Users,
  Truck,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  RefreshCw,
} from 'lucide-react'

// Mock data
const stats = [
  { 
    label: 'Total Bookings Today', 
    value: '1,247', 
    change: '+12.5%', 
    trend: 'up',
    icon: Package, 
    color: 'bg-blue-500' 
  },
  { 
    label: 'Active Drivers', 
    value: '342', 
    change: '+5.2%', 
    trend: 'up',
    icon: Truck, 
    color: 'bg-green-500' 
  },
  { 
    label: 'Revenue Today', 
    value: '$48,290', 
    change: '+18.7%', 
    trend: 'up',
    icon: DollarSign, 
    color: 'bg-purple-500' 
  },
  { 
    label: 'Avg. Delivery Time', 
    value: '2.1h', 
    change: '-8.3%', 
    trend: 'down',
    icon: Clock, 
    color: 'bg-amber-500' 
  },
]

const recentBookings = [
  {
    id: '1',
    tracking_id: 'Z2U-ABC12345',
    status: 'on_route',
    tenant: 'Acme Corp',
    customer: 'John Smith',
    pickup: 'Sydney CBD',
    dropoff: 'Parramatta',
    total: 34.90,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    tracking_id: 'Z2U-DEF67890',
    status: 'pending',
    tenant: 'TechStart',
    customer: 'Sarah Johnson',
    pickup: 'Melbourne CBD',
    dropoff: 'Richmond',
    total: 28.50,
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: '3',
    tracking_id: 'Z2U-GHI11223',
    status: 'picked_up',
    tenant: 'RetailMax',
    customer: 'Mike Brown',
    pickup: 'Brisbane CBD',
    dropoff: 'Fortitude Valley',
    total: 22.00,
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
  },
]

const alerts = [
  {
    id: '1',
    type: 'warning',
    title: 'High volume detected',
    message: 'CBD pickups are 40% above average. Consider allocating more drivers.',
    time: '5 mins ago',
  },
  {
    id: '2',
    type: 'error',
    title: 'Failed delivery requires attention',
    message: 'Z2U-XYZ99887 - Recipient not available after 3 attempts',
    time: '12 mins ago',
  },
  {
    id: '3',
    type: 'info',
    title: 'New tenant onboarded',
    message: 'GlobalTech has completed setup and is ready to accept bookings',
    time: '1 hour ago',
  },
]

const statusVariants: Record<string, 'pending' | 'on-route' | 'delivered' | 'failed'> = {
  pending: 'pending',
  scheduled: 'pending',
  picked_up: 'on-route',
  on_route: 'on-route',
  delivered: 'delivered',
  on_hold: 'failed',
  failed: 'failed',
}

export function AdminDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of all platform activity</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            leftIcon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Link to="/admin/bookings">
            <Button>View All Bookings</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card padding="md" hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Link to="/admin/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    to={`/admin/bookings/${booking.id}`}
                    className="block p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{booking.tracking_id}</span>
                          <Badge variant={statusVariants[booking.status]}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <Building2 className="h-3 w-3" />
                          <span>{booking.tenant}</span>
                          <span>•</span>
                          <span>{booking.customer}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{formatCurrency(booking.total)}</p>
                        <p className="text-xs text-slate-500">{formatRelativeTime(booking.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{booking.pickup}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span>{booking.dropoff}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Notifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.type === 'error' 
                        ? 'bg-red-50 border-red-200'
                        : alert.type === 'warning'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <p className={`font-medium text-sm ${
                      alert.type === 'error' 
                        ? 'text-red-800'
                        : alert.type === 'warning'
                        ? 'text-amber-800'
                        : 'text-blue-800'
                    }`}>
                      {alert.title}
                    </p>
                    <p className={`text-xs mt-1 ${
                      alert.type === 'error' 
                        ? 'text-red-600'
                        : alert.type === 'warning'
                        ? 'text-amber-600'
                        : 'text-blue-600'
                    }`}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">{alert.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">On-time delivery rate</span>
                  <span className="font-semibold text-green-600">98.2%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.2%' }} />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-600">Driver utilization</span>
                  <span className="font-semibold text-blue-600">76.5%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76.5%' }} />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-600">Customer satisfaction</span>
                  <span className="font-semibold text-purple-600">4.8/5</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

