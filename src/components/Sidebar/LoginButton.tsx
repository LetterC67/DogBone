import { usePrivy } from '@privy-io/react-auth';
import { FaWallet } from 'react-icons/fa';
import usePortfolio from '../../hooks/usePortfolio';

function LoginButton() {
    const { ready, authenticated, login, user, logout} = usePrivy();
    const disableLogin = !ready || (ready && authenticated);
    const { totalBalance } = usePortfolio();

    if (ready && !authenticated) {
        return (
            <button
            disabled={disableLogin}
            onClick={login}
            className="
                bg-[var(--accent-2)]
                text-[var(--primary)]
                font-[var(--kanit)]
                px-4 py-2
                rounded-lg
                cursor-pointer
                transition-colors duration-300
                disabled:bg-[var(--disabled)] disabled:cursor-not-allowed
                hover:!bg-[#503A47]
                focus:outline-none focus:ring-2 focus:ring-[var(--focus)]
                w-full
            "
            >
                Log in
            </button>
        );
    }

    if (ready && authenticated) {
        return (
            // <div className="flex items-center gap-2 bg-[var(--accent-2)] text-[var(--primary)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md">
            //     <FaWallet  className="text-[var(--primary)]" />
            //     {/* <span>{user?.id}</span> */}
            // </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 border-2 text-[var(--less-highlight)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md">
                    <FaWallet size={30} />
                    <span className="w-full items-center flex justify-center">
                        ${totalBalance.toFixed(2)}
                    </span>
                    {/* <span>{user?.id}</span> */}
                </div>
                <button
                onClick={logout}
                className="
                    flex items-center gap-2 border-2 text-[var(--less-highlight)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md cursor-pointer transition-colors duration-300 hover:!bg-[#503A47] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]
                "
                >
                <span className="w-full items-center flex justify-center">
                    Log out
                </span>
                </button>
            </div>
        );
    }
}

export default LoginButton;