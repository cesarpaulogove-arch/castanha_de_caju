'use client'

import { UserPlus } from 'lucide-react'

import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa'

export default function Rodape() {
  const abrirRegisto = () => {
    window.location.href = '/registar'
  }

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
        px-3
        py-3
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
          justify-between
          gap-3
        "
      >
        {/* REDES SOCIAIS */}
        <div className="flex items-center gap-3 overflow-x-auto">

          {/* WHATSAPP */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex shrink-0 items-center gap-1.5
              text-xs font-semibold
              text-[#25D366]
              transition-all duration-300
              hover:scale-105
              hover:brightness-125
            "
          >
            <FaWhatsapp size={17} />
            <span>WhatsApp</span>
          </a>

          {/* FACEBOOK */}
          <a
            href="#"
            className="
              flex shrink-0 items-center gap-1.5
              text-xs font-semibold
              text-[#1877F2]
              transition-all duration-300
              hover:scale-105
              hover:brightness-125
            "
          >
            <FaFacebookF size={16} />
            <span>Facebook</span>
          </a>

          {/* INSTAGRAM */}
          <a
            href="#"
            className="
              flex shrink-0 items-center gap-1.5
              text-xs font-semibold
              text-[#E4405F]
              transition-all duration-300
              hover:scale-105
              hover:brightness-125
            "
          >
            <FaInstagram size={17} />
            <span>Instagram</span>
          </a>

          {/* LINKEDIN */}
          <a
            href="#"
            className="
              flex shrink-0 items-center gap-1.5
              text-xs font-semibold
              text-[#0A66C2]
              transition-all duration-300
              hover:scale-105
              hover:brightness-125
            "
          >
            <FaLinkedinIn size={17} />
            <span>LinkedIn</span>
          </a>

        </div>

        {/* REGISTAR-SE */}
        <button
          type="button"
          onClick={abrirRegisto}
          className="
            flex shrink-0 items-center gap-2
            rounded-full
            border border-emerald-500/30
            bg-emerald-500/10
            px-3 py-2
            text-xs font-bold
            text-emerald-400
            transition-all duration-300
            hover:bg-emerald-500
            hover:text-white
            active:scale-95
          "
        >
          <UserPlus size={16} />
          <span>Registar-se</span>
        </button>
      </div>
    </footer>
  )
}