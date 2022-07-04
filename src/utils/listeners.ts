import { showNotification } from "src/helpers/utilities"

function attachListeners(contract:any){
    contract.on("BookRented", (name:string,renter:string,trx:any) => { 
        console.log("Book has been rented")
        console.log(name,renter)
        showNotification("Book has been rented")
    })

    contract.on("NewBookAdded", (name:string,count:number,trx:any) => { 
        console.log("Book has been added")
        console.log(name,count)
        showNotification("Book has been added")
    })

    contract.on("BookReturned", (name:string,renter:string,trx:any) => { 
        console.log("Book has been returned")
        console.log(name,renter)
        showNotification("Book has been returned")
    })
    
}

export {attachListeners}