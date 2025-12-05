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
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Star,
  Check,
  X,
  Loader2,
  FileText,
  DollarSign,
  Package,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

interface ContainerType {
  id: string
  name: string
  description: string | null
  capacity: string | null
  price: number
  is_popular: boolean
  is_active: boolean
  sort_order: number
}

const emptyContainer = {
  name: '',
  description: '',
  capacity: '',
  price: '',
  is_popular: false,
  is_active: true,
}

export function AdminShredServices() {
  const { profile } = useAuthStore()
  const toast = useToast()

  const [containers, setContainers] = useState<ContainerType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingContainer, setEditingContainer] = useState<ContainerType | null>(null)
  const [formData, setFormData] = useState(emptyContainer)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchContainers()
  }, [profile])

  const fetchContainers = async () => {
    if (!profile?.tenant_id) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('z2u_shred_container_types')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setContainers(data || [])
    } catch (error) {
      console.error('Error fetching containers:', error)
      toast.error('Error', 'Failed to load container types')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (container?: ContainerType) => {
    if (container) {
      setEditingContainer(container)
      setFormData({
        name: container.name,
        description: container.description || '',
        capacity: container.capacity || '',
        price: container.price.toString(),
        is_popular: container.is_popular,
        is_active: container.is_active,
      })
    } else {
      setEditingContainer(null)
      setFormData(emptyContainer)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingContainer(null)
    setFormData(emptyContainer)
  }

  const handleSave = async () => {
    if (!profile?.tenant_id) return

    if (!formData.name || !formData.price) {
      toast.error('Missing Fields', 'Name and price are required')
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price < 0) {
      toast.error('Invalid Price', 'Please enter a valid price')
      return
    }

    setIsSaving(true)
    try {
      if (editingContainer) {
        const { error } = await supabase
          .from('z2u_shred_container_types')
          .update({
            name: formData.name,
            description: formData.description || null,
            capacity: formData.capacity || null,
            price: price,
            is_popular: formData.is_popular,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingContainer.id)

        if (error) throw error
        toast.success('Updated', 'Container type updated successfully')
      } else {
        const maxOrder = containers.length > 0 
          ? Math.max(...containers.map(c => c.sort_order)) + 1 
          : 1

        const { error } = await supabase
          .from('z2u_shred_container_types')
          .insert({
            tenant_id: profile.tenant_id,
            name: formData.name,
            description: formData.description || null,
            capacity: formData.capacity || null,
            price: price,
            is_popular: formData.is_popular,
            is_active: formData.is_active,
            sort_order: maxOrder,
          })

        if (error) throw error
        toast.success('Added', 'New container type added successfully')
      }

      handleCloseModal()
      fetchContainers()
    } catch (error) {
      console.error('Error saving container:', error)
      toast.error('Error', 'Failed to save container type')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('z2u_shred_container_types')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast.success('Deleted', 'Container type removed')
      setDeleteConfirm(null)
      fetchContainers()
    } catch (error) {
      console.error('Error deleting container:', error)
      toast.error('Error', 'Failed to delete container type')
    }
  }

  const toggleActive = async (container: ContainerType) => {
    try {
      const { error } = await supabase
        .from('z2u_shred_container_types')
        .update({ is_active: !container.is_active })
        .eq('id', container.id)

      if (error) throw error
      fetchContainers()
    } catch (error) {
      console.error('Error toggling active:', error)
      toast.error('Error', 'Failed to update status')
    }
  }

  const togglePopular = async (container: ContainerType) => {
    try {
      const { error } = await supabase
        .from('z2u_shred_container_types')
        .update({ is_popular: !container.is_popular })
        .eq('id', container.id)

      if (error) throw error
      fetchContainers()
    } catch (error) {
      console.error('Error toggling popular:', error)
      toast.error('Error', 'Failed to update status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Destruction Services</h1>
          <p className="text-slate-500 mt-1">Manage container types available for shredding orders</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Container Type
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : containers.length === 0 ? (
        <Card padding="lg" className="text-center">
          <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No container types</h3>
          <p className="text-slate-500 mb-6">Add container types for your document destruction service</p>
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="h-4 w-4" />}>
            Add First Container Type
          </Button>
        </Card>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-slate-100">
            {containers.map((container, index) => (
              <motion.div
                key={container.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 ${!container.is_active ? 'bg-slate-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div className="text-slate-300 cursor-grab">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Container Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${container.is_active ? 'text-slate-900' : 'text-slate-500'}`}>
                        {container.name}
                      </h3>
                      {container.is_popular && (
                        <Badge variant="warning" size="sm">
                          <Star className="h-3 w-3 mr-1" /> Popular
                        </Badge>
                      )}
                      {!container.is_active && (
                        <Badge variant="secondary" size="sm">Inactive</Badge>
                      )}
                    </div>
                    {container.description && (
                      <p className="text-sm text-slate-500 mt-1">{container.description}</p>
                    )}
                    {container.capacity && (
                      <p className="text-xs text-slate-400 mt-1">Capacity: {container.capacity}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-900">
                      ${container.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Toggle Popular */}
                  <button
                    onClick={() => togglePopular(container)}
                    className={`p-2 rounded-lg transition-colors ${
                      container.is_popular 
                        ? 'text-amber-500 hover:bg-amber-50' 
                        : 'text-slate-300 hover:bg-slate-100'
                    }`}
                    title={container.is_popular ? 'Remove popular tag' : 'Mark as popular'}
                  >
                    <Star className="h-5 w-5" fill={container.is_popular ? 'currentColor' : 'none'} />
                  </button>

                  {/* Toggle Active */}
                  <button
                    onClick={() => toggleActive(container)}
                    className={`p-2 rounded-lg transition-colors ${
                      container.is_active 
                        ? 'text-green-500 hover:bg-green-50' 
                        : 'text-slate-300 hover:bg-slate-100'
                    }`}
                    title={container.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {container.is_active ? (
                      <ToggleRight className="h-5 w-5" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </button>

                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleOpenModal(container)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  {/* Delete */}
                  {deleteConfirm === container.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="danger"
                        size="icon-sm"
                        onClick={() => handleDelete(container.id)}
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
                      onClick={() => setDeleteConfirm(container.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingContainer ? 'Edit Container Type' : 'Add Container Type'}
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Name *"
            placeholder="e.g., Shred Bag"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Textarea
            label="Description"
            placeholder="Brief description of this container type..."
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input
            label="Capacity"
            placeholder="e.g., 16kg / 45L"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          />

          <Input
            label="Price (AUD) *"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            leftIcon={<DollarSign className="h-4 w-4" />}
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg cursor-pointer border border-amber-200">
              <input
                type="checkbox"
                checked={formData.is_popular}
                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <p className="font-medium text-slate-900">Mark as Popular</p>
                <p className="text-xs text-slate-500">Highlight this option for customers</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-slate-300 text-green-600 focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-slate-900">Active</p>
                <p className="text-xs text-slate-500">Show this option to customers</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editingContainer ? 'Save Changes' : 'Add Container Type'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

