1. I used React Router to manage the different pages(Components) that render the respective Forms for Returning, Creating and Renting Books
2. I used the Context API to store the contract from getContract() - since It doesn't change often ( in this App at least) I decided to use the Context API and make it easily accessible
3. Im'm using the built-in Loader when sending transactions and displaying a link with the transaction hash to Etherscan while the loader is visible
4. There is a forth Route - for showing all available books:
    Here I'm showing a list of all available books with a button, that when clicked shows more info about the particular book - Copies left and All Previous Renters
    Since showing the info of the individual book requires loading a new component and another fetch request to load the additional data for the book I decided NOT to create a separate route (with dynamic params e.g "/books/:id"), where it can get abused by calling the url multiple times with non-existent ID - thus reading unnecissarily data from the blockchain. Instead I'm just switching between the list of all Books and the individual books info windows.
5. The App is listening for events, an displaying notifications
6. Also errors are being handled if a transaction reverts
