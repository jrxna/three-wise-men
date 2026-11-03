# Three Wise Men

A playful, fully client-side 3D fighting game. Choose Adarsh, Gabriel, or Joel, then choose a different friend as your computer opponent. Win two rounds to settle the Paripoorna hostel rivalry.

## Play

Open the game on a **touchscreen phone in portrait orientation**. Desktop keyboard play is disabled. Rotating to landscape pauses the match.

- Drag the left thumbstick: analog movement around the rooftop.
- Punch and Kick: tap for an attack, or hold to repeat when the fighter is ready.
- Block: hold to reduce incoming damage.
- Named move button: Guitar smash, Beer bash, or Laptop smash. It uses the energy bar, which recharges.
- Pause: take a break or return to fighter selection.

Sound starts on your first tap; there is no in-game mute control. Three difficulty levels change the opponent's speed and aggression. Fighters use rounded models with independent head, torso, hips, elbows, and knees. Walking uses a two-bone leg solver, punches alternate hands, kicks chamber and extend, and guarding uses a sustained forearm stance. Attacks have body wind-up, contact frames, and recoil. Guitar strings, laptop keys and lid, and a shattering beer mug give named moves distinct props and contact effects. Named moves pop up on screen with impact bursts. The game pauses when you leave its tab. Win two rounds to win the match.

### The fighters

- **Adarsh:** tall, slim, glasses and beard. Guitar smash.
- **Gabriel:** shorter, stockier, dark brown skin. Beer bash with a beer mug.
- **Joel:** medium build, glasses, clean shaven. Laptop smash with a visible wind-up and strike.

The characters are stylized avatars based on descriptions, rather than photographic likenesses. Combat is cartoonish, with no blood or realistic injury.

## Run locally

Serve this folder with any static HTTP server, for example `python3 -m http.server 8765`, then open `http://localhost:8765` in a current WebGL 2 browser. No build step, account, backend, or API keys are required.

## Deployment

GitHub Pages serves the root of the main branch. Three.js 0.180.0 is vendored in `vendor/` so the renderer does not depend on a runtime CDN. Its MIT license is included. The optional Google font falls back to system fonts if unavailable.
