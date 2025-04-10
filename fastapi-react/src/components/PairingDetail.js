import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';

function PairingDetail({ painting, imageUrl, pairing, onBackClick }) {
	const [poemLoading, setPoemLoading] = useState(true);
	const [imageLoading, setImageLoading] = useState(true);

	useEffect(() => {
		if (pairing?.poem?.content) {
			setPoemLoading(false);
		} else {
			setPoemLoading(true);
			const timer = setTimeout(() => setPoemLoading(false), 1000);
			return () => clearTimeout(timer);
		}
	}, [pairing]);

	const styles = {
		container: {
			maxWidth: '1000px',
			margin: '0 auto',
			padding: '1rem',
			fontFamily: 'Helvetica, Arial, sans-serif',
		},
		section: {
			flex: '1 1 45%',
			backgroundColor: '#f8fafc',
			padding: '1rem',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
		},
		imageWrapper: {
			marginBottom: '0.75rem',
			position: 'relative',
			textAlign: 'center',
		},
		image: {
			borderRadius: '0.25rem',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
			maxWidth: '100%',
			maxHeight: '24rem',
			margin: '0 auto',
			transition: 'opacity 300ms',
		},
		placeholder: {
			backgroundColor: '#e2e8f0',
			height: '12rem',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: '0.25rem',
		},
		poemBox: {
			whiteSpace: 'pre-line',
			backgroundColor: 'white',
			padding: '0.75rem',
			borderRadius: '0.25rem',
			overflow: 'auto',
			maxHeight: '24rem',
			position: 'relative',
			minHeight: '12rem',
		},
		loadingSpinner: {
			width: '2rem',
			height: '2rem',
			border: '4px solid #3b82f6',
			borderTopColor: 'transparent',
			borderRadius: '50%',
			animation: 'spin 1s linear infinite',
		},
		loadingOverlay: {
			position: 'absolute',
			inset: 0,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: 'rgba(255, 255, 255, 0.8)',
		},
		textCenter: { textAlign: 'center' },
		grayText: { color: '#718096' },
		title: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' },
		sectionTitle: { fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.75rem', textAlign: 'center' },
	};

	if (!painting || !pairing) {
		return (
			<div>
				<BackButton onClick={onBackClick} text="Back to Painting" />
				<div style={{
					textAlign: 'center',
					padding: '2rem',
					backgroundColor: '#f7fafc',
					borderRadius: '0.5rem',
					boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
				}}>
					<svg style={{
						width: '3rem',
						height: '3rem',
						color: '#a0aec0',
						margin: '0 auto 1rem auto'
					}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h3 style={{
						fontSize: '1.125rem',
						fontWeight: 500,
						color: '#4a5568',
						marginBottom: '0.5rem'
					}}>Pairing Not Found</h3>
					<p style={styles.grayText}>The requested pairing information could not be located.</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<BackButton onClick={onBackClick} text="Back to Painting" />
			<div style={styles.container}>
				<h2 style={styles.title}>{pairing.basis} Pairing</h2>
				<div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
					{/* Painting */}
					<div style={styles.section}>
						<h3 style={styles.sectionTitle}>Painting</h3>
						<div style={styles.imageWrapper}>
							{imageUrl ? (
								<>
									<img
										src={imageUrl}
										alt={painting.title}
										style={{ ...styles.image, opacity: imageLoading ? 0.6 : 1 }}
										onLoad={() => setImageLoading(false)}
									/>
									{imageLoading && (
										<div style={styles.loadingOverlay}>
											<div style={styles.loadingSpinner}></div>
										</div>
									)}
								</>
							) : (
								<div style={styles.placeholder}>
									<svg style={{ width: '3rem', height: '3rem', color: '#a0aec0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							)}
						</div>
						<div style={styles.textCenter}>
							<h4 style={{ fontWeight: 500 }}>{painting.title}</h4>
							<p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
								{painting.author}, {painting.year}
							</p>
						</div>
					</div>

					{/* Poem */}
					<div style={styles.section}>
						<h3 style={styles.sectionTitle}>Poem</h3>
						<div style={styles.poemBox}>
							{poemLoading ? (
								<div style={styles.loadingOverlay}>
									<div style={{ textAlign: 'center' }}>
										<div style={styles.loadingSpinner}></div>
										<p style={{ color: '#4b5563' }}>Loading poem...</p>
									</div>
								</div>
							) : pairing.poem.content ? (
								<div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
									{pairing.poem.content}
								</div>
							) : (
								<div style={styles.textCenter}>
									<svg style={{
										width: '2.5rem',
										height: '2.5rem',
										margin: '0 auto 0.5rem auto',
										color: '#a0aec0'
									}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
									<p>Poem content could not be loaded</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
			`}</style>
		</div>
	);
}

export default PairingDetail;
