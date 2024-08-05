import ChipsControls from "@/components/Blackjack/ChipControls";
// import GameProvider from "@/components/RPS/GameContext";
import Items from "@/components/RPS/Items";
import RPSTable from "@/components/RPS/RPSTable";
import BetAmount from "@/components/ui/BetAmount";
import { ClientOnly } from "@/components/ui/client-only";

export default function RPSGame() {
    return (
        <ClientOnly>
            {/* <BlackJack /> */}
            <main className="flex min-h-screen flex-col items-center p-24">
            <div className="z-10 w-full max-w-5xl items-center font-mono text-sm lg:flex text-center justify-center">
                    <div className="text-heading1 font-extrabold leading-[105%] text-primary text-center">
                        Rock Paper Scissors
                     </div>
                </div>
        <RPSTable />
            <div className="z-10 w-full max-w-5xl items-center font-mono text-sm lg:flex text-center justify-center">

            <div className="h-32">
                        Game history
                </div>
</div>
            </main>
            
        </ClientOnly>
    )
}
