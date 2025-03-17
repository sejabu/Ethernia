import { useTranslation } from "~~/lib/i18n/LanguageContext";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className='card card-bordered bg-base-300 mb-6'>
        <div className='card-body'>
            <h1 className='card-title'>Terms and Conditions</h1>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <p><strong>Effective Date:</strong> [2025-03-16]</p>
                <p><strong>Last Updated:</strong> [2025-03-16]</p>
            </div>

            <h2 className='card-title'>1. Introduction</h2>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <p>Welcome to <strong>Ethernia</strong>, a decentralized application ("dApp") for creating and managing digital testaments for crypto inheritance. By using Ethernia, you agree to comply with these Terms and Conditions ("Terms"). If you do not agree, do not use the dApp.</p>
            </div>
            <h2 className='card-title'>2. Eligibility</h2>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <p>You must be at least 18 years old and able to enter legally binding agreements to use Ethernia.</p>
            </div>

            <h2 className='card-title'>3. Services Provided</h2>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <ul>
                    <li>01 - Create digital testaments.</li>
                    <li>02 - Add heirs and define distribution.</li>
                    <li>03 - Authenticate via wallet and/or email.</li>
                </ul>
            </div>

            <h2 className='card-title'>4. User Responsibilities</h2>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <ul>
                    <li>01 - Manage your wallet and private keys securely.</li>
                    <li>02 - Ensure accuracy of testament information.</li>
                    <li>03 - Avoid illegal use of Ethernia.</li>
                </ul>
            </div>
            <h2 className='card-title'>5. Privacy</h2>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <p>See our <a href="/privacy">Privacy Policy</a>.</p>
            </div>
            <h2 className='card-title'>6. Security & Risk Disclaimer</h2>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <ul>
                    <li>01 - We do not hold user funds or keys.</li>
                    <li>02 - Blockchain usage involves risks, including loss of funds.</li>
                    <li>03 - Ethernia is provided "as-is" without guarantees.</li>
                </ul>
            </div>
            <h2 className='card-title'>7. Intellectual Property</h2>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <p>All content and branding are owned by Ethernia. Unauthorized use is prohibited.</p>
            </div>
            <h2 className='card-title'>8. Limitation of Liability</h2>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <p>Ethernia is <strong>not liable</strong> for losses or damages from using the dApp.</p>
            </div>
            <h2 className='card-title'>9. Changes</h2>
            <div className="card bg-base-100 w-auto shadow-sm flex: 1 p-4">
                <p>Terms may change. Continued use constitutes acceptance of updates.</p>
            </div>
            <h2 className='card-title'>10. Contact</h2>
            <p>📧 <strong>ethernia.app@gmail.com</strong></p>
        </div>
    </div>
  );
}