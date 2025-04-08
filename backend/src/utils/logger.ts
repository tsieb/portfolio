/**
 * Custom logger utility
 * Provides standardized logging with timestamps and level indicators
 */
export const logger = {
    info: (message: string, meta?: any) => {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ? meta : '');
    },
    
    error: (message: string, error?: any) => {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error ? error : '');
    },
    
    warn: (message: string, meta?: any) => {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ? meta : '');
    },
    
    debug: (message: string, meta?: any) => {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta ? meta : '');
      }
    },
  };