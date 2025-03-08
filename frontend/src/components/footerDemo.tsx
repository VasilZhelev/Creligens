import { Hexagon, Github, Twitter } from "lucide-react"
import { Footer } from "@/components/ui/footer"

function Footer1() {
  return (
    <div className="w-full">
      <Footer
        logo={<Hexagon className="h-10 w-10" />}
        brandName="Creligens"
        socialLinks={[
          {
            icon: <Twitter className="h-5 w-5" />,
            href: "",
            label: "Twitter",
          },
          {
            icon: <Github className="h-5 w-5" />,
            href: "",
            label: "GitHub",
          },
        ]}
        mainLinks={[
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        copyright={{
          text: "© 2024 Creligens",
          license: "All rights reserved",
        }}
      />
    </div>
  )
}

export { Footer1 }