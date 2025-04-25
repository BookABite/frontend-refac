'use client'

import { UserData, useAuth } from '@/app/contexts/AuthContext'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface GroupInfoProps {
    unitId: string
    user: UserData
    onUnitChange: (value: string) => void
}

export const GroupInfo = ({ unitId, user, onUnitChange }: GroupInfoProps) => {
    const groupName = user?.group?.name || ''

    return (
        <div className="flex items-center space-x-4">
            <div className="grid gap-2">
                <Label htmlFor="restaurant">Grupo</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                    {groupName}
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select value={unitId} onValueChange={onUnitChange}>
                    <SelectTrigger id="unit" className="w-auto">
                        <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                        {user?.group?.units?.map((unit) => (
                            <SelectItem key={unit.unit_id} value={unit.unit_id}>
                                {unit.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
