import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/stores/uiStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import {
  Plus,
  Edit2,
  Trash2,
  Megaphone,
  Check,
  X,
  Loader2,
  Info,
  AlertTriangle,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react'

interface PlatformUpdate {
  id: string
  title: string
  content: string
  type: 'info' | 'feature' | 'warning' | 'maintenance'
  is_active: boolean
  created_at: string
  updated_at: string
}

const updateTypeOptions = [
  { value: 'info', label: 'Information' },
  { value: 'feature', label: 'New Feature' },
  { value: 'warning', label: 'Warning' },
  { value: 'maintenance', label: 'Maintenance' },
]

const typeConfig = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Info' },
  feature: { icon: Sparkles, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', label: 'Feature' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Warning' },
  maintenance: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Maintenance' },
}

// Mock data - in production this would come from Supabase
const mockUpdates: PlatformUpdate[] = [
  {
    id: '1',
    title: 'Holiday Season Hours',
    content: 'Please note our operating hours will be adjusted during the holiday period from Dec 24 - Jan 2. Same-day cutoff will be moved to 10am.',
    type: 'info',
    is_active: true,
    created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
  {
    id: '2',
    title: 'New Service: White Glove Delivery',
    content: 'We now offer premium White Glove service including assembly, room placement and packaging removal. Available in all metro areas.',
    type: 'feature',
    is_active: true,
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'System Maintenance Completed',
    content: 'Scheduled maintenance has been completed. All services are now operating normally.',
    type: 'maintenance',
    is_active: false,
    created_at: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
  },
]

const emptyUpdate = {
  title: '',
  content: '',
  type: 'info' as const,
  is_active: true,
}

export function AdminUpdates() {
  const { profile } = useAuthStore()
  const toast = useToast()

  const [updates, setUpdates] = useState<PlatformUpdate[]>(mockUpdates)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<PlatformUpdate | null>(null)
  const [formData, setFormData] = useState(emptyUpdate)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleOpenModal = (update?: PlatformUpdate) => {
    if (update) {
      setEditingUpdate(update)
      setFormData({
        title: update.title,
        content: update.content,
        type: update.type,
        is_active: update.is_active,
      })
    } else {
      setEditingUpdate(null)
      setFormData(emptyUpdate)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUpdate(null)
    setFormData(emptyUpdate)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Missing Fields', 'Please enter a title and content')
      return
    }

    setIsSaving(true)
    try {
      // In production, this would save to Supabase
      await new Promise(resolve => setTimeout(resolve, 500))

      if (editingUpdate) {
        setUpdates(updates.map(u => 
          u.id === editingUpdate.id 
            ? { ...u, ...formData, updated_at: new Date().toISOString() }
            : u
        ))
        toast.success('Updated', 'Platform update saved successfully')
      } else {
        const newUpdate: PlatformUpdate = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setUpdates([newUpdate, ...updates])
        toast.success('Created', 'Platform update published successfully')
      }

      handleCloseModal()
    } catch (error) {
      toast.error('Error', 'Failed to save update')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setUpdates(updates.filter(u => u.id !== id))
      toast.success('Deleted', 'Platform update removed')
      setDeleteConfirm(null)
    } catch (error) {
      toast.error('Error', 'Failed to delete update')
    }
  }

  const handleToggleActive = async (update: PlatformUpdate) => {
    try {
      setUpdates(updates.map(u => 
        u.id === update.id ? { ...u, is_active: !u.is_active } : u
      ))
      toast.success('Updated', `Update ${update.is_active ? 'hidden' : 'published'}`)
    } catch (error) {
      toast.error('Error', 'Failed to update status')
    }
  }

  const activeUpdates = updates.filter(u => u.is_active)
  const inactiveUpdates = updates.filter(u => !u.is_active)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Updates</h1>
          <p className="text-slate-500 mt-1">Manage announcements shown to customers on their dashboard</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Update
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card padding="md" className="text-center">
          <p className="text-3xl font-bold text-green-600">{activeUpdates.length}</p>
          <p className="text-sm text-slate-500">Active Updates</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-3xl font-bold text-slate-400">{inactiveUpdates.length}</p>
          <p className="text-sm text-slate-500">Hidden Updates</p>
        </Card>
      </div>

      {/* Preview Note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>How it works:</strong> Active updates appear in the "Zoom2u Updates" section on customer dashboards. 
          Use this to communicate important information about the platform, new features, or service changes.
        </div>
      </div>

      {/* Active Updates */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Updates</h2>
        {activeUpdates.length === 0 ? (
          <Card padding="lg" className="text-center">
            <Megaphone className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No active updates</h3>
            <p className="text-slate-500 mb-6">Create an update to communicate with your customers</p>
            <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="h-4 w-4" />}>
              Create First Update
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeUpdates.map((update) => {
              const config = typeConfig[update.type]
              const TypeIcon = config.icon
              return (
                <Card key={update.id} padding="md" className={`${config.bg} ${config.border} border`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-white ${config.border} border`}>
                      <TypeIcon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{update.title}</h3>
                        <Badge variant="success" size="sm">
                          <Eye className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{update.content}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        Created {formatRelativeTime(update.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleToggleActive(update)}
                        title="Hide update"
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenModal(update)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {deleteConfirm === update.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="danger"
                            size="icon-sm"
                            onClick={() => handleDelete(update.id)}
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
                          onClick={() => setDeleteConfirm(update.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Hidden Updates */}
      {inactiveUpdates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Hidden Updates</h2>
          <Card padding="none">
            <div className="divide-y divide-slate-100">
              {inactiveUpdates.map((update) => {
                const config = typeConfig[update.type]
                const TypeIcon = config.icon
                return (
                  <div key={update.id} className="p-4 bg-slate-50">
                    <div className="flex items-start gap-4">
                      <TypeIcon className={`h-5 w-5 ${config.color} opacity-50`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-slate-500">{update.title}</h3>
                          <Badge variant="secondary" size="sm">Hidden</Badge>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">{update.content}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(update)}
                          leftIcon={<Eye className="h-3 w-3" />}
                        >
                          Show
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleOpenModal(update)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(update.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingUpdate ? 'Edit Update' : 'Create Platform Update'}
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Title *"
            placeholder="e.g., Holiday Operating Hours"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Textarea
            label="Content *"
            placeholder="Enter the message you want to display to customers..."
            rows={5}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Update Type</label>
            <div className="grid grid-cols-2 gap-3">
              {updateTypeOptions.map((option) => {
                const config = typeConfig[option.value as keyof typeof typeConfig]
                const TypeIcon = config.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, type: option.value as typeof formData.type })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.type === option.value
                        ? `${config.border} ${config.bg}`
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TypeIcon className={`h-4 w-4 ${config.color}`} />
                      <span className="font-medium text-slate-900">{option.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p className="font-medium text-slate-900">Publish immediately</p>
              <p className="text-xs text-slate-500">Show this update on customer dashboards right away</p>
            </div>
          </label>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Preview</label>
            <div className={`p-4 rounded-lg border ${typeConfig[formData.type].bg} ${typeConfig[formData.type].border}`}>
              <div className="flex items-start gap-3">
                {(() => {
                  const TypeIcon = typeConfig[formData.type].icon
                  return <TypeIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${typeConfig[formData.type].color}`} />
                })()}
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formData.title || 'Update Title'}
                  </p>
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">
                    {formData.content || 'Update content will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editingUpdate ? 'Save Changes' : 'Publish Update'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

