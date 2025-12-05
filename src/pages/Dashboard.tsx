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
  Clock,
  MapPin,
  ArrowRight,
  Truck,
  CheckCircle,
  Calendar,
  Megaphone,
  Info,
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

// Mock platform updates - in production this would come from Supabase
const platformUpdates = [
  {
    id: '1',
    title: 'Holiday Season Hours',
    content: 'Please note our operating hours will be adjusted during the holiday period from Dec 24 - Jan 2. Same-day cutoff will be moved to 10am.',
    type: 'info',
    created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
  {
    id: '2',
    title: 'New Service: White Glove Delivery',
    content: 'We now offer premium White Glove service including assembly, room placement and packaging removal. Available in all metro areas.',
    type: 'feature',
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
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

        {/* Wallet & Updates */}
        <motion.div variants={itemVariants} className="space-y-6">
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

          {/* Zoom2u Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary-500" />
                Zoom2u Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformUpdates.length > 0 ? (
                  platformUpdates.map((update) => (
                    <div 
                      key={update.id} 
                      className={`p-4 rounded-lg border ${
                        update.type === 'info' 
                          ? 'bg-blue-50 border-blue-100' 
                          : update.type === 'feature'
                          ? 'bg-green-50 border-green-100'
                          : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Info className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          update.type === 'info' 
                            ? 'text-blue-500' 
                            : update.type === 'feature'
                            ? 'text-green-500'
                            : 'text-slate-500'
                        }`} />
                        <div>
                          <p className={`text-sm font-semibold ${
                            update.type === 'info' 
                              ? 'text-blue-900' 
                              : update.type === 'feature'
                              ? 'text-green-900'
                              : 'text-slate-900'
                          }`}>
                            {update.title}
                          </p>
                          <p className={`text-sm mt-1 ${
                            update.type === 'info' 
                              ? 'text-blue-700' 
                              : update.type === 'feature'
                              ? 'text-green-700'
                              : 'text-slate-600'
                          }`}>
                            {update.content}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">
                            {formatRelativeTime(update.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No updates at this time
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

