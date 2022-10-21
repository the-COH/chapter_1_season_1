import Typewriter from "typewriter-effect";

interface MinMax {
  min: number;
  max: number;
}

function getRandomInt(opts: MinMax) {
  const min = Math.floor(opts.min);
  const max = Math.ceil(opts.max);

  return Math.floor(Math.random() * (max - min) + min);
}

const typingDelayMinMax = { min: 75, max: 150 };
const pauseMinMax = { min: 444, max: 999 };

export const TitleTyping = () => {
  return (
    <>
      <h1 className="font-modeseven text-5xl font-extrabold leading-normal text-cantoGreen md:text-[5rem]">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .changeDelay(getRandomInt(typingDelayMinMax))
              .typeString("Canto")
              .pauseFor(getRandomInt(pauseMinMax))
              .changeDelay(getRandomInt(typingDelayMinMax))
              .typeString(" NaMe")
              .pauseFor(getRandomInt(pauseMinMax))
              .deleteChars(2)
              .pauseFor(getRandomInt(pauseMinMax))
              .changeDelay(getRandomInt(typingDelayMinMax))
              .typeString("me")
              .pauseFor(getRandomInt(pauseMinMax))
              .typeString(" Service")
              .pauseFor(getRandomInt(pauseMinMax))
              .deleteAll()
              .changeDelay(getRandomInt(typingDelayMinMax))
              .typeString("canto")
              .changeDelay(getRandomInt(typingDelayMinMax))
              .typeString(" name")
              .changeDelay(getRandomInt(typingDelayMinMax))
              .typeString(" service")
              .start();
          }}
          options={{
            cursor: "_",
          }}
        />
      </h1>
    </>
  );
};
