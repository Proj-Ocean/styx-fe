import BlackJackTable from "@/components/Blackjack/BlackJackTable";
import { ClientOnly } from "@/components/ui/client-only";

export default function BlackJackGame() {
    return (
        <ClientOnly>
            {/* <BlackJack /> */}
            <main className="flex min-h-screen flex-col items-center p-24">
                <div className="z-10 w-full max-w-5xl items-center font-mono text-sm lg:flex">
                    <div className="text-heading1 font-extrabold leading-[105%] text-primary">
                        Blackjack
                     </div>
                </div>
                <div className="py-10 min-h-96">
                        <BlackJackTable />
                </div>
                <div className="h-32">
                        Game history
                </div>
            </main>
            
        </ClientOnly>
    )
}
