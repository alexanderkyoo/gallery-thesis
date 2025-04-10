import React from 'react';

function StartPage({ onEnterClick }) {
	const title = "THE PAIRING GALLERY";

	const styles = {
		startPage: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh',
			marginTop: '-4rem',
			color: 'rgb(55, 37, 68)',
			fontFamily: 'Helvetica, Arial, sans-serif',
			textAlign: 'center',
		},
		startTitle: {
			marginTop: '22rem',
			fontSize: '4rem',
			fontWeight: 'bold',
			marginBottom: '10rem',
			whiteSpace: 'pre',
		},
		enterButton: {
			marginTop: '6rem',
			padding: '1rem 2rem',
			backgroundColor: '#e29a47',
			color: 'rgb(55, 37, 68)',
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
				onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc6e08'}
				onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e29a47'}
			>
				ENTER
			</button>

			{/* Animation keyframes */}
			<style jsx>{`
				@keyframes wave {
					0% {
						transform: translateY(0);
						opacity: 1;
					}
					50% {
						transform: translateY(-8px);
						opacity: 0.8;
					}
					100% {
						transform: translateY(0);
						opacity: 1;
					}
				}
			`}</style>
		</div>
	);
}

export default StartPage;