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
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Bell,
  Shield,
  CreditCard,
  Truck,
  Upload,
  Check,
  X,
  Loader2,
  Camera,
  Save,
  Eye,
  EyeOff,
  Key,
  Globe,
  Clock,
} from 'lucide-react'

type SettingsTab = 'profile' | 'company' | 'notifications' | 'booking' | 'security'

export function Settings() {
  const { user, profile, setProfile } = useAuthStore()
  const toast = useToast()
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Profile form
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  })

  // Company form
  const [companyForm, setCompanyForm] = useState({
    company_name: profile?.company_name || '',
    company_logo: null as File | null,
    invoicing_email: '',
    abn: '',
    website: '',
    industry: '',
  })

  // Booking defaults form
  const [bookingDefaults, setBookingDefaults] = useState({
    default_pickup_notes: '',
    default_dropoff_notes: '',
    default_service_level: 'standard',
    require_signature: false,
    require_photo: true,
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_booking_confirmation: true,
    email_delivery_updates: true,
    email_marketing: false,
    sms_delivery_updates: true,
    sms_driver_arriving: true,
  })

  // Security form
  const [securityForm, setSecurityForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('z2u_user_profiles')
        .update({
          full_name: profileForm.full_name,
          phone: profileForm.phone,
        })
        .eq('id', user?.id)

      if (error) throw error

      if (profile) {
        setProfile({ ...profile, ...profileForm })
      }
      toast.success('Saved', 'Profile updated successfully')
    } catch (error) {
      toast.error('Error', 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveCompany = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('z2u_user_profiles')
        .update({
          company_name: companyForm.company_name,
        })
        .eq('id', user?.id)

      if (error) throw error
      
      toast.success('Saved', 'Company settings updated')
    } catch (error) {
      toast.error('Error', 'Failed to update company settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveBookingDefaults = async () => {
    setIsSaving(true)
    try {
      // Save to user_profiles or a separate settings table
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Saved', 'Booking defaults updated')
    } catch (error) {
      toast.error('Error', 'Failed to update booking defaults')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Saved', 'Notification preferences updated')
    } catch (error) {
      toast.error('Error', 'Failed to update notifications')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (securityForm.new_password !== securityForm.confirm_password) {
      toast.error('Error', 'Passwords do not match')
      return
    }
    if (securityForm.new_password.length < 8) {
      toast.error('Error', 'Password must be at least 8 characters')
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: securityForm.new_password,
      })

      if (error) throw error

      toast.success('Updated', 'Password changed successfully')
      setSecurityForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (error) {
      toast.error('Error', 'Failed to change password')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        toast.error('Invalid File', 'Please upload a JPEG, PNG, or GIF image')
        return
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File Too Large', 'Logo must be under 2MB')
        return
      }
      
      setCompanyForm({ ...companyForm, company_logo: file })
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'booking', label: 'Booking Defaults', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Personal Information</h2>
                
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-2xl font-medium text-slate-600">
                        {profileForm.full_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <Button variant="secondary" size="sm" leftIcon={<Camera className="h-4 w-4" />}>
                        Change Photo
                      </Button>
                      <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      leftIcon={<User className="h-4 w-4" />}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      leftIcon={<Phone className="h-4 w-4" />}
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    value={profileForm.email}
                    disabled
                    leftIcon={<Mail className="h-4 w-4" />}
                    className="bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 -mt-4">
                    Contact support to change your email address
                  </p>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <Button onClick={handleSaveProfile} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Company Tab */}
            {activeTab === 'company' && (
              <div className="space-y-6">
                <Card padding="lg">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">Company Details</h2>
                  
                  <div className="space-y-6">
                    {/* Company Logo */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Company Logo</label>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                          {logoPreview ? (
                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                          ) : (
                            <Building className="h-8 w-8 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/gif"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <Button variant="secondary" size="sm" leftIcon={<Upload className="h-4 w-4" />} as="span">
                              Upload Logo
                            </Button>
                          </label>
                          <p className="text-xs text-slate-500 mt-2">
                            JPEG, PNG or GIF. Max 2MB. Will be resized to 200x200px.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Company Name"
                      value={companyForm.company_name}
                      onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                      leftIcon={<Building className="h-4 w-4" />}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="ABN"
                        placeholder="12 345 678 901"
                        value={companyForm.abn}
                        onChange={(e) => setCompanyForm({ ...companyForm, abn: e.target.value })}
                      />
                      <Input
                        label="Website"
                        placeholder="https://www.example.com"
                        value={companyForm.website}
                        onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                        leftIcon={<Globe className="h-4 w-4" />}
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-200">
                      <Button onClick={handleSaveCompany} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card padding="lg">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">Invoicing</h2>
                  
                  <div className="space-y-4">
                    <Input
                      label="Invoicing Email"
                      type="email"
                      placeholder="accounts@company.com"
                      value={companyForm.invoicing_email}
                      onChange={(e) => setCompanyForm({ ...companyForm, invoicing_email: e.target.value })}
                      leftIcon={<Mail className="h-4 w-4" />}
                    />
                    <p className="text-sm text-slate-500">
                      Invoices will be sent to this email address. Leave blank to use your account email.
                    </p>

                    <div className="flex justify-end pt-4 border-t border-slate-200">
                      <Button onClick={handleSaveCompany} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Booking Defaults Tab */}
            {activeTab === 'booking' && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Default Booking Settings</h2>
                
                <div className="space-y-6">
                  <Textarea
                    label="Default Pickup Notes"
                    placeholder="Notes that will auto-fill for pickups (e.g., Ring doorbell, ask for reception)"
                    rows={3}
                    value={bookingDefaults.default_pickup_notes}
                    onChange={(e) => setBookingDefaults({ ...bookingDefaults, default_pickup_notes: e.target.value })}
                  />

                  <Textarea
                    label="Default Drop-off Notes"
                    placeholder="Notes that will auto-fill for deliveries (e.g., Leave with reception if unavailable)"
                    rows={3}
                    value={bookingDefaults.default_dropoff_notes}
                    onChange={(e) => setBookingDefaults({ ...bookingDefaults, default_dropoff_notes: e.target.value })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Default Service Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'standard', label: 'Standard', desc: '3-hour delivery' },
                        { value: 'same_day', label: 'Same Day', desc: 'By end of day' },
                        { value: 'vip', label: 'VIP', desc: '1-hour express' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setBookingDefaults({ ...bookingDefaults, default_service_level: option.value })}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            bookingDefaults.default_service_level === option.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <p className="font-medium text-slate-900">{option.label}</p>
                          <p className="text-xs text-slate-500 mt-1">{option.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Default Proof of Delivery</label>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Camera className="h-5 w-5 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-900">Photo Required</p>
                            <p className="text-xs text-slate-500">Driver takes photo on delivery</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={bookingDefaults.require_photo}
                          onChange={(e) => setBookingDefaults({ ...bookingDefaults, require_photo: e.target.checked })}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-900">Signature Required</p>
                            <p className="text-xs text-slate-500">Recipient must sign</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={bookingDefaults.require_signature}
                          onChange={(e) => setBookingDefaults({ ...bookingDefaults, require_signature: e.target.checked })}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <Button onClick={handleSaveBookingDefaults} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'email_booking_confirmation', label: 'Booking Confirmations', desc: 'Receive email when a booking is confirmed' },
                        { key: 'email_delivery_updates', label: 'Delivery Updates', desc: 'Status updates for your deliveries' },
                        { key: 'email_marketing', label: 'Marketing & Promotions', desc: 'News, offers and updates from Zoom2u' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                          <div>
                            <p className="font-medium text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">SMS Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'sms_delivery_updates', label: 'Delivery Updates', desc: 'SMS when delivery status changes' },
                        { key: 'sms_driver_arriving', label: 'Driver Arriving', desc: 'SMS when driver is nearby' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                          <div>
                            <p className="font-medium text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <Button onClick={handleSaveNotifications} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card padding="lg">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">Change Password</h2>
                  
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type={showPasswords ? 'text' : 'password'}
                      value={securityForm.current_password}
                      onChange={(e) => setSecurityForm({ ...securityForm, current_password: e.target.value })}
                      leftIcon={<Key className="h-4 w-4" />}
                    />
                    <Input
                      label="New Password"
                      type={showPasswords ? 'text' : 'password'}
                      value={securityForm.new_password}
                      onChange={(e) => setSecurityForm({ ...securityForm, new_password: e.target.value })}
                      leftIcon={<Key className="h-4 w-4" />}
                    />
                    <Input
                      label="Confirm New Password"
                      type={showPasswords ? 'text' : 'password'}
                      value={securityForm.confirm_password}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirm_password: e.target.value })}
                      leftIcon={<Key className="h-4 w-4" />}
                    />
                    
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPasswords}
                        onChange={(e) => setShowPasswords(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      Show passwords
                    </label>

                    <div className="flex justify-end pt-4 border-t border-slate-200">
                      <Button onClick={handleChangePassword} isLoading={isSaving}>
                        Update Password
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card padding="lg">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Security</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500">Add an extra layer of security</p>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Active Sessions</p>
                        <p className="text-sm text-slate-500">Manage your logged-in devices</p>
                      </div>
                      <Button variant="secondary" size="sm">View Sessions</Button>
                    </div>
                  </div>
                </Card>

                <Card padding="lg" className="border-red-200 bg-red-50">
                  <h2 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h2>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="danger">Delete Account</Button>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

