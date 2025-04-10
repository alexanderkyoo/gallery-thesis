import React, { useState, useEffect } from "react";
import StartPage from './components/StartPage';
import Gallery from './components/Gallery';
import PaintingDetail from './components/PaintingDetail';
import PairingDetail from './components/PairingDetail';
import './App.css';

function App() {
  const [currentPainting, setCurrentPainting] = useState(null);
  const [painting, setPainting] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indexLoading, setIndexLoading] = useState(true);
  const [paintingNumber, setPaintingNumber] = useState(null);
  const [selectedPairing, setSelectedPairing] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paintingsCache, setPaintingsCache] = useState([]);
  const [view, setView] = useState('start');
  
  const fetchAllPaintings = async () => {
    const limit = 20;
    const totalToLoad = 100;
    const totalPages = Math.ceil(totalToLoad / limit);
  
    for (let page = 1; page <= totalPages; page++) {
      try {
        const response = await fetch(`http://localhost:8000/api/index?page=${page}&limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
  
          if (page === 1) {
            setCurrentPainting(data.paintings[0]);
            setCurrentIndex(0);
            setPaintingsCache(data.paintings);
            setIndexLoading(false);
          } else {
            setPaintingsCache(prev => {
              const updated = [...prev, ...data.paintings];
              return updated;
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
      }
    }
  };
  
  const fetchPainting = async (number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/painting/${number}`);
      if (response.ok) {
        const data = await response.json();
        setPainting(data.painting);
        setImageUrl(data.image_url);
        setView('painting');
      } else {
        setPainting(null);
        setImageUrl(null);
      }
    } catch (error) {
      setPainting(null);
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'gallery' && paintingsCache.length === 0) {
      fetchAllPaintings();
    }
  }, [view]);

  useEffect(() => {
    if (paintingNumber !== null) {
      fetchPainting(paintingNumber);
    }
  }, [paintingNumber]);

  const handleEnterGallery = () => {
    setView('gallery');
  };

  const handlePaintingClick = (id) => {
    setPaintingNumber(id);
  };

  const handleBackToGallery = () => {
    setView('gallery');
  };
  
  const handleBackToPainting = () => {
    setView('painting');
  };

  const handlePairingClick = (pairing) => {
    setSelectedPairing(pairing);
    setView('pairing');
  };

  const nextPainting = () => {
    if (currentIndex < paintingsCache.length - 1) {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        setCurrentPainting(paintingsCache[newIndex]);
        return newIndex;
      });
    }
  };
  
  const previousPainting = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex - 1;
        setCurrentPainting(paintingsCache[newIndex]);
        return newIndex;
      });
    }
  };

  const renderView = () => {
    switch(view) {
      case 'start':
        return <StartPage onEnterClick={handleEnterGallery} />;
      case 'gallery':
        return (
          <Gallery 
            painting={currentPainting} 
            paintingsCache={paintingsCache}
            loading={indexLoading} 
            onPaintingClick={handlePaintingClick}
            onNext={nextPainting}
            onPrevious={previousPainting}
            hasNext={currentIndex < paintingsCache.length - 1}
            hasPrevious={currentIndex > 0}
            currentIndex={currentIndex}
            totalPaintings={paintingsCache.length}
          />
        );
      case 'painting':
        return (
          <PaintingDetail 
            painting={painting} 
            imageUrl={imageUrl} 
            loading={loading} 
            onBackClick={handleBackToGallery}
            onPairingClick={handlePairingClick}
          />
        );
      case 'pairing':
        return (
          <PairingDetail
            painting={painting}
            imageUrl={imageUrl}
            pairing={selectedPairing}
            onBackClick={handleBackToPainting}
          />
        );
      default:
        return <StartPage onEnterClick={handleEnterGallery} />;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {view !== 'start' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            fontFamily: 'Helvetica, Arial, sans-serif',
            textAlign: 'center',
            whiteSpace: 'pre-wrap'
          }}>
            {'THE PAIRING GALLERY'.split('').map((char, i) => (
              <span
                key={i}
                className="wave-letter"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>
      )}

      {renderView()}
    </div>
  );
}

export default App;