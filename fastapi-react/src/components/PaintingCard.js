import React from 'react';

function PaintingCard({ painting, onClick }) {
	const styles = {
		card: {
			width: '600px',
			height: '600px',
			display: 'flex',
			flexDirection: 'column',
			borderRadius: '0.75rem',
			boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
			cursor: 'pointer',
			transition: 'box-shadow 0.2s ease',
            backgroundColor: '#fff9ec',
		},
		imageWrapper: {
			position: 'relative',
			flex: '1 1 80%',
			width: '100%',
			overflow: 'hidden',
		},
		image: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: '#f9fafb'
        },
		placeholder: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			backgroundColor: '#e5e7eb',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			color: '#6b7280',
			fontSize: '1rem',
			fontFamily: 'Helvetica, Arial, sans-serif',
		},
		content: {
			padding: '0.75rem',
			flex: '1 1 20%',
			fontFamily: 'Helvetica, Arial, sans-serif',
		},
		title: {
			fontWeight: 600,
			fontSize: '1.125rem',
			marginBottom: '0.5rem',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},
		author: {
			fontSize: '1rem',
			color: '#4b5563',
			marginBottom: '0.25rem',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},
		year: {
			fontSize: '0.875rem',
			color: '#6b7280',
		},
	};

	return (
		<div
			style={styles.card}
			onClick={onClick}
			onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)')}
			onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)')}
		>
			<div style={styles.imageWrapper}>
				{painting.image_url ? (
					<img
						src={painting.image_url}
						alt={painting.title}
						style={styles.image}
					/>
				) : (
					<div style={styles.placeholder}>
						<span>No image</span>
					</div>
				)}
			</div>
			<div style={styles.content}>
				<h3 style={styles.title}>{painting.title}</h3>
				<p style={styles.author}>{painting.author}</p>
				<p style={styles.year}>{painting.year}</p>
			</div>
		</div>
	);
}

export default PaintingCard;