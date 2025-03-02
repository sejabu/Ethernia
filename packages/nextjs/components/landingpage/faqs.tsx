// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "~~/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does ETHERNIA ensure the security of my assets?",
    answer: "ETHERNIA uses military-grade encryption and multi-signature technology to secure your assets. Our smart contracts are regularly audited by leading security firms."
  },
  {
    question: "What happens to my assets if something happens to me?",
    answer: "Your assets will be automatically transferred to your designated beneficiaries according to your predetermined conditions and timeline."
  },
  {
    question: "Can I modify my inheritance plan after setting it up?",
    answer: "Yes, you can modify your inheritance plan at any time as long as you have access to your account and pass the security verifications."
  },
  {
    question: "What types of crypto assets are supported?",
    answer: "We support all major cryptocurrencies including Bitcoin, Ethereum, and popular ERC-20 tokens. The list is continuously expanding."
  },
  {
    question: "How much does it cost to use ETHERNIA?",
    answer: "We offer different pricing tiers starting from $9.99/month. Each plan includes different features and levels of support."
  }
];

export default function FAQ() {
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
    </section>
  );
}