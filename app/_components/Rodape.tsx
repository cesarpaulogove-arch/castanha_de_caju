
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
    <footer className="w-full mt-3 px-1">
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          rounded-xl
          border
          border-white/10
          bg-white/[0.03]
          px-3
          py-2
          backdrop-blur-sm
        "
      >

        {/* =====================================================
            REDES SOCIAIS
        ====================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* WHATSAPP */}

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="
              group
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/5
              text-white/70
              transition-all
              duration-300
              hover:bg-[#25D366]
              hover:text-white
              hover:scale-110
              hover:shadow-lg
              hover:shadow-[#25D366]/20
            "
          >
            <FaWhatsapp
              size={18}
              className="
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          </a>


          {/* FACEBOOK */}

          <a
            href="#"
            aria-label="Facebook"
            className="
              group
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/5
              text-white/70
              transition-all
              duration-300
              hover:bg-[#1877F2]
              hover:text-white
              hover:scale-110
              hover:shadow-lg
              hover:shadow-[#1877F2]/20
            "
          >
            <FaFacebookF
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          </a>


          {/* INSTAGRAM */}

          <a
            href="#"
            aria-label="Instagram"
            className="
              group
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/5
              text-white/70
              transition-all
              duration-300
              hover:bg-gradient-to-tr
              hover:from-yellow-400
              hover:via-pink-500
              hover:to-purple-600
              hover:text-white
              hover:scale-110
              hover:shadow-lg
              hover:shadow-pink-500/20
            "
          >
            <FaInstagram
              size={18}
              className="
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          </a>


          {/* LINKEDIN */}

          <a
            href="#"
            aria-label="LinkedIn"
            className="
              group
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/5
              text-white/70
              transition-all
              duration-300
              hover:bg-[#0A66C2]
              hover:text-white
              hover:scale-110
              hover:shadow-lg
              hover:shadow-[#0A66C2]/20
            "
          >
            <FaLinkedinIn
              size={17}
              className="
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          </a>

        </div>


        {/* =====================================================
            REGISTAR-SE
        ====================================================== */}

        <button
          type="button"
          onClick={abrirRegisto}
          className="
            group
            flex
            shrink-0
            items-center
            gap-2
            rounded-full
            border
            border-emerald-500/30
            bg-emerald-500/10
            px-3
            py-2
            text-xs
            font-bold
            text-emerald-400
            transition-all
            duration-300
            hover:border-emerald-400/60
            hover:bg-emerald-500
            hover:text-white
            hover:shadow-lg
            hover:shadow-emerald-500/20
            active:scale-95
          "
        >
          <UserPlus
            size={16}
            strokeWidth={2.3}
            className="
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          <span>
            Registar-se
          </span>
        </button>

      </div>
    </footer>
  )
}

