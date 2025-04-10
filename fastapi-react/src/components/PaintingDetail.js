import React from 'react';
import BackButton from './BackButton';

const styles = {
	container: {
		maxWidth: '700px',
		margin: '0 auto',
		textAlign: 'center',
		fontFamily: 'Helvetica, Arial, sans-serif',
	},
	title: {
		fontSize: '1.25rem',
		fontWeight: 600,
		marginBottom: '1rem',
	},
	image: {
		maxWidth: '100%',
		height: 'auto',
		margin: '0 auto',
		boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
		borderRadius: '0.25rem',
		transition: 'opacity 0.3s ease',
		opacity: 1,
	},
	imagePlaceholder: {
		backgroundColor: '#edf2f7',
		height: '16rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: '0.25rem',
	},
	infoBlock: {
		marginBottom: '1.5rem',
		fontSize: '1rem',
	},
	infoLink: {
		color: '#3182ce',
		textDecoration: 'none',
	},
	pairingSection: {
		marginTop: '1.5rem',
	},
	pairingTitle: {
		fontSize: '1.125rem',
		fontWeight: 600,
		marginBottom: '0.75rem',
	},
	pairingButtons: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: '0.75rem',
		justifyContent: 'center',
	},
	button: {
		padding: '0.5rem 1rem',
		backgroundColor: '#e29a47',
		color: 'rgb(55, 37, 68)',
		borderRadius: '0.375rem',
		border: 'none',
		cursor: 'pointer',
		fontFamily: 'Helvetica, Arial, sans-serif',
		fontSize: '1rem',
		transition: 'background-color 0.2s ease',
		boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
	},
	noPairings: {
		marginTop: '1.5rem',
		padding: '1rem',
		backgroundColor: '#f7fafc',
		borderRadius: '0.25rem',
		color: '#718096',
	},
};

function PaintingDetail({ painting, imageUrl, onBackClick, onPairingClick }) {
	if (!painting) return null;

	const getPairingsByBasis = () => {
		if (!painting.pairings || painting.pairings.length === 0) return {};
		const byBasis = {};
		painting.pairings.forEach(pairing => {
			if (!byBasis[pairing.basis]) {
				byBasis[pairing.basis] = [];
			}
			byBasis[pairing.basis].push(pairing);
		});
		return byBasis;
	};

	const pairingsByBasis = getPairingsByBasis();
	const basisTypes = Object.keys(pairingsByBasis);

	return (
		<div>
			<BackButton onClick={onBackClick} text="Back to Gallery" />

			<div style={styles.container}>
				<h2 style={styles.title}>{painting.title}</h2>

				<div style={{ marginBottom: '1.5rem' }}>
					{imageUrl ? (
						<img
							src={imageUrl}
							alt={painting.title}
							style={styles.image}
						/>
					) : (
						<div style={styles.imagePlaceholder}>
							<svg style={{ width: '4rem', height: '4rem', color: '#a0aec0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p style={{ marginLeft: '0.5rem' }}>No image available</p>
						</div>
					)}
				</div>

				<div style={styles.infoBlock}>
					<p><strong>Author:</strong> {painting.author}</p>
					<p><strong>Year:</strong> {painting.year}</p>
					<p><strong>Category:</strong> {painting.category}</p>
					{painting.info_url && (
						<p style={{ marginTop: '0.5rem' }}>
							<a
								href={painting.info_url}
								target="_blank"
								rel="noopener noreferrer"
								style={styles.infoLink}
								onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
								onMouseOut={(e) => e.target.style.textDecoration = 'none'}
							>
								More Info
							</a>
						</p>
					)}
				</div>

				{basisTypes.length > 0 ? (
					<div style={styles.pairingSection}>
						<h3 style={styles.pairingTitle}>Available Pairings</h3>
						<div style={styles.pairingButtons}>
							{basisTypes.map(basis => (
								<button
									key={basis}
									onClick={() => onPairingClick(pairingsByBasis[basis][0])}
									style={styles.button}
									onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc6e08')}
									onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e29a47')}
								>
									{basis} Pairing
								</button>
							))}
						</div>
					</div>
				) : (
					<div style={styles.noPairings}>
						<p>No poem pairings available</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default PaintingDetail;