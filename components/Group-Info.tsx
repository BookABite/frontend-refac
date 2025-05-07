'use client'

import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { UserData, useAuth } from '@/contexts/AuthContext'

interface GroupInfoProps {
    unitId: string
    user: UserData
    onUnitChange: (value: string) => void
}

export const GroupInfo = ({ unitId, user, onUnitChange }: GroupInfoProps) => {
    const groupName = user?.group?.name || ''

    return (
        <div className="flex items-center space-x-4 flex-1">
            <div className="grid gap-2 w-full text-zinc-400 cursor-not-allowed">
                <Label htmlFor="restaurant">Grupo</Label>
                <div className="flex items-center h-[36px] px-3 py-2 rounded-md border border-zinc-200 bg-zinc-50 text-sm">
                    {groupName}
                </div>
            </div>

            <div className="grid gap-2 w-full">
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
