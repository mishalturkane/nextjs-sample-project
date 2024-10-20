'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

// Make sure to import the required CSS for the wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css'

function WalletCard() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balances, setBalances] = useState<{ SOL: number | null, USDC: number | null, USDT: number | null }>({
    SOL: null,
    USDC: null,
    USDT: null
  });

  useEffect(() => {
    async function fetchBalances() {
      if (!publicKey) return;

      try {
        // Fetch SOL balance
        const solBalance = await connection.getBalance(publicKey);
        
        // Fetch token balances
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });

        let usdcBalance = null;
        let usdtBalance = null;

        for (const account of tokenAccounts.value) {
          const mintAddress = account.account.data.parsed.info.mint;
          const balance = account.account.data.parsed.info.tokenAmount.uiAmount;

          if (mintAddress === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") { // USDC
            usdcBalance = balance;
          } else if (mintAddress === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB") { // USDT
            usdtBalance = balance;
          }
        }

        setBalances({
          SOL: solBalance / LAMPORTS_PER_SOL,
          USDC: usdcBalance,
          USDT: usdtBalance
        });
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    }

    if (connected) {
      fetchBalances();
    } else {
      setBalances({ SOL: null, USDC: null, USDT: null });
    }
  }, [connected, publicKey, connection]);

  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-center">Wallet Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Status: {connected ? 'Connected' : 'Disconnected'}
          </p>
          {connected && publicKey && (
            <>
              <p className="text-sm font-medium">
                Address: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </p>
              <p className="text-sm font-medium">
                SOL Balance: {balances.SOL !== null ? balances.SOL.toFixed(4) : 'Loading...'}
              </p>
              <p className="text-sm font-medium">
                USDC Balance: {balances.USDC !== null ? balances.USDC.toFixed(2) : 'Loading...'}
              </p>
              <p className="text-sm font-medium">
                USDT Balance: {balances.USDT !== null ? balances.USDT.toFixed(2) : 'Loading...'}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MainContent() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 pointer-events-none" aria-hidden="true" />
      <header className="relative z-10 px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <span className="sr-only">Solana SUMO</span>
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          <span className="ml-2 text-2xl font-bold">SUMO</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button className="bg-white text-black hover:bg-gray-200 font-semibold">
            Sign In
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200 font-semibold">
            Login
          </Button>
          <WalletMultiButton className="!bg-white !text-black hover:!bg-gray-200 !font-semibold" />
          <WalletDisconnectButton className="!bg-white !text-black hover:!bg-gray-200 !font-semibold" />
        </nav>
      </header>
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Sum it
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gray-400 mb-4">
           Bit it
          </h2>
          <p className="max-w-[600px] mx-auto text-gray-400 md:text-xl mb-8">
           Win it
          </p>
          <Button className="bg-white text-black font-semibold hover:bg-gray-200">
            Winning Amount Pool
          </Button>
        </div>
        <WalletCard />
      </main>
      <footer className="relative z-10 flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2024 Solana SUMO. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

export function PageComponent() {
  return (
    <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/A4n7tJP75oDaD4emFu7wcMBo6bEelthD"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <MainContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}