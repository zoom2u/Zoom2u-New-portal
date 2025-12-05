import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate, getStatusLabel, cn } from '@/lib/utils'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageSquare,
  Download,
  RefreshCw,
  Copy,
  ExternalLink,
  User,
  Mail,
  FileText,
  Camera,
  PenTool,
  DollarSign,
  Calendar,
  Navigation,
  Share2,
  Printer,
  Shield,
  Loader2,
} from 'lucide-react'

// Mock delivery data - in production this would come from Supabase
const getMockDelivery = (id: string) => ({
  id,
  tracking_id: 'Z2U-ABC12345',
  status: 'on_route' as const,
  service_type: 'standard',
  service_level: 'standard',
  
  // Pickup details
  pickup_address_text: '123 George St, Sydney NSW 2000',
  pickup_contact_name: 'John Smith',
  pickup_contact_phone: '0412 345 678',
  pickup_contact_email: 'john@example.com',
  pickup_notes: 'Ring doorbell, ask for reception',
  actual_pickup_time: new Date(Date.now() - 45 * 60000).toISOString(),
  
  // Dropoff details
  dropoff_address_text: '456 Pitt St, Sydney NSW 2000',
  dropoff_contact_name: 'Jane Doe',
  dropoff_contact_phone: '0498 765 432',
  dropoff_contact_email: 'jane@example.com',
  dropoff_notes: 'Leave with reception if not available',
  actual_delivery_time: null,
  
  // Delivery info
  estimated_delivery_time: new Date(Date.now() + 30 * 60000).toISOString(),
  distance_km: 4.5,
  package_description: 'Small cardboard box containing documents',
  package_weight_kg: 2.5,
  special_instructions: 'Handle with care - fragile contents',
  requires_signature: true,
  requires_photo: true,
  
  // Driver info
  driver_name: 'Michael Chen',
  driver_phone: '0400 111 222',
  driver_photo: null,
  driver_rating: 4.8,
  driver_vehicle: 'Toyota HiAce Van',
  driver_vehicle_rego: 'ABC 123',
  is_on_route: true,
  
  // Pricing breakdown
  driver_service_fee: 18.00,
  platform_fee: 4.90,
  booking_fee: 2.00,
  freight_protection_fee: 0,
  total_cost: 24.90,
  freight_protection_enabled: false,
  
  // Proof of delivery
  signature_url: null,
  photo_urls: [],
  delivery_location_lat: null,
  delivery_location_lng: null,
  
  // Metadata
  created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  updated_at: new Date(Date.now() - 5 * 60000).toISOString(),
})

const statusConfig: Record<string, { color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { color: 'text-slate-600', bgColor: 'bg-slate-100', icon: Clock },
  scheduled: { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Calendar },
  picked_up: { color: 'text-indigo-600', bgColor: 'bg-indigo-100', icon: Package },
  on_route: { color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Truck },
  delivered: { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  on_hold: { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertCircle },
  failed: { color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle },
  redelivered: { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: RefreshCw },
}

const statusSteps = [
  { key: 'pending', label: 'Booking Created' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'on_route', label: 'On Route' },
  { key: 'delivered', label: 'Delivered' },
]

export function DeliveryDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [delivery, setDelivery] = useState<ReturnType<typeof getMockDelivery> | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      if (id) {
        setDelivery(getMockDelivery(id))
      }
      setIsLoading(false)
    }, 500)
  }, [id])

  const copyTrackingId = () => {
    if (delivery) {
      navigator.clipboard.writeText(delivery.tracking_id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getCurrentStepIndex = () => {
    if (!delivery) return 0
    const index = statusSteps.findIndex(s => s.key === delivery.status)
    return index === -1 ? 0 : index
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!delivery) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-lg font-medium text-slate-900">Delivery not found</h2>
        <p className="text-slate-500 mt-2">This delivery may have been removed or doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate('/deliveries')}>
          Back to Deliveries
        </Button>
      </div>
    )
  }

  const config = statusConfig[delivery.status] || statusConfig.pending
  const StatusIcon = config.icon
  const currentStep = getCurrentStepIndex()

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/deliveries')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Deliveries</span>
        </button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Share2 className="h-4 w-4" />}>
            Share
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Printer className="h-4 w-4" />}>
            Print
          </Button>
        </div>
      </div>

      {/* Main Header Card */}
      <Card padding="lg">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-xl', config.bgColor)}>
              <StatusIcon className={cn('h-6 w-6', config.color)} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{delivery.tracking_id}</h1>
                <button
                  onClick={copyTrackingId}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Copy tracking ID"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={delivery.status === 'delivered' ? 'success' : delivery.status === 'failed' ? 'error' : 'warning'}
                  dot
                >
                  {getStatusLabel(delivery.status)}
                </Badge>
                <span className="text-sm text-slate-500">
                  {delivery.service_type.charAt(0).toUpperCase() + delivery.service_type.slice(1)} Delivery
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(delivery.total_cost)}</p>
            <p className="text-sm text-slate-500 mt-1">
              Created {formatDate(delivery.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                      index <= currentStep
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    )}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    'text-xs mt-2 font-medium',
                    index <= currentStep ? 'text-slate-900' : 'text-slate-400'
                  )}>
                    {step.label}
                  </span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div
                      className={cn(
                        'h-1 rounded-full transition-all',
                        index < currentStep ? 'bg-primary-500' : 'bg-slate-200'
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Details */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Route Details</h2>
            
            <div className="space-y-6">
              {/* Pickup */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="w-0.5 h-full bg-slate-200 my-2" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Pickup</span>
                    {delivery.actual_pickup_time && (
                      <span className="text-xs text-slate-500">
                        Picked up at {formatDate(delivery.actual_pickup_time, { timeStyle: 'short' })}
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-slate-900">{delivery.pickup_address_text}</p>
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">{delivery.pickup_contact_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">{delivery.pickup_contact_phone}</span>
                    </div>
                    {delivery.pickup_notes && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-slate-400 mt-0.5" />
                        <span className="text-slate-600 italic">"{delivery.pickup_notes}"</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Drop-off</span>
                    {delivery.actual_delivery_time ? (
                      <span className="text-xs text-slate-500">
                        Delivered at {formatDate(delivery.actual_delivery_time, { timeStyle: 'short' })}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Est. {formatDate(delivery.estimated_delivery_time, { timeStyle: 'short' })}
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-slate-900">{delivery.dropoff_address_text}</p>
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">{delivery.dropoff_contact_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">{delivery.dropoff_contact_phone}</span>
                    </div>
                    {delivery.dropoff_notes && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-slate-400 mt-0.5" />
                        <span className="text-slate-600 italic">"{delivery.dropoff_notes}"</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Distance */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total Distance</span>
                <span className="font-medium text-slate-900">{delivery.distance_km} km</span>
              </div>
            </div>
          </Card>

          {/* Package Details */}
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Package Details</h2>
            
            <div className="space-y-4">
              {delivery.package_description && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Description</p>
                  <p className="text-slate-900">{delivery.package_description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {delivery.package_weight_kg && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Weight</p>
                    <p className="font-medium text-slate-900">{delivery.package_weight_kg} kg</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500 mb-1">Service Level</p>
                  <p className="font-medium text-slate-900 capitalize">{delivery.service_level}</p>
                </div>
              </div>

              {delivery.special_instructions && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Special Instructions:</strong> {delivery.special_instructions}
                  </p>
                </div>
              )}

              {/* Proof of Delivery Requirements */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-3">Proof of Delivery</p>
                <div className="flex gap-4">
                  <div className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg',
                    delivery.requires_photo ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                  )}>
                    <Camera className="h-4 w-4" />
                    <span className="text-sm">Photo {delivery.requires_photo ? 'Required' : 'Not Required'}</span>
                  </div>
                  <div className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg',
                    delivery.requires_signature ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                  )}>
                    <PenTool className="h-4 w-4" />
                    <span className="text-sm">Signature {delivery.requires_signature ? 'Required' : 'Not Required'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Proof of Delivery (if delivered) */}
          {delivery.status === 'delivered' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Proof of Delivery</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {delivery.signature_url ? (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">Signature</p>
                    <img src={delivery.signature_url} alt="Signature" className="max-h-24" />
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500">
                    <PenTool className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No signature captured</p>
                  </div>
                )}
                
                {delivery.photo_urls && delivery.photo_urls.length > 0 ? (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">Photos</p>
                    <div className="grid grid-cols-2 gap-2">
                      {delivery.photo_urls.map((url, i) => (
                        <img key={i} src={url} alt={`Delivery photo ${i + 1}`} className="rounded-lg" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500">
                    <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No photos captured</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Driver Card */}
          {delivery.driver_name && (
            <Card padding="lg">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Your Driver</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center">
                  {delivery.driver_photo ? (
                    <img src={delivery.driver_photo} alt={delivery.driver_name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-lg font-medium text-slate-600">
                      {delivery.driver_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{delivery.driver_name}</p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <span>⭐</span>
                    <span>{delivery.driver_rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Vehicle</span>
                  <span className="text-slate-900">{delivery.driver_vehicle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rego</span>
                  <span className="text-slate-900">{delivery.driver_vehicle_rego}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" fullWidth leftIcon={<Phone className="h-4 w-4" />}>
                  Call
                </Button>
                <Button variant="secondary" fullWidth leftIcon={<MessageSquare className="h-4 w-4" />}>
                  Chat
                </Button>
              </div>
            </Card>
          )}

          {/* Price Breakdown */}
          <Card padding="lg">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Price Breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Driver Service Fee</span>
                <span className="text-slate-900">{formatCurrency(delivery.driver_service_fee)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Platform Fee</span>
                <span className="text-slate-900">{formatCurrency(delivery.platform_fee)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Booking Fee</span>
                <span className="text-slate-900">{formatCurrency(delivery.booking_fee)}</span>
              </div>
              {delivery.freight_protection_enabled && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Freight Protection
                  </span>
                  <span className="text-slate-900">{formatCurrency(delivery.freight_protection_fee)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-slate-900">{formatCurrency(delivery.total_cost)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card padding="lg">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Actions</h3>
            
            <div className="space-y-2">
              <Button variant="secondary" fullWidth leftIcon={<Download className="h-4 w-4" />}>
                Download Receipt
              </Button>
              <Button variant="secondary" fullWidth leftIcon={<ExternalLink className="h-4 w-4" />}>
                Share Tracking Link
              </Button>
              {delivery.status === 'failed' && (
                <Button variant="primary" fullWidth leftIcon={<RefreshCw className="h-4 w-4" />}>
                  Rebook Delivery
                </Button>
              )}
            </div>
          </Card>

          {/* Need Help */}
          <Card padding="md" className="bg-slate-50 border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Need help with this delivery?</p>
            <Button variant="link" className="text-primary-600 p-0">
              Contact Support →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

