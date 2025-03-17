
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      if (!isInitialized) setIsInitialized(true)
    }
    
    mql.addEventListener("change", onChange)
    
    // Initial check
    onChange()
    
    return () => mql.removeEventListener("change", onChange)
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
  const { isMobile } = useIsMobile()
  return isMobile
}
