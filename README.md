# Welcome to LegislAI

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

US Legislation on Artificial Intelligence has far reaching effects for private and public infrastructure. Our AI Legislation Tracker, LegislAI, is a tool for monitoring, analyzing, and visualizing the effects of AI laws, bills, and policies from a statewide and nationwide perspective. The tool aims to help researchers, policymakers, and the public understand how AI regulation is evolving across jurisdictions.

## Our Tech Stack

- Frontend: React Native + Expo, D3.js for visualizations

- Backend: FastAPI/Flask for API endpoints

- Data: TopoJSON/GeoJSON for maps, legislative APIs for bill data

## Get started

### Prerequisites

- [Download Node.js!](https://nodejs.org/en)
- ensure that node is installed and ensure the node package manager is there as well (test `node -v` and test `npm -v`)
- ensure that the react javascript framework is on your computer

## Client Construction

to setup the client, navigate to the project directory: `../../client`. Or out of the server folder using `cd ../` and into the client folder using `cd client`. After, entering the project ensure the following dependencies are installed:
[Node.js](https://nodejs.org/en)
> Note: You can check that Node.js and NPM are installed using `npm -v` and `node -v`

The client dependencies are installed using `npm install` in the client directory

Once you've installed the client side dependencies, start the project using the command `npx expo start` to run the project frontend, and once again `fastapi dev main.py` in a python virtual environment in the server directory to view the entire project.

## Server Construction

to setup the application server, navigate to the server folder of the project directory using `cd ../../server`
> Note: Ensure you have python and pip installed in order to run the dependencies

Once you've navigated to the directory download the python dependencies necessary create a virtual environment (`python -m venv env`) and start the virtual environment (`source venv/bin/activate` or `venv\Scripts\Activate` for Windows) to begin executing the server. 

Use the command: `pip install -r requirements.txt` to download the required dependencies. When your python virtual environment is running you want to enter: `fastapi dev main.py` in the virtual environment from the server directory to view the entire project.

