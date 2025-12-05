import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, Building2, Phone, ArrowRight, CheckCircle } from 'lucide-react'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  companyName: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export function Register() {
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [email, setEmail] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            company_name: data.companyName,
          },
        },
      })

      if (error) throw error

      setEmail(data.email)
      setStep('verify')
      toast.success('Account created!', 'Please check your email to verify your account.')
    } catch (error) {
      toast.error('Registration failed', error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'verify') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
        <p className="text-slate-500 mb-6">
          We've sent a verification link to <strong className="text-slate-700">{email}</strong>
        </p>
        <p className="text-sm text-slate-500 mb-6">
          Click the link in the email to verify your account and complete the registration process.
        </p>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl p-8"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img 
            src="/images/Zoom2u Logo - Classic.png" 
            alt="Zoom2u" 
            className="h-12 w-auto"
          />
        </div>
        <p className="text-slate-500">Create your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="John Smith"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone number"
          type="tel"
          placeholder="0400 000 000"
          leftIcon={<Phone className="h-4 w-4" />}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Company name (optional)"
          type="text"
          placeholder="Your Company Pty Ltd"
          leftIcon={<Building2 className="h-4 w-4" />}
          error={errors.companyName?.message}
          {...register('companyName')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            className="mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            {...register('acceptTerms')}
          />
          <span>
            I agree to the{' '}
            <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-xs text-error-500">{errors.acceptTerms.message}</p>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

