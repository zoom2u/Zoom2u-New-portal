import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatRelativeTime, getStatusLabel } from '@/lib/utils'
import {
  Plus,
  Package,
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight,
  Truck,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react'

// Mock data for demo
const recentDeliveries = [
  {
    id: '1',
    tracking_id: 'Z2U-ABC12345',
    status: 'on_route',
    pickup_address_text: '123 George St, Sydney NSW 2000',
    dropoff_address_text: '456 Pitt St, Sydney NSW 2000',
    estimated_delivery_time: new Date(Date.now() + 30 * 60000).toISOString(),
    total_cost: 24.90,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: '2',
    tracking_id: 'Z2U-DEF67890',
    status: 'delivered',
    pickup_address_text: '789 Collins St, Melbourne VIC 3000',
    dropoff_address_text: '321 Flinders Ln, Melbourne VIC 3000',
    estimated_delivery_time: new Date(Date.now() - 2 * 3600000).toISOString(),
    total_cost: 18.50,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: '3',
    tracking_id: 'Z2U-GHI11223',
    status: 'pending',
    pickup_address_text: '100 Queen St, Brisbane QLD 4000',
    dropoff_address_text: '200 Adelaide St, Brisbane QLD 4000',
    estimated_delivery_time: new Date(Date.now() + 3 * 3600000).toISOString(),
    total_cost: 22.00,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
]

const stats = [
  { label: 'Total Deliveries', value: '127', change: '+12%', icon: Package, color: 'bg-blue-500' },
  { label: 'This Month', value: '24', change: '+8%', icon: Calendar, color: 'bg-green-500' },
  { label: 'In Transit', value: '3', change: '', icon: Truck, color: 'bg-amber-500' },
  { label: 'Avg. Delivery Time', value: '2.4h', change: '-15%', icon: Clock, color: 'bg-purple-500' },
]

const statusVariants: Record<string, 'pending' | 'on-route' | 'delivered' | 'failed'> = {
  pending: 'pending',
  scheduled: 'pending',
  picked_up: 'on-route',
  on_route: 'on-route',
  delivered: 'delivered',
  on_hold: 'failed',
  failed: 'failed',
  redelivered: 'on-route',
}

export function Dashboard() {
  const { profile } = useAuthStore()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening with your deliveries today.
          </p>
        </div>
        <Link to="/book">
          <Button size="lg" leftIcon={<Plus className="h-5 w-5" />}>
            New Booking
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                {stat.change && (
                  <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                )}
              </div>
              <div className={`${stat.color} p-2.5 rounded-xl`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Deliveries */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Recent Deliveries</CardTitle>
              <Link to="/deliveries" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDeliveries.map((delivery) => (
                  <Link
                    key={delivery.id}
                    to={`/deliveries/${delivery.id}`}
                    className="block p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          delivery.status === 'delivered' ? 'bg-green-100' :
                          delivery.status === 'on_route' ? 'bg-amber-100' : 'bg-slate-200'
                        }`}>
                          {delivery.status === 'delivered' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : delivery.status === 'on_route' ? (
                            <Truck className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-slate-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{delivery.tracking_id}</p>
                          <p className="text-xs text-slate-500">{formatRelativeTime(delivery.created_at)}</p>
                        </div>
                      </div>
                      <Badge variant={statusVariants[delivery.status]}>
                        {getStatusLabel(delivery.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 truncate">{delivery.pickup_address_text}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 truncate">{delivery.dropoff_address_text}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                      <span className="text-sm text-slate-500">
                        {delivery.status === 'delivered' ? 'Delivered' : 'Est. delivery'}: {' '}
                        <span className="font-medium text-slate-700">
                          {new Date(delivery.estimated_delivery_time).toLocaleTimeString('en-AU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(delivery.total_cost)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Activity */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/book" className="block">
                <Button fullWidth variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                  New Standard Booking
                </Button>
              </Link>
              <Link to="/book?mode=batch" className="block">
                <Button fullWidth variant="secondary" leftIcon={<Package className="h-4 w-4" />}>
                  Batch Delivery
                </Button>
              </Link>
              <Link to="/book?type=marketplace" className="block">
                <Button fullWidth variant="ghost" leftIcon={<TrendingUp className="h-4 w-4" />}>
                  Post to Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Wallet Balance */}
          <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
            <CardContent className="p-6">
              <p className="text-primary-100 text-sm">Wallet Balance</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(profile?.wallet_balance || 0)}</p>
              <Link to="/wallet">
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  Top Up Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Attention Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm font-medium text-amber-800">Address verification pending</p>
                  <p className="text-xs text-amber-600 mt-1">
                    Complete verification to unlock all features
                  </p>
                  <Link to="/settings/verification" className="text-xs text-amber-700 font-medium hover:underline mt-2 inline-block">
                    Verify now →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

