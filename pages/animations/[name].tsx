import type { NextPage } from "next";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Router, { useRouter } from "next/router";
import useSWR from "swr";

type animationType = {
  name: string;
  start: {
    col: number;
    row: number;
  };
  frameCount: number;
};

type animationStatesType = { [key: string]: animationType };

type framesType = { loc: { x: number; y: number }[] };
const fetcher = async (url: string): Promise<animationStatesType> => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const Person: NextPage = () => {
  const isLogIn = useMemo(() => !!localStorage?.getItem("token"), []);
  const canvasRef = useRef<HTMLCanvasElement>();
  const { query } = useRouter();
  const { data: animationStates, error } = useSWR(
    () => query.name && `/api/getAnimation/${query.name}`,
    fetcher
  );

  const spriteAnimations: {
    [key: string]: framesType;
  } = {};
  const [scale, setScale] = useState<number>(2);
  const [staggerFrames, setStaggerFrames] = useState<number>(20); // control speed
  const [rotate, setRotate] = useState<number>(0);
  var stopAnimation: boolean = false;
  var cancelAnimation: boolean = false;

  const spriteWidth = 50;
  const spriteHeight = 37;
  let gameFrame = 0;

  useEffect(() => {
    if (
      animationStates &&
      query.name &&
      !spriteAnimations[query.name as string]
    ) {
      Router.push({ pathname: "/animations/Idle" });
    }
  }, [query.name, spriteAnimations]);

  if (animationStates) {
    Object.entries(animationStates).forEach(([, value]) => {
      let frames: { loc: { x: number; y: number }[] } = {
        loc: [],
      };

      let row = value.start.row;
      let col = value.start.col;

      for (let j = 0; j < value.frameCount; j++) {
        let positionX = 0;

        if (col >= 7) {
          col = 0;
          row++;
        } else {
          positionX = (col % 7) * spriteWidth;
        }
        let positionY = row * spriteHeight;
        frames.loc.push({ x: positionX, y: positionY });
        col++;
      }
      spriteAnimations[value.name] = frames;
    });
  }
  useEffect(() => {
    cancelAnimation = false;
    const playerImage: HTMLImageElement = new window.Image();
    playerImage.src = "/sprite_sheet.png";

    const canvas = canvasRef.current;
    if (canvas && query.name) {
      canvas.id = "canvas";

      const ctx: CanvasRenderingContext2D | any = canvas.getContext("2d");

      const CANVAS_WIDTH = (canvas.width = 600);
      const CANVAS_HEIGHT = (canvas.height = 600);
      const animationName = query.name as string;
      if (ctx && animationName) {
        const animate = () => {
          const position =
            Math.floor(gameFrame / staggerFrames) %
            spriteAnimations[animationName].loc.length;
          const frameX = spriteAnimations[animationName].loc[position].x;
          const frameY = spriteAnimations[animationName].loc[position].y;
          const scaledSpriteWidth = spriteWidth * scale;
          const scaledspriteHeight = spriteHeight * scale;

          ctx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx?.drawImage(
            playerImage, //  image
            frameX, // source x-coordinate
            frameY, // source y-coordinate
            spriteWidth, // source width
            spriteHeight, // source height
            (CANVAS_WIDTH - scaledSpriteWidth) / 2, // destination x-coordinate
            (CANVAS_HEIGHT - scaledspriteHeight) / 2, // destination y-coordinate
            scaledSpriteWidth, // destination width
            scaledspriteHeight //destination height
          );

          if (!stopAnimation) {
            gameFrame++;
          }

          if (cancelAnimation) {
            return;
          }
          requestAnimationFrame(animate);
        };
        animate();
      }
    }
  }, [animationStates, scale, staggerFrames]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.transform = `rotate(${rotate}deg)`;
    }

    if (rotate > 360) {
      setRotate((rotate) => rotate % 360);
    }
  }, [rotate]);

  if (error) return <div>{error.message}</div>;
  if (!animationStates) return <div>Loading...</div>;

  function handleChangeAnimation(event: { target: { value: string } }) {
    Router.push({ pathname: "/animations/" + event.target.value });
    cancelAnimation = true;
  }

  function handleChangeScale(event: { target: { value: string } }) {
    setScale(parseInt(event.target.value));
    cancelAnimation = true;
  }

  function handleChangeSpeed(event: { target: { value: string } }) {
    setStaggerFrames(parseInt(event.target.value));
    cancelAnimation = true;
  }

  function handleRotate(event: { target: { value: string } }) {
    setRotate(parseInt(event.target.value));
  }

  function handleFlip() {
    setRotate(rotate + 180);
  }

  function handlePlayPause() {
    stopAnimation = !stopAnimation;
  }

  function handleLogOut() {
    localStorage.removeItem("token");
    Router.push({ pathname: "/" });
  }

  function handleLogin() {
    Router.push({ pathname: "/" });
  }

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarCollapse"
        >
          {isLogIn ? (
            <button
              className="btn btn-primary my-2 my-sm-0"
              onClick={handleLogOut}
            >
              Log out
            </button>
          ) : (
            <>
              <a className="navbar-brand">Plz login to youse all features</a>
              <button
                className="btn btn-primary my-2 my-sm-0"
                onClick={handleLogin}
              >
                Login
              </button>
            </>
          )}
        </div>
      </nav>
      <div className="container">
        <div className="controls d-flex">
          <label htmlFor="animations">Choose Animation: </label>
          <select
            id="animations"
            name="animations"
            onChange={handleChangeAnimation}
            value={query.name}
          >
            {Object.entries(animationStates).map(([, value]) => (
              <option key={value.name} value={value.name}>
                {value.name}
              </option>
            ))}
          </select>
          {isLogIn && (
            <>
              <label htmlFor="scale">Choose Scale: </label>
              <select
                id="scale"
                name="scale"
                onChange={handleChangeScale}
                defaultValue={2}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>

              <label htmlFor="speed">Choose Speed: </label>
              <select
                id="speed"
                name="speed"
                onChange={handleChangeSpeed}
                defaultValue={20}
              >
                <option value={40}>0.5</option>
                <option value={20}>1</option>
                <option value={10}>1.5</option>
              </select>
              <label htmlFor="rotate">Choose Rotation: </label>
              <input
                id="rotate"
                name="rotate"
                onChange={handleRotate}
                value={rotate}
                type="number"
              />
              <input
                id="flip"
                name="flip"
                onClick={handleFlip}
                type="button"
                value="Flip"
              />
              <input
                type="button"
                value="Play/Pause"
                onClick={handlePlayPause}
              />
            </>
          )}
        </div>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Person;
