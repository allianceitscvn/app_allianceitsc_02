import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    beforeLoad: () => {
        // Redirect to login page
        throw redirect({ to: '/login' })
    },
})
