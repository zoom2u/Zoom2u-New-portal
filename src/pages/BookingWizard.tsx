import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDeliveryStore } from '@/stores/deliveryStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/stores/uiStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, calculateDeliveryPrice } from '@/lib/utils'
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
  Plus,
  Trash2,
  Upload,
  AlertCircle,
} from 'lucide-react'

const steps = [
  { id: 'service', title: 'Service Type', icon: Package },
  { id: 'addresses', title: 'Addresses', icon: MapPin },
  { id: 'details', title: 'Package Details', icon: FileText },
  { id: 'options', title: 'Options', icon: Shield },
  { id: 'review', title: 'Review & Pay', icon: Check },
]

const serviceTypes = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Small to medium packages',
    icon: Package,
    features: ['Up to 25kg', 'Same day delivery', 'Real-time tracking'],
  },
  {
    id: 'vip',
    name: 'VIP Express',
    description: '1-hour priority delivery',
    icon: Zap,
    features: ['Priority dispatch', '1-hour guarantee', 'Premium support'],
  },
  {
    id: 'large_freight',
    name: 'Large Freight',
    description: 'Heavy items & pallets',
    icon: Truck,
    features: ['Up to 500kg', 'Tailgate lift', 'Special handling'],
  },
  {
    id: 'recurring',
    name: 'Recurring',
    description: 'Scheduled regular deliveries',
    icon: Calendar,
    features: ['Daily/Weekly/Monthly', 'Fixed pricing', 'Auto-billing'],
  },
]

const serviceLevels = [
  { id: 'vip', name: 'VIP - 1 Hour', multiplier: 1.8, cutoff: '17:00' },
  { id: 'same_day', name: 'Same Day', multiplier: 1.2, cutoff: '12:00' },
  { id: 'standard', name: 'Standard - 3 Hours', multiplier: 1.0, cutoff: '18:00' },
]

export function BookingWizard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profile } = useAuthStore()
  const toast = useToast()
  
  const {
    bookingDraft,
    updateBookingDraft,
    resetBookingDraft,
    currentStep,
    setCurrentStep,
    isBatchMode,
    setBatchMode,
    batchDeliveries,
    addBatchDelivery,
    removeBatchDelivery,
    estimatedPrice,
    setEstimatedPrice,
  } = useDeliveryStore()

  const [isLoading, setIsLoading] = useState(false)

  // Check for batch mode from URL
  useEffect(() => {
    if (searchParams.get('mode') === 'batch') {
      setBatchMode(true)
    }
  }, [searchParams, setBatchMode])

  // Calculate price when inputs change
  useEffect(() => {
    if (bookingDraft.serviceType && bookingDraft.serviceLevel) {
      const level = serviceLevels.find(l => l.id === bookingDraft.serviceLevel)
      const price = calculateDeliveryPrice(15, 9.90, 1.80, level?.multiplier || 1)
      setEstimatedPrice(price)
    }
  }, [bookingDraft.serviceType, bookingDraft.serviceLevel, setEstimatedPrice])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Simulate booking creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Booking confirmed!', 'Your delivery has been scheduled.')
      resetBookingDraft()
      navigate('/deliveries')
    } catch (error) {
      toast.error('Booking failed', 'Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Select Service Type</h2>
                <p className="text-sm text-slate-500 mt-1">Choose the delivery service that fits your needs</p>
              </div>
              <Button
                variant={isBatchMode ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setBatchMode(!isBatchMode)}
              >
                {isBatchMode ? 'Single Delivery' : 'Batch Mode'}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {serviceTypes.map((service) => (
                <button
                  key={service.id}
                  onClick={() => updateBookingDraft({ serviceType: service.id as never })}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    bookingDraft.serviceType === service.id
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      bookingDraft.serviceType === service.id
                        ? 'bg-primary-100'
                        : 'bg-slate-100'
                    }`}>
                      <service.icon className={`h-6 w-6 ${
                        bookingDraft.serviceType === service.id
                          ? 'text-primary-600'
                          : 'text-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{service.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                      <ul className="mt-3 space-y-1">
                        {service.features.map((feature) => (
                          <li key={feature} className="text-xs text-slate-600 flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Service Level Selection */}
            {bookingDraft.serviceType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <h3 className="font-medium text-slate-900 mb-4">Delivery Speed</h3>
                <div className="grid grid-cols-3 gap-3">
                  {serviceLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => updateBookingDraft({ serviceLevel: level.id as never })}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        bookingDraft.serviceLevel === level.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-semibold text-slate-900">{level.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Book by {level.cutoff}</p>
                      {level.multiplier > 1 && (
                        <Badge variant="accent" size="sm" className="mt-2">
                          +{Math.round((level.multiplier - 1) * 100)}%
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Pickup & Delivery Addresses</h2>
              <p className="text-sm text-slate-500 mt-1">Enter the pickup and drop-off locations</p>
            </div>

            {/* Pickup Address */}
            <Card padding="md" className="border-2 border-dashed border-green-200 bg-green-50/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-medium text-slate-900">Pickup Location</h3>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Street address"
                  value={bookingDraft.pickupAddress?.street_address || ''}
                  onChange={(e) => updateBookingDraft({
                    pickupAddress: { ...bookingDraft.pickupAddress, street_address: e.target.value }
                  })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Suburb"
                    value={bookingDraft.pickupAddress?.suburb || ''}
                    onChange={(e) => updateBookingDraft({
                      pickupAddress: { ...bookingDraft.pickupAddress, suburb: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="Postcode"
                    value={bookingDraft.pickupAddress?.postcode || ''}
                    onChange={(e) => updateBookingDraft({
                      pickupAddress: { ...bookingDraft.pickupAddress, postcode: e.target.value }
                    })}
                  />
                </div>
                <Textarea
                  placeholder="Pickup notes (e.g., 'Ring doorbell', 'Leave at reception')"
                  rows={2}
                  value={bookingDraft.pickupNotes}
                  onChange={(e) => updateBookingDraft({ pickupNotes: e.target.value })}
                />
              </div>
            </Card>

            {/* Dropoff Address */}
            <Card padding="md" className="border-2 border-dashed border-red-200 bg-red-50/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="font-medium text-slate-900">Drop-off Location</h3>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Street address"
                  value={bookingDraft.dropoffAddress?.street_address || ''}
                  onChange={(e) => updateBookingDraft({
                    dropoffAddress: { ...bookingDraft.dropoffAddress, street_address: e.target.value }
                  })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Suburb"
                    value={bookingDraft.dropoffAddress?.suburb || ''}
                    onChange={(e) => updateBookingDraft({
                      dropoffAddress: { ...bookingDraft.dropoffAddress, suburb: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="Postcode"
                    value={bookingDraft.dropoffAddress?.postcode || ''}
                    onChange={(e) => updateBookingDraft({
                      dropoffAddress: { ...bookingDraft.dropoffAddress, postcode: e.target.value }
                    })}
                  />
                </div>
                <Textarea
                  placeholder="Drop-off notes (e.g., 'Authority to leave', 'Call on arrival')"
                  rows={2}
                  value={bookingDraft.dropoffNotes}
                  onChange={(e) => updateBookingDraft({ dropoffNotes: e.target.value })}
                />
              </div>
            </Card>

            {/* Batch Deliveries */}
            {isBatchMode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900">Additional Drop-offs</h3>
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => addBatchDelivery({
                      dropoffAddress: '',
                      recipientName: '',
                      recipientPhone: '',
                      notes: '',
                    })}
                  >
                    Add Drop-off
                  </Button>
                </div>
                {batchDeliveries.map((delivery, index) => (
                  <Card key={index} padding="sm" className="mb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <Input
                          placeholder="Drop-off address"
                          value={delivery.dropoffAddress}
                          inputSize="sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Recipient name"
                            value={delivery.recipientName}
                            inputSize="sm"
                          />
                          <Input
                            placeholder="Phone"
                            value={delivery.recipientPhone}
                            inputSize="sm"
                          />
                        </div>
                      </div>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => removeBatchDelivery(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Package Details</h2>
              <p className="text-sm text-slate-500 mt-1">Describe what you're sending</p>
            </div>

            <Textarea
              label="Package description"
              placeholder="e.g., Small cardboard box containing documents"
              value={bookingDraft.packageDescription}
              onChange={(e) => updateBookingDraft({ packageDescription: e.target.value })}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                placeholder="e.g., 5"
                value={bookingDraft.packageWeight || ''}
                onChange={(e) => updateBookingDraft({ packageWeight: parseFloat(e.target.value) || null })}
              />
              <Input
                label="Dimensions (optional)"
                placeholder="L x W x H cm"
              />
            </div>

            <Textarea
              label="Special instructions"
              placeholder="Any special handling requirements or instructions for the driver"
              value={bookingDraft.specialInstructions}
              onChange={(e) => updateBookingDraft({ specialInstructions: e.target.value })}
            />

            {/* Photo Upload for Pack & Delivery */}
            {bookingDraft.serviceType === 'pack_delivery' && (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <p className="font-medium text-slate-700">Upload item photo</p>
                <p className="text-sm text-slate-500 mt-1">Required for Pack & Delivery quotes</p>
                <Button variant="secondary" size="sm" className="mt-4">
                  Choose File
                </Button>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Delivery Options</h2>
              <p className="text-sm text-slate-500 mt-1">Customize your delivery experience</p>
            </div>

            {/* Proof of Delivery Options */}
            <Card padding="md">
              <h3 className="font-medium text-slate-900 mb-4">Proof of Delivery</h3>
              <div className="space-y-4">
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
                    checked={bookingDraft.requiresPhoto}
                    onChange={(e) => updateBookingDraft({ requiresPhoto: e.target.checked })}
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
                    checked={bookingDraft.requiresSignature}
                    onChange={(e) => updateBookingDraft({ requiresSignature: e.target.checked })}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </Card>

            {/* Freight Protection */}
            <Card padding="md" className={bookingDraft.freightProtection ? 'border-primary-200 bg-primary-50/30' : ''}>
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingDraft.freightProtection}
                  onChange={(e) => updateBookingDraft({ freightProtection: e.target.checked })}
                  className="mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary-600" />
                    <p className="font-medium text-slate-900">Freight Protection</p>
                    <Badge variant="primary" size="sm">Recommended</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Protect your package against loss or damage. Coverage up to the declared value.
                  </p>
                  {bookingDraft.freightProtection && (
                    <div className="mt-3">
                      <Input
                        label="Declared value"
                        placeholder="$0.00"
                        leftIcon={<span className="text-slate-400">$</span>}
                        inputSize="sm"
                        value={bookingDraft.freightValue || ''}
                        onChange={(e) => updateBookingDraft({ freightValue: parseFloat(e.target.value) || null })}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Protection fee: {formatCurrency((bookingDraft.freightValue || 0) * 0.02)} (2% of value)
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </Card>

            {/* Marketplace Option */}
            <Card padding="md">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingDraft.isMarketplace}
                  onChange={(e) => updateBookingDraft({ isMarketplace: e.target.checked })}
                  className="mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Post to Marketplace</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Let drivers bid on your delivery. You can suggest a price and choose the best offer.
                  </p>
                  {bookingDraft.isMarketplace && (
                    <div className="mt-3">
                      <Input
                        label="Your budget (suggested price)"
                        placeholder="$0.00"
                        leftIcon={<span className="text-slate-400">$</span>}
                        inputSize="sm"
                        value={bookingDraft.suggestedPrice || ''}
                        onChange={(e) => updateBookingDraft({ suggestedPrice: parseFloat(e.target.value) || null })}
                      />
                    </div>
                  )}
                </div>
              </label>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Review & Confirm</h2>
              <p className="text-sm text-slate-500 mt-1">Please review your booking details</p>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card padding="md">
                <h3 className="font-medium text-slate-900 mb-3">Pickup</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">
                      {bookingDraft.pickupAddress?.street_address || 'Not specified'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {bookingDraft.pickupAddress?.suburb} {bookingDraft.pickupAddress?.postcode}
                    </p>
                    {bookingDraft.pickupNotes && (
                      <p className="text-xs text-slate-400 mt-1">{bookingDraft.pickupNotes}</p>
                    )}
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <h3 className="font-medium text-slate-900 mb-3">Drop-off</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">
                      {bookingDraft.dropoffAddress?.street_address || 'Not specified'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {bookingDraft.dropoffAddress?.suburb} {bookingDraft.dropoffAddress?.postcode}
                    </p>
                    {bookingDraft.dropoffNotes && (
                      <p className="text-xs text-slate-400 mt-1">{bookingDraft.dropoffNotes}</p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Package Info */}
            <Card padding="md">
              <h3 className="font-medium text-slate-900 mb-3">Package</h3>
              <p className="text-sm text-slate-700">{bookingDraft.packageDescription || 'No description'}</p>
              {bookingDraft.packageWeight && (
                <p className="text-sm text-slate-500">Weight: {bookingDraft.packageWeight}kg</p>
              )}
            </Card>

            {/* Price Breakdown */}
            <Card padding="md" variant="gradient">
              <h3 className="font-medium text-slate-900 mb-4">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Driver Service Fee</span>
                  <span className="text-slate-900">{formatCurrency((estimatedPrice || 0) * 0.75)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Platform Fee</span>
                  <span className="text-slate-900">{formatCurrency((estimatedPrice || 0) * 0.15)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Booking Fee</span>
                  <span className="text-slate-900">{formatCurrency(2.50)}</span>
                </div>
                {bookingDraft.freightProtection && bookingDraft.freightValue && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Freight Protection</span>
                    <span className="text-slate-900">{formatCurrency(bookingDraft.freightValue * 0.02)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-slate-200 font-semibold">
                  <span className="text-slate-900">Total</span>
                  <span className="text-2xl text-primary-600">
                    {formatCurrency((estimatedPrice || 0) + 2.50 + (bookingDraft.freightProtection && bookingDraft.freightValue ? bookingDraft.freightValue * 0.02 : 0))}
                  </span>
                </div>
              </div>
            </Card>

            {/* Terms */}
            <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                By confirming this booking, you agree to our{' '}
                <a href="/terms" className="underline">Terms of Service</a> and understand that
                Zoom2u acts as a marketplace connecting you with independent drivers.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
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
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                      : 'bg-slate-200 text-slate-500'
                  }`}
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
                  className={`w-12 lg:w-24 h-1 mx-2 rounded-full transition-all ${
                    index < currentStep ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card padding="lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            {estimatedPrice && currentStep < 4 && (
              <span className="text-sm text-slate-500">
                Est. total: <span className="font-semibold text-slate-900">{formatCurrency(estimatedPrice)}</span>
              </span>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !bookingDraft.serviceType) ||
                  (currentStep === 1 && (!bookingDraft.pickupAddress?.street_address || !bookingDraft.dropoffAddress?.street_address))
                }
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
      </Card>
    </div>
  )
}

