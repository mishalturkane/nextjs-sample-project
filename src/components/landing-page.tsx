'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import * as web3 from "@solana/web3.js"

export function LandingPageComponent() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && 'solana' in window) {
      try {
        const provider = (window as any).solana
        await provider.connect()
        const publicKey = provider.publicKey.toString()
        setWalletAddress(publicKey)
        await fetchBalance(publicKey)
      } catch (err) {
        console.error("Failed to connect wallet", err)
      }
    } else {
      alert("Solana wallet not found! Please install a Solana wallet extension.")
    }
  }

  const fetchBalance = async (address: string) => {
    try {
      const connection = new web3.Connection("https://solana-mainnet.g.alchemy.com/v2/A4n7tJP75oDaD4emFu7wcMBo6bEelthD")
      const publicKey = new web3.PublicKey(address)
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / web3.LAMPORTS_PER_SOL)
    } catch (err) {
      console.error("Failed to fetch balance", err)
    }
  }

  useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress)
    }
  }, [walletAddress])

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
          <Button className="bg-white text-black hover:bg-gray-200">
            Sign In
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200">
            Login
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200">
            Connect the Wallet App
          </Button>
        </nav>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Real-time fraud prevention
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gray-400 mb-4">
            for Solana smart contracts
          </h2>
          <p className="max-w-[600px] mx-auto text-gray-400 md:text-xl mb-8">
            Secure every transaction, on-chain and beyond.
          </p>
          <Button className="bg-white text-black hover:bg-gray-200" onClick={connectWallet}>
            {walletAddress ? 'Wallet Connected' : 'Connect the Wallet App'}
          </Button>
          {walletAddress && (
            <div className="mt-4 text-white">
              <p>Wallet Address: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</p>
              {balance !== null && <p>Balance: {balance.toFixed(4)} SOL</p>}
            </div>
          )}
        </div>
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