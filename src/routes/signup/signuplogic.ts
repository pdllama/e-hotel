type SignupFormData = {
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

enum AddressField {
    postal_code='postal_code', 
    city="city", 
    state="state", 
    country="country"
}
enum NameField {
    first_name="first_name", 
    middle_name="middle_name", 
    last_name="last_name"
}
enum StreetField {
    name="name",
    number="number",
    apt_number="apt_number"
}

const stateChanges = {
    handleSSNChange: (value:string, state:SignupFormData) => {return {...state, SSN: value}},
    handleNameChange: (value:string, state:SignupFormData, field:NameField) => {
       state.name[field] = value
    },

    handleStreetChange: (value:string, state:SignupFormData, field:StreetField) => {
        if (field !== StreetField.name) {
            if (value != "" && isNaN(parseInt(value))) {
                return
            }
        }

        // const newObj = type == "number" ? {number: value} : type == "apt_number" ? {apt_number: value} : {name: value}
        state.address.street[field] = value
    },

    handleAddressChange: (value:string, state:SignupFormData, field:AddressField) => {
        if (field == AddressField.postal_code) {
            // ... do special regex checking for postal code here
        }
       
        state.address[field] = value

    }
}

export {stateChanges, AddressField, NameField, StreetField}