# Activity Chooser

Application to help choose activities depending on activity tags

![Create session](./demo/Screenshot%20From%202026-07-31%2020-32-11.png)
![New session](./demo/Screenshot%20From%202026-07-31%2020-32-17.png)
![Choosing preferences](./demo/Screenshot%20From%202026-07-31%2020-32-42.png)
![Notification after other user has chosen](./demo/Screenshot%20From%202026-07-31%2020-33-19.png)
![Case opening animation](./demo/Screenshot%20From%202026-07-31%2020-33-22.png)
![Chosen activity at random from compatible ones](./demo/Screenshot%20From%202026-07-31%2020-33-25.png)
[Demonstrational video](./demo/video.mp4)

How to use:
- Enter `/frontend`, run `npm run build`
- Enter `/backend`, run `./scripts/start.sh`

How to use with ngrok
- Optionally in `/frontend/vite.config.ts`, in allowedHosts add ngrok host for example `a-b-c.ngrok-free.dev`, set in frontend client that ngrok URL as backend URL for client in `/frontend/src/main.tsx` and rebuild, run `/backend/scripts/start.sh`, and later expose with ngrok `ngrok http 3000`
