import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Providers } from '@/shared/components/Providers'
import { Toaster } from '@/lib/toast'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <Providers>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '12px 16px',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </Providers>
    )
}
