# Setup PRF for Development
Youll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:

```git clone https://github.com/jacob-grahn/plant-right-4```

Or download Github Desktop and Clone the project that way.

## 2. Install node.js and npm:

https://nodejs.org/en/


## 3. Install dependencies (optionally you could install [yarn](https://yarnpkg.com/)):

Use Command Prompt to Navigate to the cloned repo's directory (plant-right-4\client).

Run:

```npm install```

or if you choose yarn, just run ```yarn```

## 4. Run the development server:

Run:

```npm run dev```

This will run a server so you can run the game in a browser.

Open your browser and enter localhost:3000 into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser.


## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.
