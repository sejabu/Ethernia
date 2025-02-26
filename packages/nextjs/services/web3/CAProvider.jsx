const queryClient = new QueryClient()

function App() {
return (
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
        <CAProvider>
        <App />
        </CAProvider>
    </QueryClientProvider>
    </WagmiProvider>
)
}