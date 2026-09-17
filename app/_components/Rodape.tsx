'use client'

import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa'

export default function Rodape() {
  return (
    <footer
      className="
        fixed
        bottom-0
        left-0
        z-50
        w-full
        border-t
        border-white/10
        bg-[#001431]/95
        px-4
        py-4
        shadow-2xl
        backdrop-blur-md
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          justify-center
          gap-6
          sm:gap-10
        "
      >
        {/* WHATSAPP */}
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex shrink-0 items-center gap-2
            text-sm font-semibold
            text-[#25D366]
            transition-all duration-300
            hover:scale-105
            hover:brightness-125
          "
        >
          <FaWhatsapp size={22} />
          <span>WhatsApp</span>
        </a>

        {/* FACEBOOK */}
        <a
          href="#"
          className="
            flex shrink-0 items-center gap-2
            text-sm font-semibold
            text-[#1877F2]
            transition-all duration-300
            hover:scale-105
            hover:brightness-125
          "
        >
          <FaFacebookF size={21} />
          <span>Facebook</span>
        </a>

        {/* INSTAGRAM */}
        <a
          href="#"
          className="
            flex shrink-0 items-center gap-2
            text-sm font-semibold
            text-[#E4405F]
            transition-all duration-300
            hover:scale-105
            hover:brightness-125
          "
        >
          <FaInstagram size={22} />
          <span>Instagram</span>
        </a>

        {/* LINKEDIN */}
        <a
          href="#"
          className="
            flex shrink-0 items-center gap-2
            text-sm font-semibold
            text-[#0A66C2]
            transition-all duration-300
            hover:scale-105
            hover:brightness-125
          "
        >
          <FaLinkedinIn size={22} />
          <span>LinkedIn</span>
        </a>
      </div>
    </footer>
  )
}