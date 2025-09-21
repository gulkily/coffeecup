const DATA_MODE = import.meta.env.VITE_DATA_MODE ?? 'mock'

export const useMocks = DATA_MODE !== 'live'
