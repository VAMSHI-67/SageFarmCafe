'use client';

export default function SectionAtmosphere({
  variant = 'sage',
}: {
  variant?: 'sage' | 'clay' | 'linen' | 'softsage' | 'forest';
}) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Dynamic ambient radial gradients */}
      {variant === 'sage' && (
        <>
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#77866B]/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#C76546]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#CADAC9]/10 rounded-full blur-3xl" />
        </>
      )}

      {variant === 'softsage' && (
        <>
          <div className="absolute top-0 right-10 w-[550px] h-[550px] bg-[#77866B]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#C76546]/08 rounded-full blur-3xl" />
        </>
      )}

      {variant === 'clay' && (
        <>
          <div className="absolute -top-40 right-10 w-[550px] h-[550px] bg-[#C76546]/12 rounded-full blur-3xl" />
          <div className="absolute bottom-10 -left-20 w-[500px] h-[500px] bg-[#77866B]/10 rounded-full blur-3xl" />
        </>
      )}

      {variant === 'linen' && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#CADAC9]/12 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#C76546]/08 rounded-full blur-3xl" />
        </>
      )}

      {variant === 'forest' && (
        <>
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#C76546]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-[#384B39]/25 rounded-full blur-3xl" />
        </>
      )}

      {/* Subtle Botanical Leaf & Growth Rings Linework */}
      <svg
        className={`absolute top-8 right-6 sm:right-16 w-80 h-80 sm:w-96 sm:h-96 ${
          variant === 'forest' ? 'text-white/[0.04]' : 'text-sage-700/[0.06]'
        }`}
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 8" />
        <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 6" />
        <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="200" cy="200" r="30" stroke="currentColor" strokeWidth="0.5" />
        {/* Organic sage leaf curve */}
        <path
          d="M200,20 C270,100 280,240 200,380 C120,240 130,100 200,20 Z"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="3 4"
        />
      </svg>

      <svg
        className={`absolute bottom-8 left-4 sm:left-12 w-64 h-64 sm:w-80 sm:h-80 ${
          variant === 'forest' ? 'text-clay-300/[0.04]' : 'text-clay-600/[0.05]'
        }`}
        viewBox="0 0 300 300"
        fill="none"
      >
        <circle cx="150" cy="150" r="130" stroke="currentColor" strokeWidth="0.6" strokeDasharray="5 7" />
        <circle cx="150" cy="150" r="90" stroke="currentColor" strokeWidth="0.6" />
        <path
          d="M150,30 C190,80 205,130 150,220 C95,130 110,80 150,30 Z"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <line x1="150" y1="30" x2="150" y2="220" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
      </svg>

      {/* Tactile Micro-Lattice Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(#25261F 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  );
}
