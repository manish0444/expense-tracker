'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

interface TourStep {
  target: string
  title: string
  content: string
  placement: 'top' | 'right' | 'bottom' | 'left'
}

const tourSteps: TourStep[] = [
  {
    target: '#features',
    title: 'Smart Features',
    content: 'Explore our AI-powered features that help you manage expenses better.',
    placement: 'bottom'
  },
  {
    target: '#analytics',
    title: 'Advanced Analytics',
    content: 'Get detailed insights into your spending patterns.',
    placement: 'left'
  },
  {
    target: '#budget',
    title: 'Budget Tracking',
    content: 'Set and monitor your budgets with real-time alerts.',
    placement: 'right'
  }
]

export function ProductTour() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour')
    if (!hasSeenTour) {
      setIsVisible(true)
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      const target = document.querySelector(tourSteps[currentStep].target)
      if (target) {
        const rect = target.getBoundingClientRect()
        const { placement } = tourSteps[currentStep]
        
        let top = rect.top + window.scrollY
        let left = rect.left

        switch (placement) {
          case 'top':
            top -= 120
            left += rect.width / 2 - 150
            break
          case 'right':
            top += rect.height / 2 - 60
            left += rect.width + 20
            break
          case 'bottom':
            top += rect.height + 20
            left += rect.width / 2 - 150
            break
          case 'left':
            top += rect.height / 2 - 60
            left -= 320
            break
        }

        setPosition({ top, left })
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentStep, isVisible])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('hasSeenTour', 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Tour Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              top: position.top,
              left: position.left 
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 w-[300px] bg-background rounded-lg shadow-lg border"
            style={{ top: position.top, left: position.left }}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                {tourSteps[currentStep].title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {tourSteps[currentStep].content}
              </p>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentStep + 1} / {tourSteps.length}
                </span>
                <Button
                  size="sm"
                  onClick={handleNext}
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Arrow */}
            <div
              className={`absolute w-4 h-4 bg-background border transform rotate-45 ${
                tourSteps[currentStep].placement === 'top' ? 'bottom-[-8px] left-1/2 -translate-x-1/2 border-b border-r' :
                tourSteps[currentStep].placement === 'right' ? 'left-[-8px] top-1/2 -translate-y-1/2 border-l border-b' :
                tourSteps[currentStep].placement === 'bottom' ? 'top-[-8px] left-1/2 -translate-x-1/2 border-t border-l' :
                'right-[-8px] top-1/2 -translate-y-1/2 border-t border-r'
              }`}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

