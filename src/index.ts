import App from "./scripts/App"

const app = new App()

const isReady = () =>
  new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve(true)
    } else {
      document.addEventListener("DOMContentLoaded", resolve)
    }
  })

isReady().then(() => app.init())
