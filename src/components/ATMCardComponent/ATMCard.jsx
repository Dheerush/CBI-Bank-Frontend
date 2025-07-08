import React from 'react';
import styled from 'styled-components';
import { useMainContext } from '@/context/MainContext';

const ATMCard = () => {
  const { user } = useMainContext();
  if (!user) return null;
  return (
    <StyledWrapper>
      <div className="card">
        <div className="card__info">
          <div className="card__logo text-teal-400">CBI Bank</div>
          <div className="card__chip">
            <svg className="card__chip-lines" role="img" width="20px" height="20px" viewBox="0 0 100 100" aria-label="Chip">
              <g opacity="0.8">
                <polyline points="0,50 35,50" fill="none" stroke="#000" strokeWidth={2} />
                <polyline points="0,20 20,20 35,35" fill="none" stroke="#000" strokeWidth={2} />
                <polyline points="50,0 50,35" fill="none" stroke="#000" strokeWidth={2} />
                <polyline points="65,35 80,20 100,20" fill="none" stroke="#000" strokeWidth={2} />
                <polyline points="100,50 65,50" fill="none" stroke="#000" strokeWidth={2} />
                <polyline points="35,35 65,35 65,65 35,65 35,35" fill="none" stroke="#000" strokeWidth={2} />
                <polyline points="0,80 20,80 35,65" fill="none" stroke="#000" strokeWidth={2} />
                <polyline points="50,100 50,65" fill="none" stroke="#000" strokeWidth={2} />
                <polyline points="65,65 80,80 100,80" fill="none" stroke="#000" strokeWidth={2} />
              </g>
            </svg>
            <div className="card__chip-texture" />
          </div>
          <div className="card__type mb-2">Platinum Debit</div>
          <div className="card__number">
            <span className="card__digit-group">5267</span>
            <span className="card__digit-group">3181</span>
            <span className="card__digit-group">8797</span>
            <span className="card__digit-group">5449</span>
          </div>
          <div className="card__cvv">CVV: 475</div>
          <div className="card__valid-thru" aria-label="Valid thru">Valid<br />thru</div>
          <div className="card__exp-date"><time dateTime="2038-01">01/38</time></div>
          <div className="card__name" aria-label="Cardholder Name">{user.name}</div>
          <div className="card__vendor" role="img" aria-labelledby="card-vendor">
            <span id="card-vendor" className="card__vendor-sr">Mastercard</span>
          </div>
          <div className="card__texture" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card,
  .card__chip {
    overflow: hidden;
    position: relative;
  }

  .card,
  .card__chip-texture,
  .card__texture {
    animation-duration: 3s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }

  .card {
    animation-name: rotate_500;
    background-color: var(--primary, #003566);
    background-image: radial-gradient(circle at top left, rgba(255,255,255,0.08) 30%, transparent 30%),
                      radial-gradient(circle at bottom right, rgba(255,255,255,0.1) 30%, transparent 30%);
    border-radius: 0.5em;
    box-shadow: 0 0 0 hsl(0,0%,80%),
                0 0 0 hsl(0,0%,50%),
                -0.2rem 0 0.75rem 0 hsla(0,0%,0%,0.3);
    color: hsl(0,0%,100%);
    width: 16.81em;
    height: 11em; /* Increased height */
    transform: translate3d(0,0,0);
  }

  .card__info,
  .card__chip-texture,
  .card__texture {
    position: absolute;
  }

  .card__chip-texture,
  .card__texture {
    animation-name: texture;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
  }

  .card__info {
    font: 0.97em/1 "DM Sans", sans-serif;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0.75rem;
    inset: 0;
  }

  .card__logo,
  .card__number {
    width: 100%;
  }

  .card__logo {
    font-weight: bold;
    font-style: italic;
  }

  .card__chip {
    background-image: linear-gradient(hsl(45, 100%, 60%), hsl(45, 100%, 70%));
    border-radius: 0.2rem;
    box-shadow: 0 0 0 0.05rem hsla(0,0%,0%,0.5) inset;
    width: 1.5rem;
    height: 1.25rem;
    transform: translate3d(0,0,0);
  }

  .card__chip-lines {
    width: 100%;
    height: auto;
  }

  .card__chip-texture {
    background-image: linear-gradient(-80deg,hsla(0,0%,100%,0),hsla(0,0%,100%,0.6) 48% 52%,hsla(0,0%,100%,0));
  }

  .card__type {
    align-self: flex-end;
    margin-left: auto;
  }

  .card__digit-group,
  .card__exp-date,
  .card__name {
    background: linear-gradient(hsl(0,0%,100%),hsl(0,0%,85%) 15% 55%,hsl(0,0%,70%) 70%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: "Courier Prime", monospace;
    filter: drop-shadow(0 0.05rem hsla(0,0%,0%,0.3));
  }

  .card__number {
    font-size: 1.2rem;
    display: flex;
    justify-content: space-between;
  }

  .card__cvv {
    font-size: 0.9rem;
    width: 100%;
    margin-top: 0.50rem;
    margin-bottom: 0.50rem;
    font-family: "Courier Prime", monospace;
    color: #fff;
    opacity: 0.85;
    letter-spacing: 0.05rem;
  }

  .card__valid-thru,
  .card__name {
    text-transform: uppercase;
  }

  .card__valid-thru,
  .card__exp-date {
    margin-bottom: 0.25rem;
    width: 40%;
  }

  .card__valid-thru {
    font-size: 0.7rem;
    padding-right: 0.25rem;
    text-align: right;
  }

  .card__exp-date,
  .card__name {
    font-size: 1.1rem;
  }

  .card__exp-date {
    padding-left: 0.25rem;
  }

  .card__name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 10.25rem;
  }

  .card__vendor,
  .card__vendor:before,
  .card__vendor:after {
    position: absolute;
  }

  .card__vendor {
    right: 0.375rem;
    bottom: 0.375rem;
    width: 2.55rem;
    height: 1.5rem;
  }

  .card__vendor:before,
  .card__vendor:after {
    border-radius: 50%;
    content: "";
    display: block;
    top: 0;
    width: 1.5rem;
    height: 1.5rem;
  }

  .card__vendor:before {
    background-color: #e71d1a;
    left: 0;
  }

  .card__vendor:after {
    background-color: #fa5e03;
    box-shadow: -1.05rem 0 0 #f59d1a inset;
    right: 0;
  }

  .card__vendor-sr {
    clip: rect(1px,1px,1px,1px);
    overflow: hidden;
    position: absolute;
    width: 1px;
    height: 1px;
  }

  .card__texture {
    animation-name: texture;
    background-image: linear-gradient(-80deg,hsla(0,0%,100%,0.3) 25%,hsla(0,0%,100%,0) 45%);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: hsl(var(--hue),10%,30%);
      --fg: hsl(var(--hue),10%,90%);
    }
  }

  @keyframes rotate_500 {
    from, to {
      animation-timing-function: ease-in;
      box-shadow: 0 0 0 hsl(0,0%,80%),
                  0.1rem 0 0 hsl(0,0%,100%),
                  -0.2rem 0 0.75rem 0 hsla(0,0%,0%,0.3);
      transform: rotateY(-10deg);
    }

    25%, 75% {
      animation-timing-function: ease-out;
      box-shadow: 0 0 0 hsl(0,0%,80%),
                  0 0 0 hsl(0,0%,100%),
                  -0.25rem -0.05rem 1rem 0.15rem hsla(0,0%,0%,0.3);
      transform: rotateY(0deg);
    }

    50% {
      animation-timing-function: ease-in;
      box-shadow: -0.1rem 0 0 hsl(0,0%,80%),
                  0 0 0 hsl(0,0%,100%),
                  -0.3rem -0.1rem 1.5rem 0.3rem hsla(0,0%,0%,0.3);
      transform: rotateY(10deg);
    }
  }

  @keyframes texture {
    from, to {
      transform: translate3d(0,0,0);
    }
    50% {
      transform: translate3d(-50%,0,0);
    }
  }
`;

export default ATMCard;