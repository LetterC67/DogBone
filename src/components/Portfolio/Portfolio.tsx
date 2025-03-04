import { useState, useEffect } from 'react';
import usePortfolio from '../../hooks/usePortfolio';
import { useData } from '../../context/DataContext';
import Navigator from '../Navigator';
import { usePrivy } from '@privy-io/react-auth';


function BreathingText() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPulse((prev) => !prev);
    }, 2000); // Pulse every 2 seconds (adjust as needed)

    return () => clearInterval(intervalId);
  }, []);

  const textColor = pulse ? 'text-(--accent-2)' : 'text-[#D2ADB8]'; // Highlight pulse

  return (
    <div
      className={`text-2xl font-semibold transition-colors duration-2000 ease-in-out ${textColor} p-4 rounded-lg`}
    >
      Paws-itively loading your portfolio!
    </div>
  );
}

export default function Portfolio() {
    const [expandedTokens, setExpandedTokens] = useState<string[]>([]);
    const { portfolio, totalBalance, ready } = usePortfolio();
    const { sonicPoint, ringsPoint } = useData();
    const { authenticated, login } = usePrivy();

    const toggleDetails = (symbol: string) => {
        setExpandedTokens(prev =>
        prev.includes(symbol)
            ? prev.filter(s => s !== symbol)
            : [...prev, symbol]
        );
    };

    if (!authenticated) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className='w-160 h-120 text-4xl rounded-2xl border-(--divider)  flex flex-col items-center justify-center gap-5 font-(family-name:--eb) mimdak'>
                <img src="https://www.svgrepo.com/show/423814/dog-origami-paper.svg" className="h-36"></img>
                    
                    <p>Tokens dance in light,</p>

                    <p><span className='hover:cursor-pointer underline underline-offset-6 decoration-2' onClick={login}>Login</span> to unveil your wealth,</p>

                    <p>Crypto dreams take flight.</p>


                </div>
            </div>
        )
    }

    

  return (
    <div
      className="portfolio-container w-full h-full flex flex-col rounded-2xl"
      style={{
        background: 'var(--background)',
        color: 'var(--primary)',
        padding: '2rem'
      }}
    >
      <Navigator />
      <div className="container h-full" style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Summary Cards */}
        <div
          className="portfolio-summary"
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            marginBottom: '2rem'
          }}
        >
          <SummaryCard title="Total Balance" value={`$${totalBalance.toFixed(2)}`} />
          <SummaryCard title="Sonic Points" value={parseFloat(sonicPoint).toFixed(2)} img={<img src="https://tokens.debridge.finance/Logo/100000014/0x0000000000000000000000000000000000000000/small/token-logo.svg" className='h-7 w-7'></img>}/>
          <SummaryCard title="Rings Points" value={parseFloat(ringsPoint).toFixed(2)} img={<img src="https://i.ibb.co/TBqmpJDt/Logo-White.png" className='h-6 w-6'></img>} />
        </div>

        {/* Token List as a Table */}
        <div className="rounded-2xl h-4/5  bg-(--secondary)">
                  <div className="w-full h-full token-list" style={{width:'99%', overflowX: 'auto', overflowY: 'auto'}}>
                  {(ready) &&  <table
                        style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        overflow: 'hidden'
                        }}
                        className='rounded-2xl'
                    >
                        <thead>
                        <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                            <th style={{ textAlign: 'left', padding: '1rem 1.5rem' }}>Token</th>
                            <th style={{ textAlign: 'right', padding: '1rem 1.5rem' }}>Balance</th>
                            <th style={{ textAlign: 'right', padding: '1rem 1.5rem' }}>Price</th>
                            <th style={{ textAlign: 'right', padding: '1rem 1.5rem'}} className="w-1/20"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {portfolio.map(asset => (
                            <TokenRow
                            key={asset.token.symbol}
                            token={asset.token}
                            asset={asset}
                            isExpanded={expandedTokens.includes(asset.token.symbol)}
                            onToggle={toggleDetails}
                            />
                        ))}
                        </tbody>
                    </table>
                      }


                      {!ready && 
                        <div className="flex items-center justify-center h-full flex-col gap-10 text-2xl">
                          <div className="w-30 h-30 border-4 border-(--accent-3) border-t-(--highlight) rounded-full animate-spin"></div>
                          <BreathingText />
                        </div>
                      }
                  </div>
              </div>
    
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subValue,
  img
}: {
  title: string;
  value: string;
  subValue?: string;
  img?: any;
}) {
  return (
    <div
      className="summary-card"
      style={{
        background: 'var(--secondary)',
        padding: '1.5rem',
        borderRadius: '1rem'
      }}
    >
      <div
        className="card-title"
        style={{
          color: 'var(--highlight)',
          marginBottom: '0.5rem',
          fontSize: '0.9rem'
        }}
      >
        {title}
      </div>
      <div
        className="card-value flex flex-row gap-2 items-center"
        style={{
          fontSize: '1.5rem',
          color: 'var(--primary)'
        }}
      >
        {value}
        {img}
      </div>
      {subValue && (
        <div
          className="card-subvalue"
          style={{
            fontSize: '0.9rem',
            color: 'var(--less-highlight)'
          }}
        >
          {subValue}
        </div>
      )}
    </div>
  );
}

function TokenRow({
  token,
  isExpanded,
  onToggle,
  asset
}: {
  token: {
    symbol: string;
    name: string;
    logoURI: string;
    balance: string;
    balanceValue: string;
    price: string;
    priceChange: string;
    details: { label: string; value: string }[];
    };
    asset: any;
  isExpanded: boolean;
  onToggle: (symbol: string) => void;
}) {
  return (
    <>
      <tr
        onClick={() => onToggle(token.symbol)}
        style={{
          cursor: 'pointer',
          transition: 'background 0.3s ease',
          /* If not expanded, add a divider; if expanded, the divider is rendered below the details */
          borderBottom: isExpanded ? 'none' : '1px solid var(--divider)'
        }}
      >
        <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={token.logoURI}
            alt={token.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{token.name}</div>
            <div style={{ color: 'var(--disabled)', fontSize: '0.9rem' }}>{token.symbol}</div>
          </div>
        </td>
        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
          <div>{(parseFloat(asset.balance) + parseFloat(asset.deposited)).toFixed(6)}</div>
          <div style={{ color: 'var(--less-highlight)', fontSize: '0.9rem' }}>
            ~${asset.amount_usd.toFixed(4)}
          </div>
        </td>
        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
          <div>${parseFloat(asset.price).toFixed(2)}</div>
          <div
            style={{
              fontSize: '0.9rem',
              color: `var(--accent-2)`
            }}
          >
            -
          </div>
        </td>
        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
          <svg
            style={{
              transition: 'transform 0.3s ease',
              transform: isExpanded ? 'rotate(180deg)' : 'none',
              stroke: 'var(--primary)',
              strokeWidth: '2'
            }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td
            colSpan={4}
            style={{
              padding: '1rem',
              background: 'var(--secondary)',
              borderBottom: '1px solid var(--divider)'
            }}
          >
              <DetailRow key="Wallet Balance" label="Wallet Balance" value={parseFloat(asset.balance).toFixed(6)} />
              <DetailRow key="Vault Deposit" label="Vault Deposit" value={parseFloat(asset.deposited).toFixed(6)} />
          </td>
        </tr>
      )}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
        padding: '0.5rem',
        borderRadius: '0.5rem',
      }}
    >
      <span style={{ color: 'var(--disabled)' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
