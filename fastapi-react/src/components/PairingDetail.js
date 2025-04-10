import React from 'react';
import BackButton from './BackButton';

function PairingDetail({ painting, imageUrl, pairing, onBackClick }) {
	const colors = {
		primary: '#3b82f6',
		background: '#f8fafc',
		grayText: '#718096',
		textDark: '#4a5568',
		textMedium: '#4b5563',
		iconColor: '#a0aec0'
	};

	const styles = {
		container: {
			maxWidth: '1000px',
			margin: '0 auto',
			padding: '1rem',
			fontFamily: 'Helvetica, Arial, sans-serif',
		},
		section: {
			flex: '1 1 45%',
			backgroundColor: colors.background,
			padding: '1rem',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
		},
		imageWrapper: {
			marginBottom: '0.75rem',
			textAlign: 'center',
		},
		image: {
			borderRadius: '0.25rem',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
			maxWidth: '100%',
			maxHeight: '24rem',
			margin: '0 auto',
		},
		poemBox: {
			whiteSpace: 'pre-line',
			backgroundColor: 'white',
			padding: '0.75rem',
			borderRadius: '0.25rem',
			overflow: 'auto',
			maxHeight: '24rem',
			minHeight: '12rem',
		},
		flex: {
			display: 'flex',
			gap: '1rem',
			flexWrap: 'wrap',
			justifyContent: 'center',
		},
		textCenter: { textAlign: 'center' },
		title: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' },
		sectionTitle: { fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.75rem', textAlign: 'center' },
		authorText: {
			fontSize: '0.875rem',
			color: colors.textMedium,
		},
	};

	return (
		<div>
			<BackButton onClick={onBackClick} text="Back to Painting" />
			<div style={styles.container}>
				<h2 style={styles.title}>{pairing.basis} Pairing</h2>
				<div style={styles.flex}>
					<div style={styles.section}>
						<h3 style={styles.sectionTitle}>Painting</h3>
						<div style={styles.imageWrapper}>
							<img
								src={imageUrl}
								alt={painting.title}
								style={styles.image}
							/>
						</div>
						<div style={styles.textCenter}>
							<h4 style={{ fontWeight: 500 }}>{painting.title}</h4>
							<p style={styles.authorText}>
								{painting.author}, {painting.year}
							</p>
						</div>
					</div>

					<div style={styles.section}>
						<h3 style={styles.sectionTitle}>Poem</h3>
						<div style={styles.poemBox}>
							{pairing.poem.content}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PairingDetail;