'use client'

import { Button } from '@/components/ui/button'
import { Booking } from '@/types/interfaces'
import { cn } from '@/utils/utils'
import { CircleCheckBig } from 'lucide-react'
import { useState } from 'react'

import BookingDetailsDialog from './Booking-Details-Dialog'

interface TableProps {
    seats: number
    shape?: 'round' | 'oval'
    className?: string
    booking?: Booking
    size?: 'small' | 'medium' | 'large'
}

function Table({ seats, shape = 'round', size = 'medium', className, booking }: TableProps) {
    const [isHovered, setIsHovered] = useState(false)

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-emerald-50 border-emerald-300'
            case 'finished':
                return 'bg-blue-50 border-blue-300'
            case 'canceled':
                return 'bg-rose-50 border-rose-300'
            default:
                return 'bg-gray-100 border-gray-300'
        }
    }

    const getStatusTextColor = (status?: string) => {
        switch (status) {
            case 'confirmed':
                return 'text-emerald-700'
            case 'finished':
                return 'text-blue-700'
            case 'canceled':
                return 'text-rose-700'
            default:
                return 'text-gray-700'
        }
    }

    const tableShape = booking?.amount_of_people
        ? booking.amount_of_people > 4
            ? 'oval'
            : 'round'
        : shape

    const getTableDimensions = () => {
        const baseSize = size === 'small' ? 100 : size === 'medium' ? 140 : 180

        if (tableShape === 'round') {
            return {
                width: baseSize,
                height: baseSize,
            }
        } else {
            return {
                width: baseSize * 1.5,
                height: baseSize,
            }
        }
    }

    const { width, height } = getTableDimensions()

    const getChairPositions = () => {
        const positions = []
        const tableWidth = width
        const tableHeight = height
        const chairCount = booking?.amount_of_people || seats

        if (tableShape === 'round') {
            for (let i = 0; i < seats; i++) {
                const angle = (i / chairCount) * 2 * Math.PI
                const chairDistance = Math.min(tableWidth, tableHeight) / 1.6

                positions.push({
                    left: tableWidth / 2 + chairDistance * Math.cos(angle),
                    top: tableHeight / 2 + chairDistance * Math.sin(angle),
                    rotation: (angle * 180) / Math.PI + 90,
                })
            }
        } else {
            const longSideChairs = Math.ceil(chairCount * 0.7)
            const shortSideChairs = seats - longSideChairs

            const longSideChairsPerSide = Math.floor(longSideChairs / 2)

            const shortSideChairsPerSide = Math.floor(shortSideChairs / 2)

            for (let i = 0; i < longSideChairsPerSide; i++) {
                const ratio = (i + 1) / (longSideChairsPerSide + 1)
                positions.push({
                    left: 0,
                    top: tableHeight * ratio,
                    rotation: 270,
                })
            }

            // Add chairs to the right side
            for (let i = 0; i < longSideChairsPerSide; i++) {
                const ratio = (i + 1) / (longSideChairsPerSide + 1)
                positions.push({
                    left: tableWidth,
                    top: tableHeight * ratio,
                    rotation: 90, // Facing left
                })
            }

            // Add remaining chairs to top and bottom
            for (let i = 0; i < shortSideChairsPerSide; i++) {
                const ratio = (i + 1) / (shortSideChairsPerSide + 1)

                // Top chairs
                positions.push({
                    left: tableWidth * ratio,
                    top: 0,
                    rotation: 0, // Facing down
                })

                // Bottom chairs
                positions.push({
                    left: tableWidth * ratio,
                    top: tableHeight,
                    rotation: 180, // Facing up
                })
            }

            // If there are any remaining chairs, add them to the corners
            const remainingChairs = seats - positions.length
            if (remainingChairs > 0) {
                // Top-left corner
                positions.push({
                    left: 0,
                    top: 0,
                    rotation: 315, // Facing bottom-right
                })

                if (remainingChairs > 1) {
                    // Top-right corner
                    positions.push({
                        left: tableWidth,
                        top: 0,
                        rotation: 225, // Facing bottom-left
                    })
                }

                if (remainingChairs > 2) {
                    // Bottom-right corner
                    positions.push({
                        left: tableWidth,
                        top: tableHeight,
                        rotation: 135, // Facing top-left
                    })
                }

                if (remainingChairs > 3) {
                    // Bottom-left corner
                    positions.push({
                        left: 0,
                        top: tableHeight,
                        rotation: 45, // Facing top-right
                    })
                }
            }
        }

        return positions
    }

    function Chair({ position, status }: { position: any; status?: string }) {
        const getChairStatusStyles = () => {
            switch (status) {
                case 'confirmed':
                    return 'bg-emerald-100 border-emerald-300'
                case 'finished':
                    return 'bg-blue-100 border-blue-300'
                case 'canceled':
                    return 'bg-rose-100 border-rose-300'
                default:
                    return 'bg-gray-200 border-gray-300'
            }
        }

        return (
            <div
                className={cn(
                    'absolute w-6 h-6 border transition-colors duration-300',
                    getChairStatusStyles()
                )}
                style={{
                    left: position.left + 27,
                    top: position.top + 27,
                    transform: `translate(-50%, -50%) rotate(${position.rotation}deg)`,
                    borderRadius: '30% 30% 50% 50%',
                }}
            />
        )
    }

    return (
        <BookingDetailsDialog booking={booking}>
            <Button
                className={cn(
                    'h-full border-none bg-transparent hover:bg-transparent p-0 rounded-none shadow-none',
                    className
                )}
                disabled={!booking}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className={cn(
                        'relative transition-all duration-300 ease-in-out',
                        isHovered && 'scale-105'
                    )}
                    style={{
                        width: width + 60,
                        height: height + 60,
                    }}
                    aria-label={`Table ${booking?.id || 'empty'}, ${booking?.status || 'free'}, ${seats} seats`}
                >
                    {/* Table number label */}
                    <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500">
                        {booking && `Mesa ${booking.first_name}`}
                    </div>

                    {/* Table */}
                    <div
                        className={cn(
                            'absolute border-2 transition-colors duration-300',
                            getStatusColor(booking?.status),
                            isHovered && 'ring-2 ring-zubc-950',
                            tableShape === 'round' ? 'rounded-full' : 'rounded-[40%]'
                        )}
                        style={{
                            width,
                            height,
                            left: 30,
                            top: 30,
                        }}
                    >
                        {/* Status indicator and booking info */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            {booking ? (
                                <>
                                    {booking.status === 'confirmed' && (
                                        <CircleCheckBig className="absolute right-2 top-2 size-6 text-emerald-500" />
                                    )}
                                    <div
                                        className={cn(
                                            'font-medium',
                                            getStatusTextColor(booking.status)
                                        )}
                                    >
                                        {booking.amount_of_people}
                                    </div>
                                    <div
                                        className={cn(
                                            'text-xs',
                                            getStatusTextColor(booking.status)
                                        )}
                                    >
                                        {booking.amount_of_people > 1 ? 'Pessoas' : 'Pessoa'}
                                    </div>
                                    <div
                                        className={cn(
                                            'text-sm font-medium mt-1',
                                            getStatusTextColor(booking.status)
                                        )}
                                    >
                                        {booking.first_name}
                                    </div>
                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs">
                                        <span
                                            className={cn(
                                                'px-2 py-0.5 rounded-full text-xs',
                                                booking.status === 'confirmed'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : booking.status === 'finished'
                                                      ? 'bg-blue-100 text-blue-700'
                                                      : 'bg-rose-100 text-rose-700'
                                            )}
                                        >
                                            {booking.status === 'confirmed'
                                                ? 'confirmado'
                                                : booking.status === 'finished'
                                                  ? 'finalizado'
                                                  : 'cancelado'}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-xs font-light italic text-gray-500">
                                    Mesa Livre
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Chairs */}
                    {getChairPositions().map((position, index) => (
                        <Chair key={index} position={position} status={booking?.status} />
                    ))}
                </div>
            </Button>
        </BookingDetailsDialog>
    )
}

export default Table
