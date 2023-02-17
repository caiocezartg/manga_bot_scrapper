export function transformScore(score) {
  const scoreNumber = Math.floor(Number(score)) / 2;
  let stars = "";

  for (let i = 0; i < scoreNumber; i++) {
    stars += "⭐";
  }

  return stars;
}
