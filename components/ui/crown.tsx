'use client'

import { cn } from "@/lib/utils"

interface CrownProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function Crown({ className, ...props }: CrownProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path
        d="M2.5 7.25L5 16.25H19L21.5 7.25L16.5 11L12 5L7.5 11L2.5 7.25Z"
        className="animate-shimmer"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 16.25H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
} 