"use client";
import { ClientOnly } from "@/components/ui/client-only";
// import { useBlackjack } from "@/hooks/blackjack/useBlackjack";
// import { Blackjack } from "@/components/Games/Blackjack/Blackjack";
import ChipsControls from "@/components/Blackjack/ChipsControls";
import ActionBar from "@/components/Blackjack/ActionBar";

export default function BlackJackGame() {
    return (
        <ClientOnly>
            {/* <BlackJack /> */}
            <main className="flex min-h-screen flex-col items-center p-24">
                <div className="z-10 w-full max-w-5xl items-center font-mono text-sm lg:flex">
                    <div className="text-heading1 font-extrabold leading-[105%]">
                        Blackjack
                     </div>
                </div>
                <div className="py-10 min-h-96">
                        Game sectionx
                </div>
                <ActionBar></ActionBar>
                <ChipsControls></ChipsControls>
                <div className="h-32">
                        Game history
                </div>
            </main>
            
        </ClientOnly>
    )
}
