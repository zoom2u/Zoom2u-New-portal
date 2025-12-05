import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, ArrowRight } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export function Login() {
  const navigate = useNavigate()
  const { setUser, setProfile, setTenant, setLoading } = useAuthStore()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      if (authData.user) {
        setUser(authData.user)
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*, tenants(*)')
          .eq('id', authData.user.id)
          .single()

        if (profile) {
          setProfile(profile)
          if (profile.tenants) {
            setTenant(profile.tenants as never)
          }
        }

        toast.success('Welcome back!', 'You have successfully logged in.')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error('Login failed', error instanceof Error ? error.message : 'Please check your credentials and try again.')
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl p-8"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          Zoom2u
        </h1>
        <p className="text-slate-500 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Create one now
          </Link>
        </p>
      </div>

      {/* Quick Quote CTA */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <Link
          to="/"
          className="block text-center text-sm text-slate-600 hover:text-slate-900"
        >
          Just need a quick quote? <span className="text-primary-600 font-medium">Get instant pricing →</span>
        </Link>
      </div>
    </motion.div>
  )
}

