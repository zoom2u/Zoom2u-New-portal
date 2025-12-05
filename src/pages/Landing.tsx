import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import {
  MapPin,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Truck,
  Package,
  CheckCircle,
  Star,
} from 'lucide-react'

const serviceTypes = [
  { id: 'standard', name: 'Standard', time: '3 hours', multiplier: 1 },
  { id: 'same_day', name: 'Same Day', time: 'By 6pm', multiplier: 1.2 },
  { id: 'vip', name: 'VIP Express', time: '1 hour', multiplier: 1.8 },
]

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Same-day delivery across metro areas' },
  { icon: Shield, title: 'Fully Insured', desc: 'Optional freight protection up to $10,000' },
  { icon: Clock, title: 'Real-time Tracking', desc: 'Know exactly where your package is' },
  { icon: Truck, title: 'Any Size', desc: 'From documents to large freight' },
]

export function Landing() {
  const navigate = useNavigate()
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [selectedService, setSelectedService] = useState('standard')
  const [showQuote, setShowQuote] = useState(false)

  // Mock calculation
  const estimatedDistance = 15.5
  const baseFee = 9.90
  const kmRate = 1.80
  const service = serviceTypes.find(s => s.id === selectedService)!
  const estimatedPrice = baseFee + (estimatedDistance * kmRate * service.multiplier)

  const handleQuote = () => {
    if (pickup && dropoff) {
      setShowQuote(true)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="accent" size="lg" className="mb-6">
                🚀 Australia's #1 Delivery Platform
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Deliver
                <span style={{ color: '#00B4D8' }}>
                  {' '}anything,{' '}
                </span>
                anywhere
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-lg">
                Get instant quotes, track in real-time, and have your packages delivered 
                by our network of professional drivers.
              </p>

              {/* Stats */}
              <div className="flex gap-8 mb-8">
                <div>
                  <p className="text-3xl font-bold text-slate-900">2M+</p>
                  <p className="text-sm text-slate-500">Deliveries completed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">99.2%</p>
                  <p className="text-sm text-slate-500">On-time rate</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <p className="text-3xl font-bold text-slate-900">4.9</p>
                  <p className="text-sm text-slate-500 ml-1">Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Right column - Quick Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="elevated" padding="lg" className="relative">
                <div className="absolute -top-3 -right-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Instant Quote
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Get your delivery price
                </h2>

                <div className="space-y-4">
                  <Input
                    label="Pickup address"
                    placeholder="Enter pickup location"
                    leftIcon={<MapPin className="h-4 w-4 text-green-500" />}
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                  />

                  <Input
                    label="Drop-off address"
                    placeholder="Enter delivery location"
                    leftIcon={<MapPin className="h-4 w-4 text-red-500" />}
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                  />

                  {/* Service Level Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Delivery speed
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {serviceTypes.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedService === service.id
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <p className="font-semibold text-sm">{service.name}</p>
                          <p className="text-xs text-slate-500">{service.time}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    fullWidth
                    size="lg"
                    onClick={handleQuote}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Get Quote
                  </Button>

                  {/* Quote Result */}
                  {showQuote && pickup && dropoff && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-slate-600">Estimated price</span>
                        <span className="text-3xl font-bold text-slate-900">
                          {formatCurrency(estimatedPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                        <span>~{estimatedDistance} km • {service.name}</span>
                        <span>Delivered by {service.time}</span>
                      </div>
                      <Button
                        fullWidth
                        variant="accent"
                        onClick={() => navigate('/register')}
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                      >
                        Book Now
                      </Button>
                      <p className="text-xs text-center text-slate-500 mt-2">
                        No account needed for checkout
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why choose Zoom2u?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've built the most reliable and efficient delivery platform in Australia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover padding="lg" className="text-center h-full">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Delivery services for every need
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From same-day documents to large freight interstate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Package, name: 'Standard Delivery', desc: 'Small to medium packages delivered within 3 hours' },
              { icon: Zap, name: 'VIP Express', desc: '1-hour delivery for urgent items' },
              { icon: Truck, name: 'Large Freight', desc: 'Heavy items and pallets across Australia' },
            ].map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover padding="lg" className="h-full">
                  <service.icon className="h-10 w-10 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-slate-500 mb-4">{service.desc}</p>
                  <a href="/services" className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-white" style={{ backgroundColor: '#00B4D8' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and individuals who trust Zoom2u 
            for their delivery needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              variant="accent"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Create Free Account
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white border-2 text-white hover:bg-white hover:text-primary-600"
              onClick={() => navigate('/contact')}
            >
              Talk to Sales
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-primary-200">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> No setup fees
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> Pay per delivery
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <img 
                  src="/images/Zoom2u Logo - Classic.png" 
                  alt="Zoom2u" 
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-slate-400 text-sm">
                Australia's leading delivery marketplace connecting customers 
                with professional drivers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/services/standard" className="hover:text-white">Standard Delivery</a></li>
                <li><a href="/services/vip" className="hover:text-white">VIP Express</a></li>
                <li><a href="/services/freight" className="hover:text-white">Large Freight</a></li>
                <li><a href="/services/interstate" className="hover:text-white">Interstate</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/careers" className="hover:text-white">Careers</a></li>
                <li><a href="/press" className="hover:text-white">Press</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/help" className="hover:text-white">Help Center</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/track" className="hover:text-white">Track Delivery</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Zoom2u. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

