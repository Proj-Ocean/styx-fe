import { ClientOnly } from "@/components/ui/client-only";

export default function CoinFlipGame() {
    return (
        <ClientOnly>
            {/* <BlackJack /> */}
            <main className="flex min-h-screen flex-col items-center p-24">
                <div className="z-10 w-full max-w-5xl items-center font-mono text-sm lg:flex text-center justify-center">
                    <div className="text-heading1 font-extrabold leading-[105%] text-primary text-center">
                        Coinflip
                     </div>
                </div>
                <div className="min-h-96">
                </div>
                <div className="h-32">
                        Game history
                </div>
            </main>
            
        </ClientOnly>
    )
}
