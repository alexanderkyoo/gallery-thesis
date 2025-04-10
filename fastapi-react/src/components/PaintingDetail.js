import React from 'react';
import BackButton from './BackButton';

function PaintingDetail({ painting, imageUrl, loading, onBackClick, onPairingClick }) {
	if (loading) {
		return (
			<div>
				<BackButton onClick={onBackClick} text="Back to Gallery" />
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '3rem',
					fontFamily: 'Helvetica, Arial, sans-serif',
					color: '#1a202c',
				}}>
					<div style={{
						width: '4rem',
						height: '4rem',
						border: '4px solid #3b82f6',
						borderTopColor: 'transparent',
						borderRadius: '50%',
						animation: 'spin 1s linear infinite',
						marginBottom: '1rem',
					}}></div>
					<p style={{ fontSize: '1.125rem' }}>Loading painting details...</p>
				</div>
				<style>{`
					@keyframes spin {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
				`}</style>
			</div>
		);
	}

	if (!painting) {
		return (
			<div>
				<BackButton onClick={onBackClick} text="Back to Gallery" />
				<div style={{
					textAlign: 'center',
					padding: '2rem',
					backgroundColor: '#f7fafc',
					borderRadius: '0.5rem',
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
					fontFamily: 'Helvetica, Arial, sans-serif'
				}}>
					<svg style={{
						width: '3rem',
						height: '3rem',
						color: '#cbd5e0',
						margin: '0 auto 1rem'
					}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#4a5568', marginBottom: '0.5rem' }}>
						Painting Not Found
					</h3>
					<p style={{ color: '#718096' }}>
						The requested painting could not be located in our gallery.
					</p>
				</div>
			</div>
		);
	}

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

			<div style={{
				maxWidth: '700px',
				margin: '0 auto',
				textAlign: 'center',
				fontFamily: 'Helvetica, Arial, sans-serif',
			}}>
				<h2 style={{
					fontSize: '1.25rem',
					fontWeight: 600,
					marginBottom: '1rem'
				}}>{painting.title}</h2>

				<div style={{ marginBottom: '1.5rem' }}>
					{imageUrl ? (
						<div style={{ position: 'relative' }}>
							<img
								src={imageUrl}
								alt={painting.title}
								style={{
									maxWidth: '100%',
									height: 'auto',
									margin: '0 auto',
									boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
									borderRadius: '0.25rem',
									opacity: 0.9,
									transition: 'opacity 0.3s ease'
								}}
								onLoad={(e) => e.target.style.opacity = 1}
							/>
						</div>
					) : (
						<div style={{
							backgroundColor: '#edf2f7',
							height: '16rem',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: '0.25rem'
						}}>
							<svg style={{ width: '4rem', height: '4rem', color: '#a0aec0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p style={{ marginLeft: '0.5rem' }}>No image available</p>
						</div>
					)}
				</div>

				<div style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
					<p><strong>Author:</strong> {painting.author}</p>
					<p><strong>Year:</strong> {painting.year}</p>
					<p><strong>Category:</strong> {painting.category}</p>
					{painting.info_url && (
						<p style={{ marginTop: '0.5rem' }}>
							<a
								href={painting.info_url}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: '#3182ce',
									textDecoration: 'none'
								}}
								onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
								onMouseOut={(e) => e.target.style.textDecoration = 'none'}
							>
								More Info
							</a>
						</p>
					)}
				</div>

				{basisTypes.length > 0 ? (
					<div style={{ marginTop: '1.5rem' }}>
						<h3 style={{
							fontSize: '1.125rem',
							fontWeight: 600,
							marginBottom: '0.75rem'
						}}>Available Pairings</h3>
						<div style={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: '0.75rem',
							justifyContent: 'center'
						}}>
							{basisTypes.map(basis => (
								<button
                                    key={basis}
                                    onClick={() => onPairingClick(pairingsByBasis[basis][0])}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#e29a47',
                                        color: 'rgb(55, 37, 68)',
                                        borderRadius: '0.375rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'Helvetica, Arial, sans-serif',
                                        fontSize: '1rem',
                                        transition: 'background-color 0.2s ease',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc6e08')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e29a47')}
                                >
                                    {basis} Pairing
                                </button>
							))}
						</div>
					</div>
				) : (
					<div style={{
						marginTop: '1.5rem',
						padding: '1rem',
						backgroundColor: '#f7fafc',
						borderRadius: '0.25rem'
					}}>
						<p style={{ color: '#718096' }}>No poem pairings available</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default PaintingDetail;