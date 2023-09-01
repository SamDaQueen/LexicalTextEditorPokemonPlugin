# Pokémon Plugin for the Lexical Text Editor 
![pickachu](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png)

This plugin adds support for fetching Pokémon from a remote API and
then inserting the Pokémon into the editor as neat little pills.

The project uses React + Vite + TypeScript.

## Installation


1. Clone this repository

2. Install dependencies

    - `npm install`

3. Start local server and run tests
    - `npm run start`
    - `npm run test-e2e-chromium` to run only chromium e2e tests
        - The server needs to be running for the e2e tests

`npm run start` will start both the dev server and collab server. If you don't need collab, use `npm run dev` to start just the dev server.

## Usage

1. Open the page at `http://localhost:5173/`
2. You will find the text editor with the Pokémon plugin loaded in the center of the page.
3. Type `@` to trigger the Pokémon plugin.
4. Type the name of a Pokémon to search for it.
5. Select a Pokémon from the list by clicking or selecting by arrow keys and pressing Enter to insert it into the editor.
6. An inline pill will show up with the image of the selected Pokémon along with its name.
7. Feel free to play around as it is a rich text editor and you can **bold**, _italicize_, etc. within the editor.