import React, { useEffect } from 'react';
import PaintingCard from './PaintingCard';

function Gallery({
	painting,
	loading,
	onPaintingClick,
	onNext,
	onPrevious,
	hasNext,
	hasPrevious,
	currentIndex,
	totalPaintings,
	paintingsCache
}) {
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'ArrowLeft' && hasPrevious) {
				onPrevious();
			}
			if (e.key === 'ArrowRight' && hasNext) {
				onNext();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [hasPrevious, hasNext, onPrevious, onNext]);

	const styles = {
		container: {
			position: 'relative',
			maxWidth: '1200px',
			margin: '0 auto',
			textAlign: 'center',
			fontFamily: 'Helvetica, Arial, sans-serif',
		},
		carousel: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			gap: '2rem',
			position: 'relative',
			padding: '2rem 0',
		},
		cardMain: {
			transform: 'scale(1)',
			transition: 'transform 0.3s ease, opacity 0.3s ease',
			zIndex: 2,
		},
		cardSideBase: {
			transition: 'transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease',
			cursor: 'pointer',
			zIndex: 0,
		},
		navigation: {
			display: 'flex',
			justifyContent: 'space-between',
			marginTop: '1rem',
		},
		button: (enabled) => ({
			fontSize: '1.875rem',
			fontWeight: 'bold',
			padding: '0.5rem 1.5rem',
			borderRadius: '9999px',
			cursor: enabled ? 'pointer' : 'not-allowed',
			color: enabled ? '#374151' : '#d1d5db',
			background: 'none',
			border: 'none',
			transition: 'color 0.2s ease',
		}),
		loadingWrapper: {
			textAlign: 'center',
			padding: '2rem',
			fontFamily: 'Helvetica, Arial, sans-serif',
		},
		spinner: {
			width: '2rem',
			height: '2rem',
			borderTop: '4px solid #3b82f6',
			borderBottom: '4px solid #3b82f6',
			borderRadius: '50%',
			animation: 'spin 1s linear infinite',
			margin: '0 auto 1rem',
		},
	};

	if (loading) {
		return (
			<div style={styles.loadingWrapper}>
				<div style={styles.spinner}></div>
				<p>Loading gallery...</p>
				<style>{`
					@keyframes spin {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
				`}</style>
			</div>
		);
	}

	const prevPainting = hasPrevious ? paintingsCache[currentIndex - 1] : null;
	const nextPainting = hasNext ? paintingsCache[currentIndex + 1] : null;

	return (
		<div style={styles.container}>
			<div style={styles.carousel}>
				{prevPainting && (
					<div
						style={{
							...styles.cardSideBase,
							transform: 'scale(0.75) translateX(-40px)',
							opacity: 0.4,
							filter: 'brightness(0.7) blur(1px)',
						}}
						onClick={onPrevious}
					>
						<PaintingCard painting={prevPainting} />
					</div>
				)}

				<div style={styles.cardMain}>
					<PaintingCard
						painting={painting}
						onClick={() => onPaintingClick(painting.id)}
					/>
				</div>

				{nextPainting && (
					<div
						style={{
							...styles.cardSideBase,
							transform: 'scale(0.75) translateX(40px)',
							opacity: 0.4,
							filter: 'brightness(0.7) blur(1px)',
						}}
						onClick={onNext}
					>
						<PaintingCard painting={nextPainting} />
					</div>
				)}
			</div>

			<div style={styles.navigation}>
				<button
					onClick={onPrevious}
					disabled={!hasPrevious}
					style={styles.button(hasPrevious)}
					onMouseOver={(e) => {
						if (hasPrevious) e.target.style.color = '#3b82f6';
					}}
					onMouseOut={(e) => {
						if (hasPrevious) e.target.style.color = '#374151';
					}}
					aria-label="Previous"
				>
					&lt;
				</button>
				<button
					onClick={onNext}
					disabled={!hasNext}
					style={styles.button(hasNext)}
					onMouseOver={(e) => {
						if (hasNext) e.target.style.color = '#3b82f6';
					}}
					onMouseOut={(e) => {
						if (hasNext) e.target.style.color = '#374151';
					}}
					aria-label="Next"
				>
					&gt;
				</button>
			</div>
		</div>
	);
}

export default Gallery;