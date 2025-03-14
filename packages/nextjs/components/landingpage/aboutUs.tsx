import { motion } from "framer-motion";

const team = [
  {
    name: "@elgallodev",
    role: "Full Stack Web3 Developer",
    image: "/elgallodev.jpg",
  },
  {
    name: "@lulutiETH",
    role: "Backend Developer & QA Enginieer | Web 3 Smart Contract Developer",
    image: "/lulutieth.jpg",
  },
  {
    name: "@noe_v452",
    role: "UI/UX Designer",
    image: "/noegraf.png",
  },
];

export default function AboutUs() {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet the Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're a team of blockchain passionate dedicated to solving the crypto inheritance challenge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-4 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}