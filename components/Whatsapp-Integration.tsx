import useWhatsApp from '@/hooks/use-whatsapp'
import Image from 'next/image'
import React, { useState } from 'react'

import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'

const WhatsAppIntegration: React.FC = () => {
    const { session, messages, isLoading, error, startSession, sendMessage, sendMedia, logout } =
        useWhatsApp()

    const [phoneNumber, setPhoneNumber] = useState('')
    const [messageText, setMessageText] = useState('')

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (phoneNumber && messageText) {
            await sendMessage(phoneNumber, messageText)
            setMessageText('')
        }
    }

    const handleSendMedia = async (
        file: File,
        mediaType: 'image' | 'video' | 'audio' | 'document',
        caption?: string
    ) => {
        if (phoneNumber && file) {
            await sendMedia(phoneNumber, file, mediaType, caption)
        }
    }

    return (
        <Card className="p-4 w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Integração com WhatsApp</CardTitle>
                <CardDescription>
                    Conecte-se ao WhatsApp para enviar mensagens e arquivos diretamente do sistema.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Status da Conexão</h2>
                    <div className="flex items-center mb-4">
                        <div
                            className={`w-3 h-3 rounded-full   ${
                                session?.status === 'connected'
                                    ? 'bg-green-500'
                                    : session?.status === 'connecting'
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                            }`}
                        ></div>
                        <span className="font-medium">
                            {session?.status === 'connected'
                                ? 'Conectando'
                                : session?.status === 'connecting'
                                  ? 'Conectando...'
                                  : 'Desconectado'}
                        </span>
                    </div>

                    {session?.status !== 'connected' && (
                        <Button
                            onClick={startSession}
                            disabled={isLoading || session?.status === 'connecting'}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Conectando...' : 'Conectar WhatsApp'}
                        </Button>
                    )}

                    {session?.status === 'connected' && (
                        <Button
                            onClick={logout}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Processando...' : 'Desconectado'}
                        </Button>
                    )}
                </div>

                {/* QR Code Display */}
                {session?.qr && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
                        <h2 className="text-xl font-semibold mb-2">Escaneie o QR Code</h2>
                        <p className="mb-4">
                            Escaneie este QR code com o aplicativo WhatsApp para conectar
                        </p>
                        <div className="flex justify-center">
                            <Image
                                src={session.qr}
                                alt="WhatsApp QR Code"
                                width={200}
                                height={200}
                            />
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                {/* Send Message Form */}
                {session?.status === 'connected' && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Enviar Menssagem</h2>
                        <form onSubmit={handleSendMessage}>
                            <div className="mb-4">
                                <Label htmlFor="phoneNumber" className="block mb-2 font-medium">
                                    Phone Number (with country code)
                                </Label>
                                <Input
                                    type="text"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="e.g. 5521999999999"
                                    className="w-full px-4 py-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="message" className="block mb-2 font-medium">
                                    Message
                                </Label>
                                <textarea
                                    id="message"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="w-full px-4 py-2 border rounded-md"
                                    rows={4}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                            >
                                {isLoading ? 'enviando...' : 'Mensagem Enviada'}
                            </Button>
                        </form>
                    </div>
                )}

                {/* Upload de Arquivo de Mídia */}
                {session?.status === 'connected' && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Enviar Mídia</h2>
                        <p className="mb-4 text-sm text-gray-600">
                            Envie imagens (16MB), vídeos (16MB), áudios (16MB) ou documentos (2GB)
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-md border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                                <span className="mt-2">Enviar Imagem</span>
                                <Input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleSendMedia(e.target.files[0], 'image')
                                        }
                                    }}
                                />
                            </Label>

                            <Label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-md border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                                <span className="mt-2">Enviar Vídeo</span>
                                <Input
                                    type="file"
                                    className="hidden"
                                    accept="video/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleSendMedia(e.target.files[0], 'video')
                                        }
                                    }}
                                />
                            </Label>

                            <Label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-md border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                                <span className="mt-2">Enviar Áudio</span>
                                <Input
                                    type="file"
                                    className="hidden"
                                    accept="audio/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleSendMedia(e.target.files[0], 'audio')
                                        }
                                    }}
                                />
                            </Label>

                            <Label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-md border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                                <span className="mt-2">Enviar Documento</span>
                                <Input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleSendMedia(e.target.files[0], 'document')
                                        }
                                    }}
                                />
                            </Label>
                        </div>
                    </div>
                )}

                {/* Histórico de Mensagens */}
                {session?.status === 'connected' && messages.length > 0 && (
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Mensagens Recentes</h2>
                        <div className="space-y-4">
                            {messages.map((msg: any, index: number) => (
                                <div key={index} className="p-3 bg-white rounded-md shadow-sm">
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>De: {msg.from}</span>
                                        <span>{new Date(msg.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-800">{msg.message}</p>
                                    {msg.mediaUrl && (
                                        <p className="text-sm text-blue-500 mt-2">{msg.mediaUrl}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
export default WhatsAppIntegration
