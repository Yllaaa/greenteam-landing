'use client';

import { useRouter } from 'next/navigation';

const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <button 
      type="button"
      onClick={() => router.back()}
      style={{
        padding: '6px 16px',
        borderRadius: '4px',
        border: 'none',
        background:"transparent",
        cursor: 'pointer'
      }}
      aria-label="Go back"
    >
      ← Back
    </button>
  );
};

export default BackButton;