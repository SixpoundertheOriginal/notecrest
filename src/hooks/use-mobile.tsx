
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      if (!isInitialized) setIsInitialized(true)
    }
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern event listener
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener("change", checkMobile)
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', checkMobile)
    }
    
    // Initial check
    checkMobile()
    
    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener("change", checkMobile)
      } else {
        window.removeEventListener('resize', checkMobile)
      }
    }
  }, [isInitialized])

  // Return both the mobile state and whether we've initialized
  // This helps prevent flash of content on initial load
  return {
    isMobile,
    isInitialized
  }
}

// Add a simpler version that just returns the boolean for components 
// that don't need the initialization status
export function useIsMobileValue() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Set up event listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
