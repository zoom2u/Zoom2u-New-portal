import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  Pause,
  XCircle,
  RotateCcw,
  Edit,
  Clock,
  MapPin,
  Building2,
  User,
  Truck,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

// Mock data
const mockBookings = [
  {
    id: '1',
    tracking_id: 'Z2U-ABC12345',
    status: 'on_route',
    tenant: { name: 'Acme Corp', id: 't1' },
    customer: { name: 'John Smith', email: 'john@acme.com' },
    driver: { name: 'Michael Chen', id: 'd1' },
    pickup_address: '123 George St, Sydney NSW 2000',
    dropoff_address: '456 Pitt St, Sydney NSW 2000',
    service_type: 'standard',
    service_level: 'vip',
    total_cost: 34.90,
    driver_fee: 26.17,
    platform_fee: 5.24,
    booking_fee: 3.49,
    is_on_route: true,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    estimated_delivery: new Date(Date.now() + 15 * 60000).toISOString(),
    picked_up_at: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: '2',
    tracking_id: 'Z2U-DEF67890',
    status: 'pending',
    tenant: { name: 'TechStart', id: 't2' },
    customer: { name: 'Sarah Johnson', email: 'sarah@techstart.io' },
    driver: null,
    pickup_address: '789 Collins St, Melbourne VIC 3000',
    dropoff_address: '321 Flinders Ln, Melbourne VIC 3000',
    service_type: 'standard',
    service_level: 'standard',
    total_cost: 28.50,
    driver_fee: 21.37,
    platform_fee: 4.28,
    booking_fee: 2.85,
    is_on_route: false,
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
    estimated_delivery: new Date(Date.now() + 3 * 3600000).toISOString(),
    picked_up_at: null,
  },
  {
    id: '3',
    tracking_id: 'Z2U-GHI11223',
    status: 'delivered',
    tenant: { name: 'RetailMax', id: 't3' },
    customer: { name: 'Mike Brown', email: 'mike@retailmax.com' },
    driver: { name: 'Emily Wilson', id: 'd2' },
    pickup_address: '100 Queen St, Brisbane QLD 4000',
    dropoff_address: '200 Adelaide St, Brisbane QLD 4000',
    service_type: 'same_day',
    service_level: 'same_day',
    total_cost: 22.00,
    driver_fee: 16.50,
    platform_fee: 3.30,
    booking_fee: 2.20,
    is_on_route: false,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    estimated_delivery: new Date(Date.now() - 2 * 3600000).toISOString(),
    picked_up_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    delivered_at: new Date(Date.now() - 2.5 * 3600000).toISOString(),
  },
  {
    id: '4',
    tracking_id: 'Z2U-JKL44556',
    status: 'on_hold',
    tenant: { name: 'Acme Corp', id: 't1' },
    customer: { name: 'Lisa Taylor', email: 'lisa@acme.com' },
    driver: { name: 'James Davis', id: 'd3' },
    pickup_address: '50 Market St, Perth WA 6000',
    dropoff_address: '75 Murray St, Perth WA 6000',
    service_type: 'vip',
    service_level: 'vip',
    total_cost: 45.00,
    driver_fee: 33.75,
    platform_fee: 6.75,
    booking_fee: 4.50,
    is_on_route: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    estimated_delivery: new Date(Date.now() - 30 * 60000).toISOString(),
    picked_up_at: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    hold_reason: 'Customer requested delay - meeting in progress',
  },
  {
    id: '5',
    tracking_id: 'Z2U-MNO77889',
    status: 'failed',
    tenant: { name: 'GlobalTech', id: 't4' },
    customer: { name: 'David Lee', email: 'david@globaltech.com' },
    driver: { name: 'Chris Martin', id: 'd4' },
    pickup_address: '25 King William St, Adelaide SA 5000',
    dropoff_address: '60 Rundle Mall, Adelaide SA 5000',
    service_type: 'standard',
    service_level: 'standard',
    total_cost: 18.50,
    driver_fee: 13.87,
    platform_fee: 2.78,
    booking_fee: 1.85,
    is_on_route: false,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    estimated_delivery: new Date(Date.now() - 3 * 3600000).toISOString(),
    picked_up_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    failed_reason: 'Recipient not available after 3 attempts',
  },
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'on_route', label: 'On Route' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'failed', label: 'Failed' },
]

const tenantOptions = [
  { value: 'all', label: 'All Tenants' },
  { value: 't1', label: 'Acme Corp' },
  { value: 't2', label: 'TechStart' },
  { value: 't3', label: 'RetailMax' },
  { value: 't4', label: 'GlobalTech' },
]

const statusVariants: Record<string, 'pending' | 'on-route' | 'delivered' | 'on-hold' | 'failed'> = {
  pending: 'pending',
  scheduled: 'pending',
  picked_up: 'on-route',
  on_route: 'on-route',
  delivered: 'delivered',
  on_hold: 'on-hold',
  failed: 'failed',
}

export function AdminBookings() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tenantFilter, setTenantFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<'hold' | 'fail' | 'redeliver' | null>(null)
  const [actionNotes, setActionNotes] = useState('')

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.tracking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesTenant = tenantFilter === 'all' || booking.tenant.id === tenantFilter

    return matchesSearch && matchesStatus && matchesTenant
  })

  const handleAction = (booking: typeof mockBookings[0], action: 'hold' | 'fail' | 'redeliver') => {
    setSelectedBooking(booking)
    setActionType(action)
    setShowActionModal(true)
  }

  const submitAction = () => {
    // In real app, this would call API
    console.log('Action:', actionType, 'Booking:', selectedBooking?.tracking_id, 'Notes:', actionNotes)
    setShowActionModal(false)
    setSelectedBooking(null)
    setActionType(null)
    setActionNotes('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Bookings</h1>
          <p className="text-slate-500 mt-1">Manage and monitor all platform deliveries</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button variant="secondary" leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by tracking ID, customer, tenant..."
              leftIcon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-40">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Select
                options={tenantOptions}
                value={tenantFilter}
                onChange={(e) => setTenantFilter(e.target.value)}
              />
            </div>
            <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>
              More
            </Button>
          </div>
        </div>
      </Card>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        Showing {filteredBookings.length} of {mockBookings.length} bookings
      </p>

      {/* Bookings Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Booking
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Tenant / Customer
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Route
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Driver
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Total
                </th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{booking.tracking_id}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDate(booking.created_at, { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          <p className="text-sm font-medium text-slate-900">{booking.tenant.name}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <User className="h-3 w-3 text-slate-400" />
                          <p className="text-xs text-slate-500">{booking.customer.name}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1 max-w-[200px]">
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 truncate">{booking.pickup_address.split(',')[0]}</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 truncate">{booking.dropoff_address.split(',')[0]}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {booking.driver ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-slate-600">
                            {booking.driver.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm text-slate-900">{booking.driver.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariants[booking.status]} dot>
                      {getStatusLabel(booking.status)}
                    </Badge>
                    {booking.is_on_route && (
                      <div className="flex items-center gap-1 mt-1">
                        <Truck className="h-3 w-3 text-amber-500 animate-pulse" />
                        <span className="text-xs text-amber-600">En route</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(booking.total_cost)}</p>
                    <p className="text-xs text-slate-500">
                      Driver: {formatCurrency(booking.driver_fee)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/bookings/${booking.id}`}>
                        <Button size="icon-sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {booking.status !== 'delivered' && booking.status !== 'failed' && (
                        <>
                          <Button 
                            size="icon-sm" 
                            variant="ghost"
                            onClick={() => handleAction(booking, 'hold')}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon-sm" 
                            variant="ghost"
                            onClick={() => handleAction(booking, 'fail')}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      {booking.status === 'failed' && (
                        <Button 
                          size="icon-sm" 
                          variant="ghost"
                          onClick={() => handleAction(booking, 'redeliver')}
                        >
                          <RotateCcw className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={
          actionType === 'hold' ? 'Put Delivery On Hold' :
          actionType === 'fail' ? 'Mark as Failed Delivery' :
          'Re-deliver Package'
        }
        description={`Booking: ${selectedBooking?.tracking_id}`}
      >
        <div className="space-y-4">
          {actionType === 'hold' && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                Putting this delivery on hold will pause all driver activity. 
                The customer will be notified of the delay.
              </p>
            </div>
          )}
          {actionType === 'fail' && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                This action requires Senior CSA approval for any financial adjustments.
              </p>
            </div>
          )}
          {actionType === 'redeliver' && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                A new delivery attempt will be scheduled. The customer will be contacted
                to confirm availability.
              </p>
            </div>
          )}
          
          <Textarea
            label="Notes (required)"
            placeholder="Provide reason for this action..."
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'fail' ? 'danger' : 'primary'}
              onClick={submitAction}
              disabled={!actionNotes.trim()}
            >
              {actionType === 'hold' ? 'Put On Hold' :
               actionType === 'fail' ? 'Mark as Failed' :
               'Schedule Re-delivery'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

