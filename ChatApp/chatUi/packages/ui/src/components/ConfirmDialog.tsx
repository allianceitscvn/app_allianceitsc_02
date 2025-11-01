'use client'

import { Button } from '@workspace/ui/components/Button'
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@workspace/ui/components/Dialog'
import { 
    Modal, 
    ModalOverlay, 
    Dialog as AriaDialog,
    composeRenderProps 
} from 'react-aria-components'
import { CircleXIcon, InfoIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { cn } from '@workspace/ui/lib/utils'

interface Action {
    label: React.ReactNode
    onClick: () => void | Promise<void>
}

interface ConfirmDialogData {
    /** The title displayed in the confirm dialog */
    title: string
    /** Optional description displayed in the confirm dialog */
    description?: string
    /** Optional action button configuration */
    action?: Action
    /** Optional cancel button configuration */
    cancel?: Action
    /** Optional variant for the action button */
    variant?: 'default' | 'destructive'
}

// Simple event emitter for confirm dialog
let confirmCallback: ((data: ConfirmDialogData) => void) | null = null

const confirm = (data: ConfirmDialogData) => {
    if (confirmCallback) {
        confirmCallback(data)
    }
}

function ConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<ConfirmDialogData | undefined>(undefined)
    const variant = data?.variant || 'default'
    
    useEffect(() => {
        confirmCallback = (dialogData: ConfirmDialogData) => {
            setData(dialogData)
            setIsOpen(true)
        }
        
        return () => {
            confirmCallback = null
        }
    }, [])

    const handleCancel = () => {
        const result = data?.cancel?.onClick?.()
        
        // Check if the result is a Promise
        if (result && typeof result.then === 'function') {
            result.finally(() => setIsOpen(false))
        } else {
            setIsOpen(false)
        }
    }

    const handleAction = () => {
        const result = data?.action?.onClick?.()
        
        // Check if the result is a Promise
        if (result && typeof result.then === 'function') {
            result
                .then(() => {
                    setIsOpen(false)
                })
                .catch((error: unknown) => {
                    console.error('Error in action onClick:', error)
                    setIsOpen(false)
                })
        } else {
            setIsOpen(false)
        }
    }

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => {
                // Only close if we're transitioning from open to closed
                if (!open && isOpen) {
                    setIsOpen(false)
                }
            }}
            isDismissable={true}
            className={composeRenderProps('', className =>
                cn(
                    'fixed inset-0 z-50 bg-black/70',
                    'data-[exiting]:animate-out data-[exiting]:fade-out-0',
                    'data-[entering]:animate-in data-[entering]:fade-in-0',
                    className,
                ),
            )}
        >
            <Modal
                className={composeRenderProps('', className =>
                    cn(
                        'fixed left-[50vw] top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
                        'bg-background p-5 shadow-2xl w-full max-w-[calc(100vw-40px)]',
                        'rounded-xl md:max-w-[425px] dark:border',
                        'data-[entering]:animate-in data-[exiting]:animate-out',
                        'data-[entering]:fade-in-0 data-[exiting]:fade-out-0',
                        'data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95',
                        className,
                    ),
                )}
            >
                <AriaDialog className="outline-none">
                    <div className="flex flex-col gap-4">
                        <DialogHeader>
                            <div className="mb-2">
                                {variant === 'default' && <InfoIcon className="size-6 text-blue-500 dark:text-blue-400" />}
                                {variant === 'destructive' && (
                                    <CircleXIcon className="size-6 text-destructive-foreground" />
                                )}
                            </div>
                            <DialogTitle>{data?.title || 'Confirm'}</DialogTitle>
                            <DialogDescription>
                                {data?.description || 'Are you sure you want to confirm?'}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                type="button"
                                onPress={handleCancel}
                            >
                                {data?.cancel?.label || 'Cancel'}
                            </Button>
                            <Button 
                                type="button"
                                onPress={handleAction}
                                variant={variant}
                            >
                                {data?.action?.label || 'Confirm'}
                            </Button>
                        </DialogFooter>
                    </div>
                </AriaDialog>
            </Modal>
        </ModalOverlay>
    )
}

export { confirm, ConfirmDialog }
