import React from 'react';
import PoemCard from './PoemCard';

function PoemList({ pairings }) {
  return (
    <div>
      <h3 style={{
        fontSize: "1.25rem",
        fontWeight: 600,
        marginBottom: "1rem"
      }}>Paired Poems</h3>
      
      <div style={{ marginTop: "1.5rem" }}>
        {pairings.map((pairing) => (
          <div key={pairing.id} style={{ marginBottom: "1.5rem" }}>
            <PoemCard pairing={pairing} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PoemList;