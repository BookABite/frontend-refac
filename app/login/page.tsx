import { LoginForm } from '@/components/Login-Form'

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="absolute inset-0">
                <div className="bg-red relative h-full w-full [&>div]:absolute [&>div]:h-full [&>div]:w-full [&>div]:bg-[radial-gradient(#bababa_1px,transparent_1px)] [&>div]:[background-size:16px_16px] [&>div]:[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                    <div></div>
                </div>
            </div>
            <LoginForm />
        </div>
    )
}
