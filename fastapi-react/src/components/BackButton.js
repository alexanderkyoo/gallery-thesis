import React from 'react';

function BackButton({ onClick, text = "Back" }) {
	const styles = {
		wrapper: {
			display: 'flex',
			justifyContent: 'center',
			marginBottom: '1rem',
		},
		button: {
			padding: '0.5rem 1rem',
			backgroundColor: '#e29a47',
			color: 'rgb(55, 37, 68)',
			border: 'none',
			borderRadius: '0.375rem',
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			cursor: 'pointer',
			fontFamily: 'Helvetica, Arial, sans-serif',
			fontSize: '1rem',
			transition: 'background-color 0.2s ease',
		},
		svg: {
			display: 'inline-block',
		},
	};

	return (
		<div style={styles.wrapper}>
			<button
				onClick={onClick}
				style={styles.button}
				onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc6e08')}
				onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e29a47')}
			>
				<svg
					style={styles.svg}
					width="16"
					height="16"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				<span>{text}</span>
			</button>
		</div>
	);
}

export default BackButton;
