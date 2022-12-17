import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { canto } from '~/constants/canto'
import { publicProvider } from 'wagmi/providers/public'
import { ThemeProvider } from '@kalidao/reality'
import '@kalidao/reality/styles'
import { getRainbowTheme } from '~/utils/getRainbowTheme'
import '~/design/app.css'

const { chains, provider } = configureChains([canto], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'Kali | Canto',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const rainbowTheme = getRainbowTheme('dark')

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={rainbowTheme}>
          <ThemeProvider defaultMode="dark" forcedMode="dark" defaultAccent="green">
            <Component {...pageProps} />
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default MyApp
