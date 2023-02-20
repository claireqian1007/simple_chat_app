const generateDiceBearAdventurer = (seed: number) => `https://api.dicebear.com/5.x/adventurer-neutral/svg?seed=${seed}`

const generateDiceBearEmoji = (seed: number) => `https://api.dicebear.com/5.x/fun-emoji/svg?seed=${seed}`

const generateDiceBearLorelei = (seed: number) => `https://api.dicebear.com/5.x/lorelei/svg?seed=${seed}`

export const generateAvatar = () => {
  const data = []

  for (let i = 0; i < 2; i++) {
    const res = generateDiceBearAdventurer(Math.random())
    data.push(res)
  }
  for (let i = 0; i < 2; i++) {
    const res = generateDiceBearEmoji(Math.random())
    data.push(res)
  }
  for (let i = 0; i < 2; i++) {
    const res = generateDiceBearLorelei(Math.random())
    data.push(res)
  }
  return data
}
