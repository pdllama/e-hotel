interface SignupFormData {
    SSN: string, 
    address: {
        street: {name: string, number: string, apt_number: string},
        postal_code: string,
        city: string,
        state: string,
        country: string
    }, 
    name: {
        first_name: string, 
        middle_name: string, 
        last_name: string
    }
}

const stateChanges = {
    handleSSNChange: (value:string, state:SignupFormData) => {return {...state, SSN: value}},
    handleNameChange: (value:string, state:SignupFormData, field:string) => {
        return {...state, name: {...state.name, [field]: value}}
    },

    handleStreetChange: (value:string, state:SignupFormData, field:string) => {
        if (field !== "name") {
            if (value != "" && isNaN(parseInt(value))) {
                return state
            }
        }

        // const newObj = type == "number" ? {number: value} : type == "apt_number" ? {apt_number: value} : {name: value}
        return {...state, address: {...state.address, street: {...state.address.street, [field]: value}}}
    },

    handleAddressChange: (value:string, state:SignupFormData, field:string) => {
        if (field == "postal_code") {
            // ... do special regex checking for postal code here
        }
        return {...state, [field]: value}
    }
}

export {stateChanges}