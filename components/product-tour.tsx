'use client'

import { useEffect, useState } from 'react'
import Shepherd from 'shepherd.js'

export function ProductTour() {
  const [tour, setTour] = useState<Shepherd.Tour | null>(null)

  useEffect(() => {
    const newTour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        classes: 'shadow-md bg-background',
        scrollTo: { behavior: 'smooth', block: 'center' }
      }
    })

    newTour.addStep({
      id: 'welcome',
      text: 'Welcome to ExpenseTracker! Let\'s take a quick tour of our key features.',
      attachTo: {
        element: '.hero-section',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Next',
          action: newTour.next
        }
      ]
    })

    newTour.addStep({
      id: 'expense-tracking',
      text: 'Easily log and categorize your expenses in real-time. Our intuitive interface makes expense tracking a breeze.',
      attachTo: {
        element: '#expense-tracking',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Back',
          action: newTour.back
        },
        {
          text: 'Next',
          action: newTour.next
        }
      ]
    })

    newTour.addStep({
      id: 'analytics',
      text: 'Get powerful insights with our advanced analytics. Visualize your spending patterns and make informed financial decisions.',
      attachTo: {
        element: '#analytics',
        on: 'top'
      },
      buttons: [
        {
          text: 'Back',
          action: newTour.back
        },
        {
          text: 'Next',
          action: newTour.next
        }
      ]
    })

    newTour.addStep({
      id: 'budgeting',
      text: 'Set and manage budgets to reach your financial goals. Our budgeting tools help you stay on track and avoid overspending.',
      attachTo: {
        element: '#budgeting',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Back',
          action: newTour.back
        },
        {
          text: 'Next',
          action: newTour.next
        }
      ]
    })

    newTour.addStep({
      id: 'reports',
      text: 'Generate detailed reports to get a comprehensive view of your finances. Export your data in various formats for further analysis.',
      attachTo: {
        element: '#reports',
        on: 'top'
      },
      buttons: [
        {
          text: 'Back',
          action: newTour.back
        },
        {
          text: 'Next',
          action: newTour.next
        }
      ]
    })

    newTour.addStep({
      id: 'cta',
      text: 'Ready to take control of your finances? Sign up now and start your journey to financial freedom!',
      attachTo: {
        element: '.cta-button',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Back',
          action: newTour.back
        },
        {
          text: 'Finish',
          action: newTour.complete
        }
      ]
    })

    setTour(newTour)

    return () => {
      newTour.complete()
    }
  }, [])

  const startTour = () => {
    if (tour) {
      tour.start()
    }
  }

  return (
    <button
      onClick={startTour}
      className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors text-lg font-semibold"
    >
      Take a Tour
    </button>
  )
}

