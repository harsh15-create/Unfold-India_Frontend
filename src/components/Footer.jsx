import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/harsh-kushwaha-00b701363',
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/harsh15-create',
      color: 'hover:text-gray-300'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'harshkushwahaabc25@gmail.com',
      color: 'hover:text-primary'
    }
  ];

  const companyInfo = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Blog', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: 'singhishu1@icloud.com' },
        { name: 'Contact Us', href: 'harshkushwahaabc25@gmail.com' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Travel Planning', href: '#' },
        { name: 'Route Optimization', href: '#' },
        { name: 'Language Translation', href: '#' },
        { name: 'Cultural Guide', href: '#' }
      ]
    }
  ];

  return (
    <footer className="relative">
      {/* Glassmorphic container */}
      <div className="backdrop-blur-xl bg-background/90 border-t border-white/10">
        <div className="container mx-auto px-6 py-16">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Unfold India
                </h2>
                <p className="text-muted-foreground mt-4 text-lg leading-relaxed max-w-md">
                  Discover the incredible diversity of India through personalized travel experiences, 
                  cultural insights, and seamless journey planning.
                </p>
              </motion.div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Greater Noida, UttarPradesh, India</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+91 96706 76930</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>harshkushwahaabc25@gmail.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl glass glass-hover ${social.color} transition-all duration-300`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Links Sections */}
            {companyInfo.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <Separator className="bg-white/10" />

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center pt-8 gap-6"
          >
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © {currentYear} Xerces. All rights reserved.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Crafted with ❤️ in India for travelers worldwide
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>Made with React & Supabase</span>
              <span>•</span>
              <span>Powered by AI</span>
              <span>•</span>
              <span>Version 2.0</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
