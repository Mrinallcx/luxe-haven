import { motion } from "framer-motion";
import { ShieldCheck, Link2, ArrowRightLeft } from "lucide-react";

const services = [
  {
    icon: ShieldCheck,
    title: "Verified & Protected",
    description:
      "Own verified real-world assets digitally with transparency and control.",
  },
  {
    icon: Link2,
    title: "Tokenized Ownership",
    description:
      "Each asset is digitally represented on-chain, creating a transparent and immutable ownership record.",
  },
  {
    icon: ArrowRightLeft,
    title: "Flexible Access",
    description:
      "Hold digitally, trade on the marketplace, or redeem the physical asset anytime with insured delivery.",
  },
];

const Services = () => {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4 font-light">Our Services</h2>
            <p className="text-muted-foreground">
              Real-world assets, tokenized the right way. Verified. Secure. Redeemable.
            </p>
          </motion.div>

          {/* Service Cards */}
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              className="p-6 lg:p-8 rounded-2xl border border-border bg-card"
            >
              <service.icon className="w-10 h-10 text-foreground mb-6 stroke-[1.5]" />
              <h3 className="font-serif text-xl mb-3 font-light">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
