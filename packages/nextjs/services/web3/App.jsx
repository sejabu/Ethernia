// import { useSendTransaction } from 'wagmi'
import { useSendTransaction } from '@arcana/ca-wagmi'
import { parseEther } from 'viem'

function App() {
const { sendTransaction } = useSendTransaction()

return (
    <button
    onClick={() =>
        sendTransaction({
        to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
        value: parseEther('0.01'),
        })
    }
    >
    Send transaction
    </button>
)}