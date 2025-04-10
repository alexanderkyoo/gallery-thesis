import React from 'react';

function StartPage({ onEnterClick }) {
  const title = "THE PAIRING GALLERY";
  const colors = {
    primary: 'rgb(55, 37, 68)',
    accent: '#e29a47',
    accentHover: '#dc6e08'
  };

  const styles = {
    startPage: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      marginTop: '-4rem',
      color: colors.primary,
      fontFamily: 'Helvetica, Arial, sans-serif',
      textAlign: 'center',
    },
    startTitle: {
      margin: '22rem 0 10rem',
      fontSize: '4rem',
      fontWeight: 'bold',
      whiteSpace: 'pre',
    },
    enterButton: {
      margin: '6rem 0 0',
      padding: '1rem 2rem',
      backgroundColor: colors.accent,
      color: colors.primary,
      fontSize: '1.25rem',
      fontWeight: 500,
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s ease',
    },
    waveLetter: {
      display: 'inline-block',
      animation: 'wave 1.5s ease-in-out infinite',
    }
  };

  return (
    <div style={styles.startPage}>
      <h1 style={styles.startTitle}>
        {[...title].map((char, index) => (
          <span 
            key={index} 
            style={{
              ...styles.waveLetter,
              animationDelay: `${index * 0.1}s`
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      <button 
        style={styles.enterButton} 
        onClick={onEnterClick}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
      >
        ENTER
      </button>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-8px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default StartPage;