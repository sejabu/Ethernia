import { useTranslation } from "~~/lib/i18n/LanguageContext";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className='card card-bordered bg-base-300 mb-6'>
        <div className='card-body'>
        <h1 className='card-title'>Privacy Policy</h1>
        <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
        <p><strong>Effective Date:</strong> [2025-03-16]</p>
        <p><strong>Last Updated:</strong> [2025-03-16]</p>
        </div>

        <h2 className='card-title'>1. Introduction</h2>
        <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
        <p>We respect your privacy. This policy describes what data we collect and how we use it.</p>
        </div>
        <h2 className='card-title'>2. Data We Collect</h2>
        <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
        <ul>
            <li><strong>01 - Wallet address</strong> (required).</li>
            <li><strong>02 - Email address</strong> (required, for notifications).</li>
            <li><strong>03 - Testament data</strong> (storage on blockchain).</li>
            <li><strong>04 - Proof of life data</strong> (if enabled).</li>
        </ul>
        <p>We do <strong>not</strong> collect private keys.</p>
        </div>

        <h2 className='card-title'>3. How We Use Data</h2>
        <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
        <ul>
            <li>01 - Enable testament creation and management.</li>
            <li>02 - Notify users and heirs.</li>
            <li>03 - Improve functionality.</li>
        </ul>
        </div>

        <h2 className='card-title'>4. Data Security</h2>
        <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
        <p>Encrypted sensitive data.</p>
        <p>Secure off-chain storage (Neon PostgreSQL).</p>
        </div>
        <h2 className='card-title'>5. Third-Party Services</h2>
        <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
        <ul>
            <li><strong>01 - Resend</strong> (email service).</li>
        </ul>
        <p>No data shared for marketing.</p>
        </div>
        <h2 className='card-title'>6. User Rights</h2>
        <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
        <p><strong>Access</strong>, <strong>deletion</strong>, <strong>correction</strong> requests via <strong>ethernia.app@gmail.com</strong>.</p>
        </div>
        <h2 className='card-title'>7. Blockchain Risks</h2>
        <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
        <p>We are <strong>not responsible</strong> for blockchain risks or wallet losses.</p>
        </div>
        <h2 className='card-title'>8. Changes</h2>
        <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
        <p>Policy updates may occur. Continued use means acceptance.</p>
        </div>
        <h2 className='card-title'>9. Contact</h2>
        <p>📧 <strong>ethernia.app@gmail.com</strong></p>
        </div>
    </div>
  );
}