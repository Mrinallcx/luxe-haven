import { motion } from "framer-motion";
import { RefreshCw, ShieldCheck, Truck } from "lucide-react";

const services = [
  {
    icon: RefreshCw,
    title: "Free Returns",
    description:
      "Our customers can return or exchange their purchases hassle-free, with our easy-to-use return policy.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description:
      "We offer a secure checkout process that protects our customers' personal and financial information.",
  },
  {
    icon: Truck,
    title: "Customer Support",
    description:
      "Our customer support team is available to help customers with any questions or concerns they may have, ensuring a seamless and stress-free shopping experience.",
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
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Our Services</h2>
            <p className="text-muted-foreground">
              We understand the importance of a seamless and enjoyable shopping
              experience.
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
              <h3 className="font-serif text-xl mb-3">{service.title}</h3>
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
