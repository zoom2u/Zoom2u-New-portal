import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Phone,
  MessageSquare,
  Download,
  RefreshCw,
} from 'lucide-react'

// Mock data
const mockDeliveries = [
  {
    id: '1',
    tracking_id: 'Z2U-ABC12345',
    status: 'on_route',
    service_type: 'standard',
    pickup_address_text: '123 George St, Sydney NSW 2000',
    dropoff_address_text: '456 Pitt St, Sydney NSW 2000',
    estimated_delivery_time: new Date(Date.now() + 30 * 60000).toISOString(),
    actual_pickup_time: new Date(Date.now() - 45 * 60000).toISOString(),
    total_cost: 24.90,
    driver_name: 'Michael Chen',
    driver_photo: null,
    is_on_route: true,
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: '2',
    tracking_id: 'Z2U-DEF67890',
    status: 'delivered',
    service_type: 'vip',
    pickup_address_text: '789 Collins St, Melbourne VIC 3000',
    dropoff_address_text: '321 Flinders Ln, Melbourne VIC 3000',
    estimated_delivery_time: new Date(Date.now() - 2 * 3600000).toISOString(),
    actual_delivery_time: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    total_cost: 45.50,
    driver_name: 'Sarah Johnson',
    driver_photo: null,
    is_on_route: false,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: '3',
    tracking_id: 'Z2U-GHI11223',
    status: 'pending',
    service_type: 'standard',
    pickup_address_text: '100 Queen St, Brisbane QLD 4000',
    dropoff_address_text: '200 Adelaide St, Brisbane QLD 4000',
    estimated_delivery_time: new Date(Date.now() + 3 * 3600000).toISOString(),
    actual_pickup_time: null,
    total_cost: 22.00,
    driver_name: null,
    driver_photo: null,
    is_on_route: false,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: '4',
    tracking_id: 'Z2U-JKL44556',
    status: 'picked_up',
    service_type: 'same_day',
    pickup_address_text: '50 Market St, Perth WA 6000',
    dropoff_address_text: '75 Murray St, Perth WA 6000',
    estimated_delivery_time: new Date(Date.now() + 2 * 3600000).toISOString(),
    actual_pickup_time: new Date(Date.now() - 10 * 60000).toISOString(),
    total_cost: 32.00,
    driver_name: 'James Wilson',
    driver_photo: null,
    is_on_route: false,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: '5',
    tracking_id: 'Z2U-MNO77889',
    status: 'failed',
    service_type: 'standard',
    pickup_address_text: '25 King William St, Adelaide SA 5000',
    dropoff_address_text: '60 Rundle Mall, Adelaide SA 5000',
    estimated_delivery_time: new Date(Date.now() - 1 * 3600000).toISOString(),
    actual_pickup_time: new Date(Date.now() - 3 * 3600000).toISOString(),
    total_cost: 18.50,
    driver_name: 'Emily Brown',
    driver_photo: null,
    is_on_route: false,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    failure_reason: 'Recipient not available',
  },
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'on_route', label: 'On Route' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
]

const statusVariants: Record<string, 'pending' | 'scheduled' | 'picked-up' | 'on-route' | 'delivered' | 'failed'> = {
  pending: 'pending',
  scheduled: 'scheduled',
  picked_up: 'picked-up',
  on_route: 'on-route',
  delivered: 'delivered',
  on_hold: 'failed',
  failed: 'failed',
  redelivered: 'on-route',
}

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  scheduled: Clock,
  picked_up: Package,
  on_route: Truck,
  delivered: CheckCircle,
  on_hold: AlertCircle,
  failed: AlertCircle,
}

export function Deliveries() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null)

  const filteredDeliveries = mockDeliveries.filter(delivery => {
    const matchesSearch = 
      delivery.tracking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.pickup_address_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.dropoff_address_text.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Deliveries</h1>
          <p className="text-slate-500 mt-1">Track and manage all your deliveries</p>
        </div>
        <Link to="/book">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            New Booking
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by tracking ID, address..."
              leftIcon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>
            More Filters
          </Button>
        </div>
      </Card>

      {/* Active Deliveries Section */}
      {filteredDeliveries.some(d => ['pending', 'scheduled', 'picked_up', 'on_route'].includes(d.status)) && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Deliveries</h2>
          <div className="space-y-4">
            {filteredDeliveries
              .filter(d => ['pending', 'scheduled', 'picked_up', 'on_route'].includes(d.status))
              .map((delivery, index) => {
                const StatusIcon = statusIcons[delivery.status] || Clock

                return (
                  <motion.div
                    key={delivery.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card hover padding="none" className="overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${
                              delivery.status === 'on_route' ? 'bg-amber-100' :
                              delivery.status === 'picked_up' ? 'bg-indigo-100' : 'bg-slate-100'
                            }`}>
                              <StatusIcon className={`h-5 w-5 ${
                                delivery.status === 'on_route' ? 'text-amber-600' :
                                delivery.status === 'picked_up' ? 'text-indigo-600' : 'text-slate-600'
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-900">{delivery.tracking_id}</p>
                                <Badge variant={statusVariants[delivery.status]} dot>
                                  {getStatusLabel(delivery.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-500">
                                Created {formatDate(delivery.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon-sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wide">Pickup</p>
                              <p className="text-sm text-slate-700">{delivery.pickup_address_text}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wide">Drop-off</p>
                              <p className="text-sm text-slate-700">{delivery.dropoff_address_text}</p>
                            </div>
                          </div>
                        </div>

                        {/* Driver Info (if assigned) */}
                        {delivery.driver_name && (
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-slate-600">
                                  {delivery.driver_name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{delivery.driver_name}</p>
                                <p className="text-xs text-slate-500">Your driver</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon-sm">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon-sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-500">
                              Est. delivery: <span className="font-medium text-slate-700">
                                {new Date(delivery.estimated_delivery_time).toLocaleTimeString('en-AU', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-900">
                              {formatCurrency(delivery.total_cost)}
                            </span>
                            <Link to={`/deliveries/${delivery.id}`}>
                              <Button size="sm" variant="secondary" leftIcon={<Eye className="h-4 w-4" />}>
                                Track
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Live tracking bar for on_route */}
                      {delivery.status === 'on_route' && (
                        <div className="bg-amber-50 px-5 py-3 border-t border-amber-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-amber-600 animate-pulse" />
                              <span className="text-sm text-amber-700 font-medium">Driver is on the way</span>
                            </div>
                            <Link to={`/track/${delivery.tracking_id}`} className="text-sm text-amber-700 font-medium hover:underline">
                              Live tracking →
                            </Link>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
          </div>
        </div>
      )}

      {/* Past Deliveries */}
      {filteredDeliveries.some(d => ['delivered', 'failed', 'on_hold'].includes(d.status)) && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Past Deliveries</h2>
          <Card padding="none">
            <div className="divide-y divide-slate-100">
              {filteredDeliveries
                .filter(d => ['delivered', 'failed', 'on_hold'].includes(d.status))
                .map((delivery) => {
                  const StatusIcon = statusIcons[delivery.status] || Clock

                  return (
                    <div key={delivery.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            delivery.status === 'delivered' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <StatusIcon className={`h-4 w-4 ${
                              delivery.status === 'delivered' ? 'text-green-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900">{delivery.tracking_id}</p>
                              <Badge variant={statusVariants[delivery.status]} size="sm">
                                {getStatusLabel(delivery.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">
                              {delivery.dropoff_address_text}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium text-slate-900">{formatCurrency(delivery.total_cost)}</p>
                            <p className="text-xs text-slate-500">
                              {formatDate(delivery.created_at, { dateStyle: 'short' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {delivery.status === 'failed' && (
                              <Button size="sm" variant="secondary" leftIcon={<RefreshCw className="h-3 w-3" />}>
                                Rebook
                              </Button>
                            )}
                            <Link to={`/deliveries/${delivery.id}`}>
                              <Button size="sm" variant="ghost" leftIcon={<Eye className="h-3 w-3" />}>
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredDeliveries.length === 0 && (
        <Card padding="lg" className="text-center">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No deliveries found</h3>
          <p className="text-slate-500 mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? "Try adjusting your filters"
              : "Start by creating your first delivery"}
          </p>
          <Link to="/book">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Create Delivery
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

