import { Button } from '@/components/ui/button'
import { Loader, LogOut, MessageCirclePlus } from 'lucide-react'

interface WhatsAppConnectionButtonProps {
    status: 'connecting' | 'connected' | 'disconnected'
    onConnect: () => void
    onDisconnect: () => void
}

export function WhatsAppConnectionButton({
    status,
    onConnect,
    onDisconnect,
}: WhatsAppConnectionButtonProps) {
    if (status === 'connected') {
        return (
            <Button
                variant="destructive"
                size="sm"
                onClick={onDisconnect}
                className="flex items-center gap-1"
            >
                <LogOut className="h-4 w-4" />
                Desconectar WhatsApp
            </Button>
        )
    }

    return (
        <Button
            variant={status === 'connecting' ? 'outline' : 'whatsapp'}
            size="sm"
            onClick={onConnect}
            disabled={status === 'connecting'}
            className="w-full"
        >
            {status === 'connecting' ? (
                <>
                    <Loader className="  h-4 w-4 animate-spin" />
                    Conectando...
                </>
            ) : (
                <>
                    <MessageCirclePlus size={16} />
                    Conectar WhatsApp
                </>
            )}
        </Button>
    )
}
