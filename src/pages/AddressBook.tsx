import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/stores/uiStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Star,
  Building,
  Home,
  Briefcase,
  Phone,
  Mail,
  User,
  Check,
  X,
  Search,
  Loader2,
} from 'lucide-react'

interface Address {
  id: string
  label: string
  is_default: boolean
  street_address: string
  suburb: string
  state: string
  postcode: string
  country: string
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  pickup_notes: string | null
  delivery_notes: string | null
  created_at: string
}

const labelIcons: Record<string, typeof Home> = {
  Home: Home,
  Office: Building,
  Work: Briefcase,
  Warehouse: Building,
}

const emptyAddress = {
  label: '',
  street_address: '',
  suburb: '',
  state: '',
  postcode: '',
  country: 'Australia',
  contact_name: '',
  contact_phone: '',
  contact_email: '',
  pickup_notes: '',
  delivery_notes: '',
  is_default: false,
}

export function AddressBook() {
  const { user, profile } = useAuthStore()
  const toast = useToast()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState(emptyAddress)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch addresses
  useEffect(() => {
    fetchAddresses()
  }, [user])

  const fetchAddresses = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('z2u_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('label', { ascending: true })

      if (error) throw error
      setAddresses(data || [])
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Error', 'Failed to load addresses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address)
      setFormData({
        label: address.label,
        street_address: address.street_address,
        suburb: address.suburb,
        state: address.state,
        postcode: address.postcode,
        country: address.country,
        contact_name: address.contact_name || '',
        contact_phone: address.contact_phone || '',
        contact_email: address.contact_email || '',
        pickup_notes: address.pickup_notes || '',
        delivery_notes: address.delivery_notes || '',
        is_default: address.is_default,
      })
    } else {
      setEditingAddress(null)
      setFormData(emptyAddress)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAddress(null)
    setFormData(emptyAddress)
  }

  const handleSave = async () => {
    if (!user || !profile) return

    // Validation
    if (!formData.label || !formData.street_address || !formData.suburb || !formData.state || !formData.postcode) {
      toast.error('Missing Fields', 'Please fill in all required address fields')
      return
    }

    setIsSaving(true)
    try {
      // If setting as default, unset other defaults first
      if (formData.is_default) {
        await supabase
          .from('z2u_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
      }

      if (editingAddress) {
        // Update existing
        const { error } = await supabase
          .from('z2u_addresses')
          .update({
            label: formData.label,
            street_address: formData.street_address,
            suburb: formData.suburb,
            state: formData.state,
            postcode: formData.postcode,
            country: formData.country,
            contact_name: formData.contact_name || null,
            contact_phone: formData.contact_phone || null,
            contact_email: formData.contact_email || null,
            pickup_notes: formData.pickup_notes || null,
            delivery_notes: formData.delivery_notes || null,
            is_default: formData.is_default,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAddress.id)

        if (error) throw error
        toast.success('Updated', 'Address updated successfully')
      } else {
        // Create new
        const { error } = await supabase
          .from('z2u_addresses')
          .insert({
            user_id: user.id,
            tenant_id: profile.tenant_id,
            label: formData.label,
            street_address: formData.street_address,
            suburb: formData.suburb,
            state: formData.state,
            postcode: formData.postcode,
            country: formData.country,
            contact_name: formData.contact_name || null,
            contact_phone: formData.contact_phone || null,
            contact_email: formData.contact_email || null,
            pickup_notes: formData.pickup_notes || null,
            delivery_notes: formData.delivery_notes || null,
            is_default: formData.is_default,
          })

        if (error) throw error
        toast.success('Added', 'New address added successfully')
      }

      handleCloseModal()
      fetchAddresses()
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Error', 'Failed to save address')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('z2u_addresses')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast.success('Deleted', 'Address removed successfully')
      setDeleteConfirm(null)
      fetchAddresses()
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Error', 'Failed to delete address')
    }
  }

  const handleSetDefault = async (id: string) => {
    if (!user) return

    try {
      // Unset all defaults
      await supabase
        .from('z2u_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)

      // Set new default
      const { error } = await supabase
        .from('z2u_addresses')
        .update({ is_default: true })
        .eq('id', id)

      if (error) throw error
      
      toast.success('Updated', 'Default address updated')
      fetchAddresses()
    } catch (error) {
      console.error('Error setting default:', error)
      toast.error('Error', 'Failed to set default address')
    }
  }

  // Filter addresses
  const filteredAddresses = addresses.filter(addr => 
    addr.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    addr.street_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    addr.suburb.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const LabelIcon = (label: string) => labelIcons[label] || MapPin

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Address Book</h1>
          <p className="text-slate-500 mt-1">Manage your saved pickup and delivery locations</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Address
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search addresses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : filteredAddresses.length === 0 ? (
        <Card padding="lg" className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {searchQuery ? 'No addresses found' : 'No saved addresses'}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchQuery 
              ? 'Try a different search term' 
              : 'Add your frequently used addresses to speed up booking'}
          </p>
          {!searchQuery && (
            <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="h-4 w-4" />}>
              Add Your First Address
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredAddresses.map((address) => {
              const IconComponent = LabelIcon(address.label)
              return (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card 
                    padding="md" 
                    className={`relative group hover:shadow-md transition-shadow ${
                      address.is_default ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    {/* Default Badge */}
                    {address.is_default && (
                      <div className="absolute -top-2 -right-2">
                        <Badge variant="primary" size="sm" className="bg-primary-500">
                          <Star className="h-3 w-3 mr-1" /> Default
                        </Badge>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{address.label}</h3>
                        <p className="text-sm text-slate-500 truncate">{address.street_address}</p>
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="text-sm text-slate-600 mb-4">
                      <p>{address.suburb}, {address.state} {address.postcode}</p>
                    </div>

                    {/* Contact Info */}
                    {(address.contact_name || address.contact_phone) && (
                      <div className="text-xs text-slate-500 mb-4 space-y-1">
                        {address.contact_name && (
                          <p className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {address.contact_name}
                          </p>
                        )}
                        {address.contact_phone && (
                          <p className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {address.contact_phone}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      {!address.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          leftIcon={<Star className="h-3 w-3" />}
                        >
                          Set Default
                        </Button>
                      )}
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenModal(address)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {deleteConfirm === address.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="danger"
                            size="icon-sm"
                            onClick={() => handleDelete(address.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteConfirm(address.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Label Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Address Label</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {['Home', 'Office', 'Work', 'Warehouse'].map((label) => {
                const Icon = labelIcons[label] || MapPin
                return (
                  <button
                    key={label}
                    onClick={() => setFormData({ ...formData, label })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.label === label
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                )
              })}
            </div>
            <Input
              placeholder="Or enter custom label..."
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            />
          </div>

          {/* Address Fields */}
          <div className="space-y-4">
            <Input
              label="Street Address *"
              placeholder="123 Main Street"
              value={formData.street_address}
              onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Suburb *"
                placeholder="Sydney"
                value={formData.suburb}
                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
              />
              <Input
                label="State *"
                placeholder="NSW"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <Input
                label="Postcode *"
                placeholder="2000"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-medium text-slate-700 mb-4">Contact Details (Optional)</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Contact Name"
                placeholder="John Smith"
                leftIcon={<User className="h-4 w-4" />}
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              />
              <Input
                label="Mobile Number"
                type="tel"
                placeholder="0400 000 000"
                leftIcon={<Phone className="h-4 w-4" />}
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>
          </div>

          {/* Default Notes */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-medium text-slate-700 mb-4">Default Notes</h4>
            <div className="space-y-4">
              <Textarea
                label="Pickup Notes"
                placeholder="E.g., Ring doorbell, gate code 1234..."
                rows={2}
                value={formData.pickup_notes}
                onChange={(e) => setFormData({ ...formData, pickup_notes: e.target.value })}
              />
              <Textarea
                label="Delivery Notes"
                placeholder="E.g., Leave with reception, authority to leave..."
                rows={2}
                value={formData.delivery_notes}
                onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
              />
            </div>
          </div>

          {/* Default Toggle */}
          <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p className="font-medium text-slate-900">Set as default address</p>
              <p className="text-xs text-slate-500">This address will be pre-selected in bookings</p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editingAddress ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

