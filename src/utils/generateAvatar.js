import blockies from "ethereum-blockies";

const generateAvatar = (seed) => {
  const icon = blockies.create({
    seed: seed,
    size: 37,
    scale: 1,
  });

  return icon;
};

export default generateAvatar;
