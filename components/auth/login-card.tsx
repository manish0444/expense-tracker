import { useState } from 'react'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'

interface LoginCardProps {}

export function LoginCard({}: LoginCardProps) {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 transform -skew-y-6 rounded-3xl blur-2xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/0 rounded-3xl" />

      {/* Card Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden"
      >
        {/* Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl opacity-50" />

        {/* Content */}
        <div className="relative text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Sign in to continue to your dashboard
          </p>
        </div>

        <div className="space-y-6">
          {/* Google Sign-In */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="w-full bg-white/5 border-white/10 hover:bg-white/10"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FcGoogle className="h-4 w-4 mr-2" />
              )}
              Continue with Google
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
