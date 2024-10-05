import React from 'react'
import styled from 'styled-components';

function Blob() {
  return (
    <BlobContainer>
        <div className='blob'></div>
        <div className='blob1'></div>
    </BlobContainer>
  )
}

const BlobContainer = styled.div`

.blob, .blob1 {
        display: flex;
        position: absolute;
        z-index: 0;
        opacity: 50%;
        background: linear-gradient(to right, #6a00ff6b, #f200ff8f);
        border-radius: 28% 72% 47% 53% / 85% 28% 72% 15%;
        animation: moveBlob 120s infinite alternate ease-in-out;
    }
    
.blob {
        top: 10px;
        height: 50rem;
        width: 50rem;
    }

    .blob1 {
        top: 10px;
        height: 30rem;
        width: 30rem;
        border-radius: 66% 34% 22% 78% / 47% 47% 53% 53%;
        animation: moveBlob1 100s infinite alternate ease-in-out;
    }

    @keyframes moveBlob {
        0% { transform: translate(10vw, 0); }
        25% { transform: translate(50vw, -20vh) rotate(160deg); }
        50% { transform: translate(-40vw, 30vh) rotate(100deg); }
        75% { transform: translate(30vw, 20vh) rotate(70deg); }
        100% { transform: translate(-50vw, -30vh) rotate(30deg); }
    }

    @keyframes moveBlob1 {
        0% { transform: translate(-10vw, 0); }
        25% { transform: translate(-50vw, -30vh) rotate(160deg); }
        50% { transform: translate(30vw, 20vh) rotate(100deg); }
        75% { transform: translate(-40vw, 30vh) rotate(70deg); }
        100% { transform: translate(50vw, -20vh) rotate(50deg); }
    }

    @media (max-width: 700px) {
        .blob, .blob1 {
            height: 15rem;
            width: 15rem;
        }
      }
`

export default Blob