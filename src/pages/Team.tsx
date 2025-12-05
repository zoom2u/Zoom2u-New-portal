import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/stores/uiStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Shield,
  Check,
  X,
  Loader2,
  UserPlus,
  Crown,
  User,
  MoreVertical,
  Send,
} from 'lucide-react'

interface TeamMember {
  id: string
  email: string
  full_name: string
  phone: string | null
  role: string
  created_at: string
  last_sign_in?: string
  is_active: boolean
}

const roleOptions = [
  { value: 'customer', label: 'Team Member' },
  { value: 'admin', label: 'Admin' },
]

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  csa: 'Customer Service',
  senior_csa: 'Senior CSA',
  customer: 'Team Member',
  driver: 'Driver',
}

const roleBadgeVariants: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
  super_admin: 'primary',
  admin: 'warning',
  csa: 'secondary',
  senior_csa: 'secondary',
  customer: 'secondary',
}

// Mock team data - in production this would come from Supabase
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    email: 'steve@zoom2u.com',
    full_name: 'Steve Orenstein',
    phone: '0412 345 678',
    role: 'admin',
    created_at: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    is_active: true,
  },
  {
    id: '2',
    email: 'jane@zoom2u.com',
    full_name: 'Jane Smith',
    phone: '0498 765 432',
    role: 'customer',
    created_at: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
    is_active: true,
  },
]

export function Team() {
  const { user, profile } = useAuthStore()
  const toast = useToast()

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [isLoading, setIsLoading] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    full_name: '',
    role: 'customer',
  })

  const isOwner = profile?.role === 'admin' || profile?.role === 'super_admin'

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.full_name) {
      toast.error('Missing Fields', 'Please enter email and name')
      return
    }

    setIsSaving(true)
    try {
      // In production, this would:
      // 1. Create the user in Supabase Auth
      // 2. Create their profile linked to the same tenant
      // 3. Send an invitation email
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newMember: TeamMember = {
        id: Date.now().toString(),
        email: inviteForm.email,
        full_name: inviteForm.full_name,
        phone: null,
        role: inviteForm.role,
        created_at: new Date().toISOString(),
        is_active: false, // Pending invitation
      }
      
      setTeamMembers([...teamMembers, newMember])
      toast.success('Invitation Sent', `An invitation has been sent to ${inviteForm.email}`)
      setShowInviteModal(false)
      setInviteForm({ email: '', full_name: '', role: 'customer' })
    } catch (error) {
      toast.error('Error', 'Failed to send invitation')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      setTeamMembers(teamMembers.map(m => 
        m.id === memberId ? { ...m, role: newRole } : m
      ))
      toast.success('Updated', 'Team member role updated')
    } catch (error) {
      toast.error('Error', 'Failed to update role')
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      setTeamMembers(teamMembers.filter(m => m.id !== memberId))
      toast.success('Removed', 'Team member has been removed')
      setDeleteConfirm(null)
    } catch (error) {
      toast.error('Error', 'Failed to remove team member')
    }
  }

  const handleResendInvite = async (member: TeamMember) => {
    toast.success('Sent', `Invitation resent to ${member.email}`)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
          <p className="text-slate-500 mt-1">Manage who has access to your account</p>
        </div>
        {isOwner && (
          <Button
            onClick={() => setShowInviteModal(true)}
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Invite Team Member
          </Button>
        )}
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="md" className="text-center">
          <p className="text-3xl font-bold text-slate-900">{teamMembers.length}</p>
          <p className="text-sm text-slate-500">Total Members</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-3xl font-bold text-slate-900">
            {teamMembers.filter(m => m.role === 'admin' || m.role === 'super_admin').length}
          </p>
          <p className="text-sm text-slate-500">Admins</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-3xl font-bold text-slate-900">
            {teamMembers.filter(m => !m.is_active).length}
          </p>
          <p className="text-sm text-slate-500">Pending Invites</p>
        </Card>
      </div>

      {/* Team List */}
      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-medium text-slate-900">All Team Members</h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No team members yet</h3>
            <p className="text-slate-500 mb-6">Invite team members to collaborate</p>
            <Button onClick={() => setShowInviteModal(true)} leftIcon={<UserPlus className="h-4 w-4" />}>
              Invite First Member
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-medium text-slate-600">
                      {member.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 truncate">{member.full_name}</p>
                      {member.id === user?.id && (
                        <Badge variant="secondary" size="sm">You</Badge>
                      )}
                      {!member.is_active && (
                        <Badge variant="warning" size="sm">Pending</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{member.email}</p>
                  </div>

                  {/* Role */}
                  <div className="hidden md:block">
                    <Badge variant={roleBadgeVariants[member.role] || 'secondary'}>
                      {member.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                      {roleLabels[member.role] || member.role}
                    </Badge>
                  </div>

                  {/* Actions */}
                  {isOwner && member.id !== user?.id && (
                    <div className="flex items-center gap-2">
                      {!member.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResendInvite(member)}
                          leftIcon={<Send className="h-3 w-3" />}
                        >
                          Resend
                        </Button>
                      )}
                      
                      <Select
                        options={roleOptions}
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                        className="w-32"
                      />

                      {deleteConfirm === member.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="danger"
                            size="icon-sm"
                            onClick={() => handleRemoveMember(member.id)}
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
                          onClick={() => setDeleteConfirm(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Permissions Info */}
      <Card padding="md" className="bg-slate-50 border-slate-200">
        <h4 className="font-medium text-slate-900 mb-3">Role Permissions</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-slate-700 mb-2">Team Member</p>
            <ul className="space-y-1 text-slate-600">
              <li>• Create and manage own bookings</li>
              <li>• View delivery tracking</li>
              <li>• Access address book</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-2">Admin</p>
            <ul className="space-y-1 text-slate-600">
              <li>• All Team Member permissions</li>
              <li>• View all bookings in the account</li>
              <li>• Manage team members</li>
              <li>• Edit company settings</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-500">
            Send an invitation to join your team. They'll receive an email with instructions to set up their account.
          </p>

          <Input
            label="Full Name *"
            placeholder="John Smith"
            value={inviteForm.full_name}
            onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
            leftIcon={<User className="h-4 w-4" />}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="john@company.com"
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setInviteForm({ ...inviteForm, role: option.value })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    inviteForm.role === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {option.value === 'admin' ? (
                      <Crown className="h-4 w-4 text-amber-500" />
                    ) : (
                      <User className="h-4 w-4 text-slate-500" />
                    )}
                    <span className="font-medium text-slate-900">{option.label}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {option.value === 'admin' 
                      ? 'Full access to manage team and settings'
                      : 'Can create bookings and track deliveries'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} isLoading={isSaving} leftIcon={<Send className="h-4 w-4" />}>
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

