'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Github, 
  Mail, 
  Lock,
  Loader2,
  ArrowRight,
  KeyRoundIcon
} from 'lucide-react'

interface LoginCardProps {}

export function LoginCard({}: LoginCardProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

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
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Sign in to continue to your dashboard
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
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
                    <KeyRoundIcon className="h-4 w-4 mr-2" />
                  )}
                  Google
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </motion.div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <AnimatePresence>
                {isEmailFocused && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-6 left-0 text-xs text-muted-foreground"
                  >
                    Email
                  </motion.span>
                )}
              </AnimatePresence>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <AnimatePresence>
                {isPasswordFocused && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-6 left-0 text-xs text-muted-foreground"
                  >
                    Password
                  </motion.span>
                )}
              </AnimatePresence>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
              </div>
            </motion.div>

            {/* Sign In Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button className="w-full group">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-sm"
            >
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Forgot password?
              </a>
              <span className="mx-2 text-muted-foreground">•</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Create account
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 