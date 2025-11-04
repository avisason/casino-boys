'use client'

import { useState, useRef } from 'react'
import { Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Mail, Loader2, Save, LogOut, Camera, Upload } from 'lucide-react'
import Image from 'next/image'

interface SettingsFormProps {
  profile: Profile | null
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
      alert('Profile picture updated successfully!')
      router.refresh()
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      alert(error.message || 'Failed to upload profile picture')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB')
      return
    }

    await uploadAvatar(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name || null,
        })
        .eq('id', user.id)

      if (error) throw error

      alert('Profile updated successfully!')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      alert(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
          Profile Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 halloween:from-orange-600 halloween:to-orange-800 flex items-center justify-center">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 halloween:bg-orange-900/30 text-purple-600 dark:text-purple-400 halloween:text-orange-400 rounded-lg font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 halloween:hover:bg-orange-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-500 mt-2">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 halloween:placeholder:text-orange-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 halloween:border-orange-800">
              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 halloween:text-orange-400" />
              <span className="text-gray-700 dark:text-gray-300 halloween:text-orange-300">{profile?.email}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-500 mt-2">
              Email address cannot be changed
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 halloween:from-orange-600 halloween:to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 halloween:hover:from-orange-700 halloween:hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4">Account Actions</h2>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/30 halloween:bg-red-900/50 text-red-600 dark:text-red-400 halloween:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 halloween:hover:bg-red-900/70 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4">About</h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 halloween:text-orange-300">
          <p><strong className="dark:text-white halloween:text-orange-300">Casino Boys</strong> - Version 1.0.0</p>
          <p>Track your casino adventures with friends!</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 halloween:text-orange-500 mt-4">
            Built with Next.js, TypeScript, and Supabase
          </p>
        </div>
      </div>
    </div>
  )
}

