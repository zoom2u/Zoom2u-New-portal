import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/stores/uiStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import {
  MapPin,
  Package,
  Clock,
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Truck,
  Calendar,
  FileText,
  Camera,
  PenTool,
  Phone,
  Mail,
  User,
  Recycle,
  Trash2,
  FileSignature,
  Star,
  Route,
  HelpCircle,
  Plus,
  X,
  Upload,
  Repeat,
  AlertTriangle,
  Box,
  Scale,
  Ruler,
  Building,
  Home,
  Briefcase,
  DollarSign,
  Info,
} from 'lucide-react'

// Service type options with priorities
const serviceTypeOptions = [
  {
    id: 'zoom2u_network',
    priority: 1,
    name: 'Zoom2u Network',
    description: 'Standard immediate delivery network service',
    icon: Zap,
    available: true,
    color: 'bg-primary-500',
  },
  {
    id: 'large_freight',
    priority: 2,
    name: 'Large Freight',
    description: 'For large/oversized items requiring specialized handling',
    icon: Truck,
    available: true,
    color: 'bg-amber-500',
  },
  {
    id: 'recurring',
    priority: 3,
    name: 'Recurring Booking',
    description: 'Schedule repeated, periodic delivery services',
    icon: Calendar,
    available: true,
    color: 'bg-green-500',
  },
  {
    id: 'multi_stop',
    priority: 4,
    name: 'Multi-Pickup / Multi-Delivery',
    description: 'Single booking with multiple pickup or dropoff stops',
    icon: Route,
    available: true,
    color: 'bg-indigo-500',
  },
  {
    id: 'white_glove',
    priority: 5,
    name: 'White Glove Service',
    description: 'Premium service with assembly, specific placement & more',
    icon: Star,
    available: true,
    color: 'bg-purple-500',
  },
  {
    id: 'signature_service',
    priority: 6,
    name: 'Signature Service',
    description: 'Pick up, get signature, and return to destination',
    icon: FileSignature,
    available: true,
    color: 'bg-blue-500',
  },
  {
    id: 'document_destruction',
    priority: 7,
    name: 'Document Destruction',
    description: 'Secure shredding service with bins & bags delivery',
    icon: FileText,
    available: true,
    color: 'bg-slate-600',
  },
  {
    id: 'rubbish_removal',
    priority: 8,
    name: 'Rubbish Removal',
    description: 'Collection and disposal of general rubbish',
    icon: Trash2,
    available: true,
    color: 'bg-orange-500',
  },
  {
    id: 'electronic_recycling',
    priority: 9,
    name: 'Electronic Recycling',
    description: 'Collection and recycling of electronic goods',
    icon: Recycle,
    available: true,
    color: 'bg-teal-500',
  },
]

interface LocationDetails {
  streetAddress: string
  suburb: string
  state: string
  postcode: string
  contactName: string
  phone: string
  email: string
  notes: string
}

const emptyLocation: LocationDetails = {
  streetAddress: '',
  suburb: '',
  state: '',
  postcode: '',
  contactName: '',
  phone: '',
  email: '',
  notes: '',
}

// Reusable Location Form Component
function LocationForm({ 
  location, 
  setLocation, 
  type,
  index,
}: { 
  location: LocationDetails
  setLocation: (loc: LocationDetails) => void
  type: 'pickup' | 'dropoff' | 'stop'
  index?: number
}) {
  const isPickup = type === 'pickup'
  const colorClass = isPickup ? 'green' : type === 'dropoff' ? 'red' : 'blue'
  
  return (
    <Card padding="md" className={`border-2 border-dashed border-${colorClass}-200 bg-${colorClass}-50/30`}>
      <div className="flex items-center gap-2 mb-6">
        <div className={`w-10 h-10 rounded-full bg-${colorClass}-100 flex items-center justify-center`}>
          <MapPin className={`h-5 w-5 text-${colorClass}-600`} />
        </div>
        <h3 className="font-medium text-slate-900">
          {type === 'pickup' ? 'Pickup' : type === 'dropoff' ? 'Drop-off' : `Stop ${index}`} Location
        </h3>
      </div>

      <div className="space-y-4">
        <Input
          label="Street Address"
          placeholder="123 Main Street"
          value={location.streetAddress}
          onChange={(e) => setLocation({ ...location, streetAddress: e.target.value })}
        />
        
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Suburb"
            placeholder="Sydney"
            value={location.suburb}
            onChange={(e) => setLocation({ ...location, suburb: e.target.value })}
          />
          <Input
            label="State"
            placeholder="NSW"
            value={location.state}
            onChange={(e) => setLocation({ ...location, state: e.target.value })}
          />
          <Input
            label="Postcode"
            placeholder="2000"
            value={location.postcode}
            onChange={(e) => setLocation({ ...location, postcode: e.target.value })}
          />
        </div>

        <div className={`pt-4 border-t border-${colorClass}-200`}>
          <p className="text-sm font-medium text-slate-700 mb-4">Contact Details</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              placeholder="John Smith"
              leftIcon={<User className="h-4 w-4" />}
              value={location.contactName}
              onChange={(e) => setLocation({ ...location, contactName: e.target.value })}
            />
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="0400 000 000"
              leftIcon={<Phone className="h-4 w-4" />}
              value={location.phone}
              onChange={(e) => setLocation({ ...location, phone: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              value={location.email}
              onChange={(e) => setLocation({ ...location, email: e.target.value })}
            />
          </div>
        </div>

        <div className={`pt-4 border-t border-${colorClass}-200`}>
          <Textarea
            label={type === 'pickup' ? 'Pickup Instructions' : 'Delivery Instructions'}
            placeholder="E.g., Gate code is 1234, Ring doorbell, Ask for reception..."
            rows={3}
            value={location.notes}
            onChange={(e) => setLocation({ ...location, notes: e.target.value })}
          />
        </div>
      </div>
    </Card>
  )
}

export function BookingWizard() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const toast = useToast()

  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Common location details
  const [pickupDetails, setPickupDetails] = useState<LocationDetails>(emptyLocation)
  const [dropoffDetails, setDropoffDetails] = useState<LocationDetails>(emptyLocation)
  
  // Package details
  const [packageDescription, setPackageDescription] = useState('')
  const [packageWeight, setPackageWeight] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  // Large Freight specific
  const [freightDimensions, setFreightDimensions] = useState({ length: '', width: '', height: '' })
  const [vehicleType, setVehicleType] = useState('')
  const [requiresTailgate, setRequiresTailgate] = useState(false)
  const [requiresForklift, setRequiresForklift] = useState(false)

  // Recurring specific
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [recurringDays, setRecurringDays] = useState<string[]>([])
  const [recurringStartDate, setRecurringStartDate] = useState('')
  const [recurringEndDate, setRecurringEndDate] = useState('')
  const [recurringTime, setRecurringTime] = useState('')

  // Multi-stop specific
  const [multiStopType, setMultiStopType] = useState<'multi_pickup' | 'multi_dropoff'>('multi_dropoff')
  const [additionalStops, setAdditionalStops] = useState<LocationDetails[]>([])

  // White glove specific
  const [whiteGloveOptions, setWhiteGloveOptions] = useState({
    assembly: false,
    disassembly: false,
    packaging: false,
    unpacking: false,
    roomPlacement: false,
    debrisRemoval: false,
    twoPersonLift: false,
    waitAndReturn: false,
  })

  // Signature service specific
  const [signatureDocumentType, setSignatureDocumentType] = useState('')
  const [requiresWitness, setRequiresWitness] = useState(false)
  const [returnDestination, setReturnDestination] = useState<LocationDetails>(emptyLocation)

  // Document destruction specific - multiple container types with quantities
  const [shredContainers, setShredContainers] = useState<Record<string, number>>({})
  const [requiresDelivery, setRequiresDelivery] = useState(true)
  const [requiresPickupOnly, setRequiresPickupOnly] = useState(false)
  const [shredCertificate, setShredCertificate] = useState(true)
  
  // Available shred container types (would come from admin settings in production)
  const shredContainerTypes = [
    { id: 'shred_bag', name: 'Shred Bag', description: 'Holds up to 16kg (~2-3 archive boxes or 45L of paper)', capacity: '16kg / 45L', price: 33.00, popular: true },
    { id: 'secure_bin_240', name: 'Secure 240L Bin', description: 'Large lockable bin for ongoing shredding needs', capacity: '240 litres', price: 55.00, popular: false },
    { id: 'secure_bin_120', name: 'Secure 120L Bin', description: 'Medium lockable bin for regular shredding', capacity: '120 litres', price: 45.00, popular: false },
    { id: 'archive_box', name: 'Archive Box', description: 'Standard archive box - great for bulk clearouts', capacity: 'Standard box', price: 8.80, popular: false },
    { id: 'banker_box', name: 'Banker Box', description: 'Standard banker box with lid', capacity: 'Standard box', price: 8.80, popular: false },
  ]

  // Rubbish removal specific
  const [rubbishType, setRubbishType] = useState<'general' | 'green' | 'construction' | 'mixed'>('general')
  const [estimatedVolume, setEstimatedVolume] = useState('')
  const [rubbishPhotos, setRubbishPhotos] = useState<File[]>([])

  // E-waste specific
  const [ewasteItems, setEwasteItems] = useState<{ type: string; quantity: number }[]>([])
  const [requiresDataDestruction, setRequiresDataDestruction] = useState(false)
  const [requiresCertificate, setRequiresCertificate] = useState(false)

  // Pricing calculation
  const calculatePrice = () => {
    let baseFee = 9.90
    let kmRate = 1.80
    const estimatedDistance = 12.5

    switch (selectedService) {
      case 'large_freight':
        baseFee = 89.00
        kmRate = 3.50
        break
      case 'recurring':
        baseFee = 7.50 // Discounted for recurring
        break
      case 'multi_stop':
        baseFee = 14.90
        baseFee += additionalStops.length * 5.00 // Per stop
        break
      case 'white_glove':
        baseFee = 49.00
        Object.values(whiteGloveOptions).forEach(opt => {
          if (opt) baseFee += 25.00
        })
        break
      case 'signature_service':
        baseFee = 29.00
        break
      case 'document_destruction':
        // Calculate total from all selected containers
        baseFee = 0
        shredContainerTypes.forEach(container => {
          const qty = shredContainers[container.id] || 0
          baseFee += container.price * qty
        })
        if (requiresDelivery && Object.values(shredContainers).some(q => q > 0)) {
          baseFee += 15.00 // Delivery fee for containers
        }
        kmRate = 0 // Flat fee service
        break
      case 'rubbish_removal':
        const volume = parseFloat(estimatedVolume) || 1
        baseFee = 75.00 + (volume * 50)
        break
      case 'electronic_recycling':
        baseFee = 45.00
        ewasteItems.forEach(item => {
          baseFee += item.quantity * 10
        })
        break
    }

    return baseFee + (estimatedDistance * kmRate)
  }

  const estimatedPrice = calculatePrice()

  const handleServiceSelect = (serviceId: string) => {
    const service = serviceTypeOptions.find(s => s.id === serviceId)
    if (service?.available) {
      setSelectedService(serviceId)
      setCurrentStep(1)
    } else {
      toast.info('Coming Soon', 'This service will be available soon.')
    }
  }

  const handleNext = () => {
    const maxSteps = getStepsForService().length
    if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setSelectedService(null)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Booking confirmed!', 'Your delivery has been scheduled.')
      navigate('/deliveries')
    } catch (error) {
      toast.error('Booking failed', 'Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const addStop = () => {
    setAdditionalStops([...additionalStops, { ...emptyLocation }])
  }

  const removeStop = (index: number) => {
    setAdditionalStops(additionalStops.filter((_, i) => i !== index))
  }

  const updateStop = (index: number, location: LocationDetails) => {
    const newStops = [...additionalStops]
    newStops[index] = location
    setAdditionalStops(newStops)
  }

  const addEwasteItem = () => {
    setEwasteItems([...ewasteItems, { type: '', quantity: 1 }])
  }

  const getStepsForService = () => {
    switch (selectedService) {
      case 'zoom2u_network':
        return [
          { id: 'service', title: 'Service Type', icon: Package },
          { id: 'pickup', title: 'Pickup', icon: MapPin },
          { id: 'dropoff', title: 'Drop-off', icon: MapPin },
          { id: 'package', title: 'Package', icon: Package },
          { id: 'review', title: 'Review', icon: Check },
        ]
      case 'large_freight':
        return [
          { id: 'service', title: 'Service', icon: Package },
          { id: 'freight', title: 'Freight Details', icon: Truck },
          { id: 'pickup', title: 'Pickup', icon: MapPin },
          { id: 'dropoff', title: 'Drop-off', icon: MapPin },
          { id: 'review', title: 'Review', icon: Check },
        ]
      case 'recurring':
        return [
          { id: 'service', title: 'Service', icon: Package },
          { id: 'schedule', title: 'Schedule', icon: Calendar },
          { id: 'pickup', title: 'Pickup', icon: MapPin },
          { id: 'dropoff', title: 'Drop-off', icon: MapPin },
          { id: 'review', title: 'Review', icon: Check },
        ]
      case 'multi_stop':
        return [
          { id: 'service', title: 'Service', icon: Package },
          { id: 'stops', title: 'Stops', icon: Route },
          { id: 'review', title: 'Review', icon: Check },
        ]
      case 'white_glove':
        return [
          { id: 'service', title: 'Service', icon: Package },
          { id: 'options', title: 'Options', icon: Star },
          { id: 'pickup', title: 'Pickup', icon: MapPin },
          { id: 'dropoff', title: 'Drop-off', icon: MapPin },
          { id: 'review', title: 'Review', icon: Check },
        ]
      case 'signature_service':
        return [
          { id: 'service', title: 'Service', icon: Package },
          { id: 'document', title: 'Document', icon: FileSignature },
          { id: 'pickup', title: 'Pickup', icon: MapPin },
          { id: 'signature', title: 'Signature', icon: PenTool },
          { id: 'return', title: 'Return', icon: ArrowLeft },
          { id: 'review', title: 'Review', icon: Check },
        ]
      case 'document_destruction':
        return [
          { id: 'service', title: 'Service', icon: Package },
          { id: 'containers', title: 'Containers', icon: Box },
          { id: 'location', title: 'Location', icon: MapPin },
          { id: 'schedule', title: 'Schedule', icon: Calendar },
          { id: 'review', title: 'Review', icon: Check },
        ]
      case 'rubbish_removal':
        return [
          { id: 'service', title: 'Service', icon: Package },
          { id: 'rubbish', title: 'Details', icon: Trash2 },
          { id: 'location', title: 'Location', icon: MapPin },
          { id: 'review', title: 'Review', icon: Check },
        ]
      case 'electronic_recycling':
        return [
          { id: 'service', title: 'Service', icon: Package },
          { id: 'items', title: 'Items', icon: Recycle },
          { id: 'location', title: 'Location', icon: MapPin },
          { id: 'review', title: 'Review', icon: Check },
        ]
      default:
        return [{ id: 'service', title: 'Service', icon: Package }]
    }
  }

  // ========== RENDER FUNCTIONS ==========

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Create a New Booking</h2>
        <p className="text-slate-500 mt-2">Select the type of service you need</p>
      </div>

      <div className="grid gap-4">
        {serviceTypeOptions.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceSelect(service.id)}
            className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
              service.available
                ? 'border-slate-200 hover:border-primary-500 hover:shadow-md bg-white'
                : 'border-slate-100 bg-slate-50 opacity-75'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${service.color} text-white`}>
                <service.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{service.name}</h3>
                  {!service.available && (
                    <Badge variant="secondary" size="sm">Coming Soon</Badge>
                  )}
                  {service.available && (
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">{service.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // Large Freight Form
  const renderFreightForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Freight Details</h2>
        <p className="text-sm text-slate-500 mt-1">Tell us about your large item</p>
      </div>

      <Card padding="md">
        <div className="space-y-6">
          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <Ruler className="inline h-4 w-4 mr-1" /> Dimensions (cm)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Length"
                value={freightDimensions.length}
                onChange={(e) => setFreightDimensions({ ...freightDimensions, length: e.target.value })}
              />
              <Input
                placeholder="Width"
                value={freightDimensions.width}
                onChange={(e) => setFreightDimensions({ ...freightDimensions, width: e.target.value })}
              />
              <Input
                placeholder="Height"
                value={freightDimensions.height}
                onChange={(e) => setFreightDimensions({ ...freightDimensions, height: e.target.value })}
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <Scale className="inline h-4 w-4 mr-1" /> Weight (kg)
            </label>
            <Input
              placeholder="Approximate weight"
              value={packageWeight}
              onChange={(e) => setPackageWeight(e.target.value)}
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <Truck className="inline h-4 w-4 mr-1" /> Required Vehicle
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Ute', 'Van', 'Small Truck', 'Large Truck'].map((type) => (
                <button
                  key={type}
                  onClick={() => setVehicleType(type)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    vehicleType === type 
                      ? 'border-amber-500 bg-amber-50 text-amber-700' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Truck className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Special Requirements</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresTailgate}
                  onChange={(e) => setRequiresTailgate(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <p className="font-medium text-slate-900">Tailgate Lift Required</p>
                  <p className="text-xs text-slate-500">Vehicle with hydraulic lift for loading/unloading</p>
                </div>
                <span className="ml-auto text-sm text-amber-600 font-medium">+$35</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresForklift}
                  onChange={(e) => setRequiresForklift(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <p className="font-medium text-slate-900">Forklift at Destination</p>
                  <p className="text-xs text-slate-500">Forklift available for unloading</p>
                </div>
              </label>
            </div>
          </div>

          {/* Description */}
          <Textarea
            label="Item Description"
            placeholder="Describe what you're shipping (e.g., furniture, machinery, palletized goods...)"
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
          />
        </div>
      </Card>
    </div>
  )

  // Recurring Schedule Form
  const renderRecurringForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Recurring Schedule</h2>
        <p className="text-sm text-slate-500 mt-1">Set up your repeating delivery schedule</p>
      </div>

      <Card padding="md">
        <div className="space-y-6">
          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Frequency</label>
            <div className="grid grid-cols-3 gap-3">
              {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setRecurringFrequency(freq)}
                  className={`p-4 rounded-lg border-2 text-center transition-all capitalize ${
                    recurringFrequency === freq 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Repeat className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{freq}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Days of Week (for weekly) */}
          {recurringFrequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Select Days</label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      if (recurringDays.includes(day)) {
                        setRecurringDays(recurringDays.filter(d => d !== day))
                      } else {
                        setRecurringDays([...recurringDays, day])
                      }
                    }}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      recurringDays.includes(day)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <Clock className="inline h-4 w-4 mr-1" /> Preferred Pickup Time
            </label>
            <Input
              type="time"
              value={recurringTime}
              onChange={(e) => setRecurringTime(e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Start Date</label>
              <Input
                type="date"
                value={recurringStartDate}
                onChange={(e) => setRecurringStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">End Date (Optional)</label>
              <Input
                type="date"
                value={recurringEndDate}
                onChange={(e) => setRecurringEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <Calendar className="inline h-4 w-4 mr-1" />
              <strong>Schedule Summary:</strong>{' '}
              {recurringFrequency === 'daily' && 'Every day'}
              {recurringFrequency === 'weekly' && `Every ${recurringDays.length > 0 ? recurringDays.join(', ') : 'week'}`}
              {recurringFrequency === 'monthly' && 'Every month'}
              {recurringTime && ` at ${recurringTime}`}
              {recurringStartDate && `, starting ${recurringStartDate}`}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )

  // Multi-Stop Form
  const renderMultiStopForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Multi-Stop Delivery</h2>
        <p className="text-sm text-slate-500 mt-1">Configure your route with multiple stops</p>
      </div>

      {/* Stop Type Selection */}
      <Card padding="md">
        <label className="block text-sm font-medium text-slate-700 mb-3">Route Type</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMultiStopType('multi_dropoff')}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              multiStopType === 'multi_dropoff'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <p className="font-medium text-slate-900">One Pickup → Multiple Drop-offs</p>
            <p className="text-xs text-slate-500 mt-1">Pick up from one location, deliver to many</p>
          </button>

          <button
            onClick={() => setMultiStopType('multi_pickup')}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              multiStopType === 'multi_pickup'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <p className="font-medium text-slate-900">Multiple Pickups → One Drop-off</p>
            <p className="text-xs text-slate-500 mt-1">Collect from many, deliver to one</p>
          </button>
        </div>
      </Card>

      {/* Primary Location */}
      <div>
        <h3 className="text-lg font-medium text-slate-900 mb-4">
          {multiStopType === 'multi_dropoff' ? 'Pickup Location' : 'Final Drop-off Location'}
        </h3>
        <LocationForm
          location={multiStopType === 'multi_dropoff' ? pickupDetails : dropoffDetails}
          setLocation={multiStopType === 'multi_dropoff' ? setPickupDetails : setDropoffDetails}
          type={multiStopType === 'multi_dropoff' ? 'pickup' : 'dropoff'}
        />
      </div>

      {/* Additional Stops */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-900">
            {multiStopType === 'multi_dropoff' ? 'Drop-off Locations' : 'Pickup Locations'}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addStop}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Stop
          </Button>
        </div>

        {additionalStops.length === 0 ? (
          <Card padding="md" className="text-center text-slate-500">
            <Route className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No stops added yet. Click "Add Stop" to add destinations.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {additionalStops.map((stop, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => removeStop(index)}
                  className="absolute -top-2 -right-2 z-10 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <LocationForm
                  location={stop}
                  setLocation={(loc) => updateStop(index, loc)}
                  type="stop"
                  index={index + 1}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Route Summary */}
      {additionalStops.length > 0 && (
        <Card padding="md" className="bg-indigo-50 border-indigo-200">
          <div className="flex items-center gap-3">
            <Route className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="font-medium text-indigo-900">
                Route: 1 {multiStopType === 'multi_dropoff' ? 'pickup' : 'drop-off'} → {additionalStops.length} {multiStopType === 'multi_dropoff' ? 'drop-offs' : 'pickups'}
              </p>
              <p className="text-sm text-indigo-700">
                Estimated distance optimized for fastest delivery
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )

  // White Glove Options Form
  const renderWhiteGloveForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Premium Service Options</h2>
        <p className="text-sm text-slate-500 mt-1">Select the services you need</p>
      </div>

      <Card padding="md">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'assembly', label: 'Assembly', desc: 'Assemble furniture/equipment', icon: Box, price: 45 },
            { key: 'disassembly', label: 'Disassembly', desc: 'Disassemble before transport', icon: Box, price: 35 },
            { key: 'packaging', label: 'Professional Packaging', desc: 'Secure wrapping & protection', icon: Package, price: 25 },
            { key: 'unpacking', label: 'Unpacking', desc: 'Remove all packaging materials', icon: Package, price: 20 },
            { key: 'roomPlacement', label: 'Room Placement', desc: 'Position item in specific room', icon: Home, price: 15 },
            { key: 'debrisRemoval', label: 'Debris Removal', desc: 'Remove and dispose packaging', icon: Trash2, price: 20 },
            { key: 'twoPersonLift', label: 'Two-Person Lift', desc: 'Heavy items requiring 2 people', icon: User, price: 50 },
            { key: 'waitAndReturn', label: 'Wait & Return', desc: 'Driver waits and returns item', icon: Clock, price: 40 },
          ].map(({ key, label, desc, icon: Icon, price }) => (
            <label
              key={key}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                whiteGloveOptions[key as keyof typeof whiteGloveOptions]
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={whiteGloveOptions[key as keyof typeof whiteGloveOptions]}
                onChange={(e) => setWhiteGloveOptions({ ...whiteGloveOptions, [key]: e.target.checked })}
                className="mt-1 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-slate-900">{label}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{desc}</p>
              </div>
              <span className="text-sm font-medium text-purple-600">+${price}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Selected Summary */}
      {Object.values(whiteGloveOptions).some(v => v) && (
        <Card padding="md" className="bg-purple-50 border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">Selected Services:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(whiteGloveOptions)
              .filter(([_, selected]) => selected)
              .map(([key]) => (
                <Badge key={key} variant="primary" className="bg-purple-500">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              ))}
          </div>
        </Card>
      )}
    </div>
  )

  // Signature Service Document Form
  const renderSignatureDocumentForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Document Details</h2>
        <p className="text-sm text-slate-500 mt-1">Tell us about the document requiring signature</p>
      </div>

      <Card padding="md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Document Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Contract', 'Legal Document', 'Medical Form', 'Financial Document', 'Government Form', 'Other'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSignatureDocumentType(type)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    signatureDocumentType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <FileSignature className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Document Description"
            placeholder="Describe the document and any specific signing requirements..."
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
          />

          <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={requiresWitness}
              onChange={(e) => setRequiresWitness(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <p className="font-medium text-slate-900">Witness Required</p>
              <p className="text-xs text-slate-500">Driver will witness the signature</p>
            </div>
            <span className="ml-auto text-sm text-blue-600 font-medium">+$15</span>
          </label>
        </div>
      </Card>
    </div>
  )

  // Signature Service Return Form
  const renderSignatureReturnForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Return Destination</h2>
        <p className="text-sm text-slate-500 mt-1">Where should the signed document be returned?</p>
      </div>

      <div className="flex gap-4 mb-4">
        <Button
          variant={returnDestination.streetAddress === pickupDetails.streetAddress ? 'primary' : 'outline'}
          onClick={() => setReturnDestination({ ...pickupDetails })}
        >
          Same as Pickup
        </Button>
        <Button
          variant={returnDestination.streetAddress !== pickupDetails.streetAddress && returnDestination.streetAddress ? 'primary' : 'outline'}
          onClick={() => setReturnDestination(emptyLocation)}
        >
          Different Location
        </Button>
      </div>

      {returnDestination.streetAddress !== pickupDetails.streetAddress && (
        <LocationForm
          location={returnDestination}
          setLocation={setReturnDestination}
          type="dropoff"
        />
      )}
    </div>
  )

  // Document Destruction Form (Shred2u style) - Multiple container types with quantities
  const renderDocumentDestructionForm = () => {
    const updateContainerQty = (containerId: string, delta: number) => {
      const currentQty = shredContainers[containerId] || 0
      const newQty = Math.max(0, currentQty + delta)
      setShredContainers({ ...shredContainers, [containerId]: newQty })
    }

    const totalContainers = Object.values(shredContainers).reduce((sum, qty) => sum + qty, 0)
    const containerTotal = shredContainerTypes.reduce((sum, container) => {
      return sum + (container.price * (shredContainers[container.id] || 0))
    }, 0)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Choose Your Shredding Containers</h2>
          <p className="text-sm text-slate-500 mt-1">Select quantities for each container type you need</p>
        </div>

        <Card padding="md">
          <div className="space-y-4">
            {shredContainerTypes.map((container) => {
              const qty = shredContainers[container.id] || 0
              return (
                <div
                  key={container.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    qty > 0
                      ? 'border-slate-700 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Container Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{container.name}</h4>
                        {container.popular && (
                          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{container.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Capacity: {container.capacity}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right mr-4">
                      <span className="text-lg font-bold text-slate-900">${container.price.toFixed(2)}</span>
                      <p className="text-xs text-slate-500">each</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateContainerQty(container.id, -1)}
                        disabled={qty === 0}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-medium transition-colors ${
                          qty === 0
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                      >
                        -
                      </button>
                      <span className={`w-10 text-center text-xl font-bold ${qty > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                        {qty}
                      </span>
                      <button
                        onClick={() => updateContainerQty(container.id, 1)}
                        className="w-10 h-10 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-lg font-medium text-slate-700"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    {qty > 0 && (
                      <div className="w-20 text-right">
                        <span className="font-semibold text-slate-900">
                          ${(container.price * qty).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          {totalContainers > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">
                  {totalContainers} container{totalContainers !== 1 ? 's' : ''} selected
                </span>
                <span className="text-xl font-bold text-slate-900">
                  ${containerTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Service Options */}
        <Card padding="md">
          <label className="block text-sm font-medium text-slate-700 mb-4">Service Options</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={requiresDelivery}
                onChange={(e) => {
                  setRequiresDelivery(e.target.checked)
                  if (e.target.checked) setRequiresPickupOnly(false)
                }}
                className="rounded border-slate-300 text-slate-700 focus:ring-slate-500"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900">Deliver Empty Containers</p>
                <p className="text-xs text-slate-500">We'll deliver empty bags/bins to your location</p>
              </div>
              <span className="text-sm text-slate-600 font-medium">+$15.00</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={requiresPickupOnly}
                onChange={(e) => {
                  setRequiresPickupOnly(e.target.checked)
                  if (e.target.checked) setRequiresDelivery(false)
                }}
                className="rounded border-slate-300 text-slate-700 focus:ring-slate-500"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900">Pickup Only (I Have Containers)</p>
                <p className="text-xs text-slate-500">Already have filled containers ready for collection</p>
              </div>
              <span className="text-sm text-green-600 font-medium">No extra fee</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-green-50 rounded-lg cursor-pointer border border-green-200">
              <input
                type="checkbox"
                checked={shredCertificate}
                onChange={(e) => setShredCertificate(e.target.checked)}
                className="rounded border-green-300 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900">Certificate of Destruction</p>
                <p className="text-xs text-slate-500">Official certificate confirming secure destruction</p>
              </div>
              <span className="text-sm text-green-600 font-medium">Included</span>
            </label>
          </div>
        </Card>

        {/* Security Info */}
        <div className="flex items-start gap-3 p-4 bg-slate-100 rounded-lg">
          <Shield className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700">
            <strong>Secure & Compliant:</strong> All documents are securely shredded in accordance with 
            Australian Privacy Principles. Cross-cut shredding to DIN 66399 security level P-4.
          </div>
        </div>
      </div>
    )
  }

  // Document Destruction Schedule Form
  const renderShredScheduleForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Schedule Your Service</h2>
        <p className="text-sm text-slate-500 mt-1">Choose when you'd like us to collect your documents</p>
      </div>

      <Card padding="md">
        <div className="space-y-6">
          {requiresDelivery && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                <Package className="inline h-4 w-4 mr-1" /> Container Delivery Date
              </label>
              <Input
                type="date"
                value={recurringStartDate}
                onChange={(e) => setRecurringStartDate(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-2">We'll deliver empty containers to your location</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <Truck className="inline h-4 w-4 mr-1" /> Collection Date
            </label>
            <Input
              type="date"
              value={recurringEndDate}
              onChange={(e) => setRecurringEndDate(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-2">We'll collect filled containers for secure shredding</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <Clock className="inline h-4 w-4 mr-1" /> Preferred Time Window
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Morning (8am-12pm)', 'Afternoon (12pm-5pm)'].map((time) => (
                <button
                  key={time}
                  onClick={() => setRecurringTime(time)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    recurringTime === time
                      ? 'border-slate-700 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium">{time}</span>
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Access Instructions"
            placeholder="Any details about accessing your premises, parking, loading dock, etc."
            rows={3}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </div>
      </Card>

      {/* Summary Card */}
      <Card padding="md" className="bg-slate-50 border-slate-200">
        <h4 className="font-medium text-slate-900 mb-3">Service Summary</h4>
        <div className="space-y-2 text-sm">
          {shredContainerTypes.map(container => {
            const qty = shredContainers[container.id] || 0
            if (qty === 0) return null
            return (
              <div key={container.id} className="flex justify-between">
                <span className="text-slate-600">{qty}x {container.name}</span>
                <span className="text-slate-900">${(container.price * qty).toFixed(2)}</span>
              </div>
            )
          })}
          {requiresDelivery && Object.values(shredContainers).some(q => q > 0) && (
            <div className="flex justify-between">
              <span className="text-slate-600">Container Delivery</span>
              <span className="text-slate-900">$15.00</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-600">Certificate of Destruction</span>
            <span className="text-green-600">Included</span>
          </div>
        </div>
      </Card>
    </div>
  )

  // Rubbish Removal Form
  const renderRubbishForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Rubbish Details</h2>
        <p className="text-sm text-slate-500 mt-1">Tell us about the waste to be removed</p>
      </div>

      <Card padding="md">
        <div className="space-y-6">
          {/* Rubbish Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Type of Waste</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'general', label: 'General Waste', icon: Trash2 },
                { type: 'green', label: 'Green Waste', icon: Recycle },
                { type: 'construction', label: 'Construction', icon: Building },
                { type: 'mixed', label: 'Mixed Waste', icon: Package },
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setRubbishType(type as typeof rubbishType)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    rubbishType === type
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Volume Estimate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Estimated Volume (cubic meters)
            </label>
            <div className="grid grid-cols-4 gap-3">
              {['1', '2', '3', '4+'].map((vol) => (
                <button
                  key={vol}
                  onClick={() => setEstimatedVolume(vol)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    estimatedVolume === vol
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl font-bold">{vol}</span>
                  <span className="text-xs block">m³</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              1 cubic meter ≈ a standard washing machine × 3
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <Camera className="inline h-4 w-4 mr-1" /> Photos (Optional but Recommended)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Drop photos here or click to upload</p>
              <p className="text-xs text-slate-400 mt-1">Helps us provide accurate quote</p>
            </div>
          </div>

          <Textarea
            label="Additional Notes"
            placeholder="Any access restrictions, specific items, or other details..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </div>
      </Card>

      {/* Warning for hazardous */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Note:</strong> Hazardous materials, asbestos, chemicals, and certain items cannot be collected. 
          Contact us for special requirements.
        </div>
      </div>
    </div>
  )

  // Electronic Recycling Form
  const renderEwasteForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">E-Waste Items</h2>
        <p className="text-sm text-slate-500 mt-1">List the electronic items for recycling</p>
      </div>

      <Card padding="md">
        <div className="space-y-6">
          {/* Quick Add Items */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Common Items</label>
            <div className="flex flex-wrap gap-2">
              {['Computer', 'Laptop', 'Monitor', 'TV', 'Printer', 'Phone', 'Tablet', 'Server', 'Battery'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    const existing = ewasteItems.find(i => i.type === item)
                    if (existing) {
                      setEwasteItems(ewasteItems.map(i => 
                        i.type === item ? { ...i, quantity: i.quantity + 1 } : i
                      ))
                    } else {
                      setEwasteItems([...ewasteItems, { type: item, quantity: 1 }])
                    }
                  }}
                  className="px-3 py-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
                >
                  <Plus className="inline h-3 w-3 mr-1" />{item}
                </button>
              ))}
            </div>
          </div>

          {/* Item List */}
          {ewasteItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Your Items</label>
              <div className="space-y-2">
                {ewasteItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Recycle className="h-5 w-5 text-teal-600" />
                    <span className="flex-1 font-medium">{item.type}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            setEwasteItems(ewasteItems.map((i, idx) => 
                              idx === index ? { ...i, quantity: i.quantity - 1 } : i
                            ))
                          } else {
                            setEwasteItems(ewasteItems.filter((_, idx) => idx !== index))
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => {
                          setEwasteItems(ewasteItems.map((i, idx) => 
                            idx === index ? { ...i, quantity: i.quantity + 1 } : i
                          ))
                        }}
                        className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => setEwasteItems(ewasteItems.filter((_, idx) => idx !== index))}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Item */}
          <Button
            variant="outline"
            onClick={addEwasteItem}
            leftIcon={<Plus className="h-4 w-4" />}
            fullWidth
          >
            Add Custom Item
          </Button>

          {/* Data Destruction */}
          <div className="pt-4 border-t border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-3">Data Security</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresDataDestruction}
                  onChange={(e) => setRequiresDataDestruction(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <p className="font-medium text-slate-900">Secure Data Destruction</p>
                  <p className="text-xs text-slate-500">Physical destruction of storage devices</p>
                </div>
                <span className="ml-auto text-sm text-teal-600 font-medium">+$25/device</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresCertificate}
                  onChange={(e) => setRequiresCertificate(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <p className="font-medium text-slate-900">Certificate of Destruction</p>
                  <p className="text-xs text-slate-500">Official documentation for compliance</p>
                </div>
                <span className="ml-auto text-sm text-teal-600 font-medium">+$15</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Environmental Note */}
      <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <Recycle className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-teal-800">
          <strong>Eco-Friendly:</strong> All items are responsibly recycled in accordance with Australian e-waste regulations. 
          You'll receive a recycling certificate upon completion.
        </div>
      </div>
    </div>
  )

  // Generic Package Form
  const renderPackageForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Package Information</h2>
        <p className="text-sm text-slate-500 mt-1">Tell us about what you're sending</p>
      </div>

      <Card padding="md">
        <div className="space-y-4">
          <Textarea
            label="Package Description"
            placeholder="E.g., Small cardboard box containing documents..."
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Approximate Weight (kg)"
              type="number"
              placeholder="e.g., 5"
              value={packageWeight}
              onChange={(e) => setPackageWeight(e.target.value)}
            />
            <Input
              label="Dimensions (optional)"
              placeholder="L x W x H cm"
            />
          </div>

          <Textarea
            label="Special Handling Instructions"
            placeholder="Any special requirements..."
            rows={2}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </div>
      </Card>

      <Card padding="md">
        <h3 className="font-medium text-slate-900 mb-4">Proof of Delivery</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5 text-slate-600" />
              <div>
                <p className="font-medium text-slate-900">Photo proof</p>
                <p className="text-xs text-slate-500">Driver takes photo on delivery</p>
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <PenTool className="h-5 w-5 text-slate-600" />
              <div>
                <p className="font-medium text-slate-900">Signature required</p>
                <p className="text-xs text-slate-500">Recipient must sign on delivery</p>
              </div>
            </div>
            <input
              type="checkbox"
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
        </div>
      </Card>
    </div>
  )

  // Render Review based on service type
  const renderReview = () => {
    const service = serviceTypeOptions.find(s => s.id === selectedService)
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Review & Confirm</h2>
          <p className="text-sm text-slate-500 mt-1">Please review your booking details</p>
        </div>

        {/* Service Badge */}
        <Card padding="sm" className={`${service?.color} text-white`}>
          <div className="flex items-center gap-3">
            {service && <service.icon className="h-6 w-6" />}
            <div>
              <p className="font-semibold">{service?.name}</p>
              <p className="text-sm opacity-90">{service?.description}</p>
            </div>
          </div>
        </Card>

        {/* Location Summary */}
        {(selectedService !== 'rubbish_removal' && selectedService !== 'electronic_recycling' && selectedService !== 'document_destruction') && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card padding="md" className="bg-green-50 border-green-200">
              <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" /> Pickup
              </h3>
              <p className="text-sm text-slate-700">{pickupDetails.streetAddress || 'Not specified'}</p>
              {pickupDetails.suburb && (
                <p className="text-sm text-slate-500">
                  {pickupDetails.suburb}, {pickupDetails.state} {pickupDetails.postcode}
                </p>
              )}
              {pickupDetails.contactName && (
                <div className="mt-3 pt-3 border-t border-green-200 text-sm">
                  <p className="text-slate-600">{pickupDetails.contactName}</p>
                  <p className="text-slate-500">{pickupDetails.phone}</p>
                </div>
              )}
            </Card>

            <Card padding="md" className="bg-red-50 border-red-200">
              <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600" /> Drop-off
              </h3>
              <p className="text-sm text-slate-700">{dropoffDetails.streetAddress || 'Not specified'}</p>
              {dropoffDetails.suburb && (
                <p className="text-sm text-slate-500">
                  {dropoffDetails.suburb}, {dropoffDetails.state} {dropoffDetails.postcode}
                </p>
              )}
              {dropoffDetails.contactName && (
                <div className="mt-3 pt-3 border-t border-red-200 text-sm">
                  <p className="text-slate-600">{dropoffDetails.contactName}</p>
                  <p className="text-slate-500">{dropoffDetails.phone}</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Document Destruction Summary */}
        {selectedService === 'document_destruction' && (
          <Card padding="md" className="bg-slate-50 border-slate-200">
            <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" /> Shredding Order
            </h3>
            <div className="space-y-3">
              {/* List all selected containers */}
              {shredContainerTypes.map(container => {
                const qty = shredContainers[container.id] || 0
                if (qty === 0) return null
                return (
                  <div key={container.id} className="flex items-center justify-between">
                    <span className="text-slate-600">{container.name}</span>
                    <span className="font-medium text-slate-900">× {qty}</span>
                  </div>
                )
              })}
              {requiresDelivery && Object.values(shredContainers).some(q => q > 0) && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Container Delivery</span>
                  <Badge variant="primary" size="sm">Yes</Badge>
                </div>
              )}
              {shredCertificate && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Certificate of Destruction</span>
                  <Badge variant="success" size="sm">Included</Badge>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-700"><strong>Collection Address:</strong></p>
              <p className="text-sm text-slate-600">{pickupDetails.streetAddress}</p>
              <p className="text-sm text-slate-500">{pickupDetails.suburb}, {pickupDetails.state} {pickupDetails.postcode}</p>
            </div>
          </Card>
        )}

        {/* Service-specific details */}
        {selectedService === 'multi_stop' && additionalStops.length > 0 && (
          <Card padding="md">
            <h3 className="font-medium text-slate-900 mb-3">
              Additional Stops ({additionalStops.length})
            </h3>
            <div className="space-y-2">
              {additionalStops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">
                    {stop.streetAddress}, {stop.suburb}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {selectedService === 'white_glove' && Object.values(whiteGloveOptions).some(v => v) && (
          <Card padding="md">
            <h3 className="font-medium text-slate-900 mb-3">Premium Services</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(whiteGloveOptions)
                .filter(([_, selected]) => selected)
                .map(([key]) => (
                  <Badge key={key} variant="primary" className="bg-purple-500">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                ))}
            </div>
          </Card>
        )}

        {selectedService === 'recurring' && (
          <Card padding="md" className="bg-green-50 border-green-200">
            <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" /> Schedule
            </h3>
            <p className="text-sm text-slate-700">
              {recurringFrequency === 'daily' && 'Every day'}
              {recurringFrequency === 'weekly' && `Every ${recurringDays.join(', ')}`}
              {recurringFrequency === 'monthly' && 'Monthly'}
              {recurringTime && ` at ${recurringTime}`}
            </p>
            {recurringStartDate && (
              <p className="text-sm text-slate-500">Starting: {recurringStartDate}</p>
            )}
          </Card>
        )}

        {selectedService === 'electronic_recycling' && ewasteItems.length > 0 && (
          <Card padding="md">
            <h3 className="font-medium text-slate-900 mb-3">Items for Recycling</h3>
            <div className="space-y-2">
              {ewasteItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{item.type}</span>
                  <span className="text-slate-500">× {item.quantity}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Price Breakdown */}
        <Card padding="md" className="bg-slate-50">
          <h3 className="font-medium text-slate-900 mb-4">Price Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Service Fee</span>
              <span className="text-slate-900">{formatCurrency(estimatedPrice * 0.7)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Platform Fee</span>
              <span className="text-slate-900">{formatCurrency(estimatedPrice * 0.2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Booking Fee</span>
              <span className="text-slate-900">{formatCurrency(estimatedPrice * 0.1)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-200 font-semibold">
              <span className="text-slate-900">Total</span>
              <span className="text-2xl" style={{ color: '#00B4D8' }}>
                {formatCurrency(estimatedPrice)}
              </span>
            </div>
          </div>
        </Card>

        {/* Terms */}
        <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <HelpCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            By confirming this booking, you agree to our{' '}
            <a href="/terms" className="underline">Terms of Service</a>.
          </p>
        </div>
      </div>
    )
  }

  // Main step content router
  const renderStepContent = () => {
    if (!selectedService) {
      return renderServiceSelection()
    }

    const steps = getStepsForService()
    const stepId = steps[currentStep]?.id

    // Service selection (step 0)
    if (currentStep === 0 || stepId === 'service') {
      return renderServiceSelection()
    }

    // Route based on service type and step
    switch (selectedService) {
      case 'zoom2u_network':
        if (stepId === 'pickup') return (
          <LocationForm location={pickupDetails} setLocation={setPickupDetails} type="pickup" />
        )
        if (stepId === 'dropoff') return (
          <LocationForm location={dropoffDetails} setLocation={setDropoffDetails} type="dropoff" />
        )
        if (stepId === 'package') return renderPackageForm()
        if (stepId === 'review') return renderReview()
        break

      case 'large_freight':
        if (stepId === 'freight') return renderFreightForm()
        if (stepId === 'pickup') return (
          <LocationForm location={pickupDetails} setLocation={setPickupDetails} type="pickup" />
        )
        if (stepId === 'dropoff') return (
          <LocationForm location={dropoffDetails} setLocation={setDropoffDetails} type="dropoff" />
        )
        if (stepId === 'review') return renderReview()
        break

      case 'recurring':
        if (stepId === 'schedule') return renderRecurringForm()
        if (stepId === 'pickup') return (
          <LocationForm location={pickupDetails} setLocation={setPickupDetails} type="pickup" />
        )
        if (stepId === 'dropoff') return (
          <LocationForm location={dropoffDetails} setLocation={setDropoffDetails} type="dropoff" />
        )
        if (stepId === 'review') return renderReview()
        break

      case 'multi_stop':
        if (stepId === 'stops') return renderMultiStopForm()
        if (stepId === 'review') return renderReview()
        break

      case 'white_glove':
        if (stepId === 'options') return renderWhiteGloveForm()
        if (stepId === 'pickup') return (
          <LocationForm location={pickupDetails} setLocation={setPickupDetails} type="pickup" />
        )
        if (stepId === 'dropoff') return (
          <LocationForm location={dropoffDetails} setLocation={setDropoffDetails} type="dropoff" />
        )
        if (stepId === 'review') return renderReview()
        break

      case 'signature_service':
        if (stepId === 'document') return renderSignatureDocumentForm()
        if (stepId === 'pickup') return (
          <LocationForm location={pickupDetails} setLocation={setPickupDetails} type="pickup" />
        )
        if (stepId === 'signature') return (
          <LocationForm location={dropoffDetails} setLocation={setDropoffDetails} type="dropoff" />
        )
        if (stepId === 'return') return renderSignatureReturnForm()
        if (stepId === 'review') return renderReview()
        break

      case 'document_destruction':
        if (stepId === 'containers') return renderDocumentDestructionForm()
        if (stepId === 'location') return (
          <LocationForm location={pickupDetails} setLocation={setPickupDetails} type="pickup" />
        )
        if (stepId === 'schedule') return renderShredScheduleForm()
        if (stepId === 'review') return renderReview()
        break

      case 'rubbish_removal':
        if (stepId === 'rubbish') return renderRubbishForm()
        if (stepId === 'location') return (
          <LocationForm location={pickupDetails} setLocation={setPickupDetails} type="pickup" />
        )
        if (stepId === 'review') return renderReview()
        break

      case 'electronic_recycling':
        if (stepId === 'items') return renderEwasteForm()
        if (stepId === 'location') return (
          <LocationForm location={pickupDetails} setLocation={setPickupDetails} type="pickup" />
        )
        if (stepId === 'review') return renderReview()
        break
    }

    return null
  }

  const steps = getStepsForService()

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      {selectedService && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => index < currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`flex items-center gap-2 ${
                    index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'text-white shadow-lg'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                    style={index === currentStep ? { backgroundColor: '#00B4D8' } : {}}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`hidden md:block text-sm font-medium ${
                      index <= currentStep ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 lg:w-16 h-1 mx-2 rounded-full transition-all ${
                      index < currentStep ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <Card padding="lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedService ? `${selectedService}-${currentStep}` : 'service-selection'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {selectedService && currentStep > 0 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <span className="text-sm text-slate-500">
                  Est. total: <span className="font-semibold text-slate-900">{formatCurrency(estimatedPrice)}</span>
                </span>
              )}
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="accent"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  rightIcon={<Check className="h-4 w-4" />}
                >
                  Confirm Booking
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
