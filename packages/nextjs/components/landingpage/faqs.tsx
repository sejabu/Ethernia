import Link from "next/link";
import { useTranslation } from "~~/lib/i18n/LanguageContext";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does ETHERNIA ensure the security of my assets?",
    answer: "The ETHERNIA platform will NEVER ask for passwords or seed phrases of your wallets; you remain in custody of your assets."
  },
  {
    question: "What happens to my assets if something happens to me?",
    answer: "Your assets will be automatically transferred to your designated beneficiaries according to your predetermined conditions and timeline."
  },
  {
    question: "Can I modify my inheritance plan after setting it up?",
    answer: "Yes, you can modify your inheritance plan at any time as long as you have access to your account."
  },
  {
    question: "What types of crypto assets are supported?",
    answer: "We support all major cryptocurrencies and popular ERC-20 tokens. For native currencies like Ethereum, you must first convert them to the wrapped version (wETH). The list is continuously expanding."
  },
  {
    question: "How much does it cost to use ETHERNIA?",
    answer: "Ethernia was designed to be affordable. Our platform guarantees the right of everyone to have a crypto inheritance plan, removing the traditional barriers of prohibitive lawyer fees and bureaucratic processes that prevent many from accessing these services. We will offer different plans, beginning with a fully functional free option and others with enhanced features."
  },
  {
    question: "How will ETHERNIA platform know about my dead?",
    answer: "The system automatically sends you a request every six months to confirm you are alive. If you do not confirm, beneficiaries will receive a notification that you are unresponsive. If you are deceased, they can initiate a claim to execute the will."
  }
];

export default function FAQ() {
  const { t } = useTranslation();
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about ETHERNIA's services and features
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {faqs.map((faq, i) => (
            <div key={i} className="collapse collapse-arrow bg-base-100 border border-base-300">
              <input type="radio" name="my-accordion-2" defaultChecked />
              <span className="collapse-title font-semibold">{faq.question}</span>
              <span className="collapse-content text-sm">{faq.answer}</span>
            </div>  
          ))}
        </motion.div>
      </div>
      <div className="container rounded-xl flex flex-col bg-base-300 justify-center mt-8 mx-auto border border-base-300 shadow-md ">
          <h2 className="text-4xl md:text-4xl font-bold tracking-tight mt-4 mb-2 text-center">Start your inheritance plan now</h2>
          <p className="text-xl md:text-1xl text-muted-foreground mb-2 text-center">The first step in leaving assets to your loved ones is become a register user in Ethernia</p>
          <p className="text-center">
            <Link href="dashboard" className="btn btn-primary w-36 text-base">
              {t('hero.demo')}
            </Link>
          </p>
      </div>
    </section>
  );
}